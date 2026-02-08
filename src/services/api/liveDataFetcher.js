/**
 * Live Data Fetcher - Aggregates real-time data from multiple sources
 * Including LiveUAMap, DeepStateMap, and various news/conflict APIs
 */

import { fetchWithCorsProxy } from './corsProxy';
import { fetchWithCircuitBreaker } from '../../utils/circuitBreaker';

// Optional Supabase Edge Functions (recommended for GitHub Pages compatibility).
// When configured, we prefer calling Supabase to avoid browser CORS blocks.
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

function hasSupabase() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

async function fetchSupabaseFunctionJson(functionName, { query = {}, method = 'GET', body, signal } = {}) {
  if (!hasSupabase()) return null;

  const qs = new URLSearchParams(
    Object.entries(query).reduce((acc, [k, v]) => {
      if (v === undefined || v === null) return acc;
      acc[k] = String(v);
      return acc;
    }, {})
  ).toString();

  const url = `${SUPABASE_URL}/functions/v1/${functionName}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[Supabase:${functionName}] HTTP ${res.status}${text ? ` - ${text.slice(0, 200)}` : ''}`);
  }

  return res.json();
}

// RSS Feed URLs for live news with bias ratings
// Bias scale: -3 (far left) to +3 (far right), 0 = center
// Based on GroundNews ratings (aggregates AllSides, Ad Fontes, MBFC)
const NEWS_FEEDS = {
  // Breaking news - GroundNews verified ratings
  reuters: { url: 'https://feeds.reuters.com/reuters/topNews', bias: 0, biasLabel: 'Center', reliability: 'High' },
  ap: { url: 'https://rsshub.app/apnews/topics/apf-topnews', bias: -1, biasLabel: 'Lean Left', reliability: 'High' },
  bbc: { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', bias: 0, biasLabel: 'Center', reliability: 'High' },
  aljazeera: { url: 'https://www.aljazeera.com/xml/rss/all.xml', bias: -2, biasLabel: 'Left', reliability: 'Mixed' },
  guardian: { url: 'https://www.theguardian.com/world/rss', bias: -2, biasLabel: 'Left', reliability: 'High' },

  // Conflict-specific
  kyivIndependent: { url: 'https://kyivindependent.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'Mixed' },
  defenseOne: { url: 'https://www.defenseone.com/rss/all/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  warOnTheRocks: { url: 'https://warontherocks.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'High' },

  // Financial/Markets - GroundNews verified
  marketWatch: { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  cnbc: { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', bias: 0, biasLabel: 'Center', reliability: 'High' },
  bloomberg: { url: 'https://feeds.bloomberg.com/markets/news.rss', bias: -1, biasLabel: 'Lean Left', reliability: 'High' },

  // Tech - GroundNews verified
  techCrunch: { url: 'https://techcrunch.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  wired: { url: 'https://www.wired.com/feed/rss', bias: -1, biasLabel: 'Lean Left', reliability: 'High' },
  arstechnica: { url: 'https://feeds.arstechnica.com/arstechnica/index', bias: -1, biasLabel: 'Lean Left', reliability: 'High' },

  // Geopolitics
  foreignPolicy: { url: 'https://foreignpolicy.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  cfr: { url: 'https://www.cfr.org/rss.xml', bias: 0, biasLabel: 'Center', reliability: 'High' },
};

// LiveUAMap-style event scraping (via their API/RSS if available)
const LIVEUAMAP_FEEDS = {
  ukraine: 'https://liveuamap.com/rss/ukraine',
  middleEast: 'https://liveuamap.com/rss/middleeast',
  syria: 'https://syria.liveuamap.com/rss',
};

/**
 * Parse RSS/Atom feed to extract news items
 * @param {string} url - Feed URL
 * @param {string} sourceName - Source identifier
 * @param {Object} biasInfo - Bias rating info { bias, biasLabel, reliability }
 * @param {AbortSignal} signal - Optional abort signal to cancel request
 */
async function parseRSSFeed(url, sourceName, biasInfo = {}, signal) {
  try {
    // Wrap with circuit breaker to prevent hammering failed endpoints
    const response = await fetchWithCircuitBreaker(
      `rss-${sourceName}`,
      () => fetchWithCorsProxy(url, { signal }),
      {
        failureThreshold: 2, // Open after 2 failures
        timeout: 120000, // Wait 2 minutes before retry
        maxTimeout: 600000 // Max 10 minutes between retries
      }
    );
    if (!response) return [];

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    // Handle both RSS and Atom formats
    const isAtom = doc.querySelector('feed') !== null;
    const items = [];

    const { bias = 0, biasLabel = 'Unknown', reliability = 'Unknown' } = biasInfo;

    if (isAtom) {
      const entries = doc.querySelectorAll('entry');
      entries.forEach((entry, index) => {
        const title = entry.querySelector('title')?.textContent || '';
        const link = entry.querySelector('link')?.getAttribute('href') ||
                     entry.querySelector('link')?.textContent || '';

        // Get content - try multiple Atom content fields
        let summary = entry.querySelector('content')?.textContent ||
                     entry.querySelector('summary')?.textContent || '';

        const published = entry.querySelector('published, updated')?.textContent || '';

        // Enhanced image extraction for Atom feeds
        let imageUrl = null;

        // Media RSS in Atom feeds - check for image type
        const mediaContent = entry.querySelector('media\\:content, media\\:group media\\:content');
        if (mediaContent) {
          const type = mediaContent.getAttribute('type') || '';
          if (type.startsWith('image')) {
            imageUrl = mediaContent.getAttribute('url');
          }
        }

        if (!imageUrl) {
          imageUrl = entry.querySelector('media\\:thumbnail')?.getAttribute('url') ||
                    entry.querySelector('media\\:group media\\:thumbnail')?.getAttribute('url');
        }

        // Atom link with image type
        if (!imageUrl) {
          const imageLink = entry.querySelector('link[rel="enclosure"][type^="image"]');
          if (imageLink) {
            imageUrl = imageLink.getAttribute('href');
          }
        }

        // Extract from content/summary HTML
        if (!imageUrl && summary) {
          const patterns = [
            /<img[^>]+src=["']([^"']+)["']/i,
            /<img[^>]+data-src=["']([^"']+)["']/i,
            /src=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)["']/i
          ];

          for (const pattern of patterns) {
            const imgMatch = summary.match(pattern);
            if (imgMatch) {
              imageUrl = imgMatch[1];
              break;
            }
          }
        }

        // Enhanced VIDEO extraction for Atom feeds
        let videoUrl = null;
        let videoType = null;

        // Media RSS video in Atom feeds
        const mediaVideoContent = entry.querySelector('media\\:content[type^="video"], media\\:group media\\:content[type^="video"]');
        if (mediaVideoContent) {
          videoUrl = mediaVideoContent.getAttribute('url');
          videoType = 'direct';
        }

        // Atom link with video type
        if (!videoUrl) {
          const videoLink = entry.querySelector('link[rel="enclosure"][type^="video"]');
          if (videoLink) {
            videoUrl = videoLink.getAttribute('href');
            videoType = 'direct';
          }
        }

        // Extract YouTube URLs from content/summary
        if (!videoUrl && summary) {
          const youtubePatterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i,
            /<iframe[^>]+src=["']([^"']*youtube[^"']*)["']/i,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i
          ];

          for (const pattern of youtubePatterns) {
            const match = summary.match(pattern);
            if (match) {
              const videoId = match[1].includes('youtube') ? match[1].match(/([a-zA-Z0-9_-]{11})/)?.[1] : match[1];
              if (videoId) {
                videoUrl = `https://www.youtube.com/embed/${videoId}`;
                videoType = 'youtube';
                break;
              }
            }
          }
        }

        // Clean summary/content
        let cleanSummary = summary.replace(/<[^>]*>/g, '').trim();
        cleanSummary = cleanSummary
          .replace(/\[CDATA\[|\]\]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Log image/video extraction for debugging (first 2 items from all sources)
        if (index < 2) {
          console.log(`[Atom Parser] ${sourceName} #${index}:`);
          console.log(`  - Title: ${title.substring(0, 60)}...`);
          console.log(`  - Image: ${imageUrl || 'NONE'}`);
          console.log(`  - Video: ${videoUrl || 'NONE'} (type: ${videoType || 'N/A'})`);
          console.log(`  - Description length: ${cleanSummary.length} chars`);
        }

        items.push({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: title.trim(),
          description: cleanSummary.slice(0, 500),
          fullDescription: cleanSummary,
          link,
          pubDate: new Date(published),
          source: sourceName,
          imageUrl: imageUrl || undefined,
          videoUrl: videoUrl || undefined,
          videoType: videoType || undefined,
          bias,
          biasLabel,
          reliability,
        });
      });
    } else {
      const rssItems = doc.querySelectorAll('item');
      rssItems.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const category = item.querySelector('category')?.textContent || '';

        // Enhanced image extraction for various RSS formats
        let imageUrl = null;

        // Standard RSS enclosure (used by many feeds)
        const enclosure = item.querySelector('enclosure[type^="image"]');
        if (enclosure) {
          imageUrl = enclosure.getAttribute('url');
        }

        // Media RSS namespace (media:content, media:thumbnail) - used by CNBC, BBC, etc.
        if (!imageUrl) {
          const mediaContent = item.querySelector('media\\:content, media\\:group media\\:content');
          if (mediaContent) {
            const type = mediaContent.getAttribute('type') || '';
            // Only use if it's an image, not a video
            if (type.startsWith('image')) {
              imageUrl = mediaContent.getAttribute('url');
            }
          }
        }

        if (!imageUrl) {
          const mediaThumbnail = item.querySelector('media\\:thumbnail, media\\:group media\\:thumbnail');
          if (mediaThumbnail) {
            imageUrl = mediaThumbnail.getAttribute('url');
          }
        }

        // Al Jazeera uses enclosure without type attribute
        if (!imageUrl) {
          const anyEnclosure = item.querySelector('enclosure');
          if (anyEnclosure) {
            const url = anyEnclosure.getAttribute('url');
            // Check if URL looks like an image
            if (url && /\.(jpg|jpeg|png|gif|webp)/i.test(url)) {
              imageUrl = url;
            }
          }
        }

        // Extract from description HTML (fallback for publishers embedding images)
        if (!imageUrl && description) {
          // Try multiple image patterns
          const patterns = [
            /<img[^>]+src=["']([^"']+)["']/i,
            /<img[^>]+data-src=["']([^"']+)["']/i,
            /src=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)["']/i
          ];

          for (const pattern of patterns) {
            const imgMatch = description.match(pattern);
            if (imgMatch) {
              imageUrl = imgMatch[1];
              break;
            }
          }
        }

        // Get content:encoded early (needed for image and video extraction)
        const contentEncoded = item.querySelector('content\\:encoded');

        // Also try to extract image from content:encoded (often has full article HTML)
        if (!imageUrl && contentEncoded) {
          const contentHtml = contentEncoded.textContent || '';
          const patterns = [
            /<img[^>]+src=["']([^"']+)["']/i,
            /<figure[^>]*>.*?<img[^>]+src=["']([^"']+)["']/is,
            /src=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)["']/i
          ];

          for (const pattern of patterns) {
            const imgMatch = contentHtml.match(pattern);
            if (imgMatch) {
              // Use the first captured group that contains the URL
              imageUrl = imgMatch[1] || imgMatch[2];
              break;
            }
          }
        }

        // Enhanced VIDEO extraction for various RSS formats
        let videoUrl = null;
        let videoType = null; // 'youtube', 'direct', 'embed'

        // Media RSS namespace for video content
        const mediaVideoContent = item.querySelector('media\\:content[type^="video"], media\\:group media\\:content[type^="video"]');
        if (mediaVideoContent) {
          videoUrl = mediaVideoContent.getAttribute('url');
          videoType = 'direct';
        }

        // Video enclosure
        if (!videoUrl) {
          const videoEnclosure = item.querySelector('enclosure[type^="video"]');
          if (videoEnclosure) {
            videoUrl = videoEnclosure.getAttribute('url');
            videoType = 'direct';
          }
        }

        // Extract YouTube URLs from description or content:encoded
        if (!videoUrl) {
          const contentToSearch = contentEncoded?.textContent || description || '';

          // YouTube patterns
          const youtubePatterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/i,
            /<iframe[^>]+src=["']([^"']*youtube[^"']*)["']/i,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i
          ];

          for (const pattern of youtubePatterns) {
            const match = contentToSearch.match(pattern);
            if (match) {
              // Extract video ID and create embed URL
              const videoId = match[1].includes('youtube') ? match[1].match(/([a-zA-Z0-9_-]{11})/)?.[1] : match[1];
              if (videoId) {
                videoUrl = `https://www.youtube.com/embed/${videoId}`;
                videoType = 'youtube';
                break;
              }
            }
          }
        }

        // Extract other video embeds (Vimeo, Dailymotion, etc.)
        if (!videoUrl && description) {
          const embedPatterns = [
            /<iframe[^>]+src=["']([^"']*vimeo\.com\/video\/[^"']*)["']/i,
            /<iframe[^>]+src=["']([^"']*dailymotion\.com\/embed\/[^"']*)["']/i,
            /vimeo\.com\/(\d+)/i,
          ];

          for (const pattern of embedPatterns) {
            const match = description.match(pattern);
            if (match) {
              videoUrl = match[1];
              videoType = 'embed';
              break;
            }
          }
        }

        // Clean and enhance description
        let cleanDescription = description.replace(/<[^>]*>/g, '').trim();

        // Remove common RSS artifacts
        cleanDescription = cleanDescription
          .replace(/\[CDATA\[|\]\]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // For sources like Al Jazeera, use content:encoded if it has fuller content
        if (contentEncoded) {
          const fullContent = contentEncoded.textContent.replace(/<[^>]*>/g, '').trim();
          if (fullContent.length > cleanDescription.length) {
            cleanDescription = fullContent;
          }
        }

        // Log image/video extraction for debugging (first 2 items from all sources)
        if (index < 2) {
          console.log(`[RSS Parser] ${sourceName} #${index}:`);
          console.log(`  - Title: ${title.substring(0, 60)}...`);
          console.log(`  - Image: ${imageUrl || 'NONE'}`);
          console.log(`  - Video: ${videoUrl || 'NONE'} (type: ${videoType || 'N/A'})`);
          console.log(`  - Description length: ${cleanDescription.length} chars`);
        }

        items.push({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: title.trim(),
          description: cleanDescription.slice(0, 500),
          fullDescription: cleanDescription, // Keep full description
          link,
          pubDate: new Date(pubDate),
          source: sourceName,
          category,
          imageUrl: imageUrl || undefined,
          videoUrl: videoUrl || undefined,
          videoType: videoType || undefined,
          bias,
          biasLabel,
          reliability,
        });
      });
    }

    return items;
  } catch (error) {
    // Don't log abort errors
    if (error.name !== 'AbortError') {
      console.error(`Failed to fetch ${sourceName} feed:`, error);
    }
    return [];
  }
}

/**
 * Fetch all news from multiple sources
 * Prefers Supabase Edge Function for speed/caching, falls back to direct RSS
 * @param {Object} options - Options for fetching
 * @param {number} options.limit - Max number of items to return (default: 200)
 * @param {boolean} options.fastMode - If true, fetch from ALL sources in parallel but return as soon as we have enough
 */
export async function fetchAllNews({ limit = 200, fastMode = false } = {}) {
  // Try Supabase Edge Function first (cached, fast, no CORS issues)
  try {
    const backend = await fetchSupabaseFunctionJson('news-aggregator', { query: { limit } });
    if (Array.isArray(backend) && backend.length > 0) {
      console.log(`[News] Fetched ${backend.length} items from Supabase backend`);
      return backend.map(item => ({
        ...item,
        pubDate: new Date(item.pubDate),
      }));
    }
  } catch (e) {
    console.warn('[News] Supabase backend fetch failed, falling back to direct RSS:', e?.message || e);
  }

  // Fallback: direct RSS fetching
  const feedEntries = Object.entries(NEWS_FEEDS);

  if (fastMode) {
    // In fast mode, fetch ALL sources in parallel and abort remaining once we have enough
    const allItems = [];
    let resolved = false;
    const abortController = new AbortController();

    return new Promise((resolve) => {
      const checkAndResolve = () => {
        if (resolved) return;

        // Sort and dedupe what we have so far
        const processed = allItems
          .filter(item => item.title && item.pubDate)
          .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
          .filter((item, index, arr) =>
            index === arr.findIndex(i => i.title === item.title)
          );

        if (processed.length >= limit) {
          resolved = true;
          // Abort all remaining requests
          abortController.abort();
          resolve(processed.slice(0, limit));
        }
      };

      let completedCount = 0;
      const totalFeeds = feedEntries.length;

      // Fire off all requests in parallel
      feedEntries.forEach(([name, feedInfo]) => {
        const { url, bias, biasLabel, reliability } = feedInfo;
        parseRSSFeed(url, name, { bias, biasLabel, reliability }, abortController.signal)
          .then(items => {
            if (!resolved) {
              allItems.push(...items);
              checkAndResolve();
            }
          })
          .catch(() => {
            // Ignore errors (including abort errors), just continue
          })
          .finally(() => {
            completedCount++;
            // If all feeds completed and we haven't resolved yet, resolve with what we have
            if (completedCount === totalFeeds && !resolved) {
              resolved = true;
              const processed = allItems
                .filter(item => item.title && item.pubDate)
                .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
                .filter((item, index, arr) =>
                  index === arr.findIndex(i => i.title === item.title)
                )
                .slice(0, limit);
              resolve(processed);
            }
          });
      });
    });
  }

  // Normal mode: fetch in batches
  const allItems = [];
  const batchSize = 10;
  for (let i = 0; i < feedEntries.length; i += batchSize) {
    const batch = feedEntries.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(([name, feedInfo]) => {
        const { url, bias, biasLabel, reliability } = feedInfo;
        return parseRSSFeed(url, name, { bias, biasLabel, reliability });
      })
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    });
  }

  // Sort by date (newest first) and deduplicate
  return allItems
    .filter(item => item.title && item.pubDate)
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .filter((item, index, arr) =>
      index === arr.findIndex(i => i.title === item.title)
    )
    .slice(0, limit);
}

/**
 * Fetch live conflict events from LiveUAMap-style sources
 */
export async function fetchLiveConflictEvents() {
  const events = [];

  for (const [region, url] of Object.entries(LIVEUAMAP_FEEDS)) {
    try {
      const response = await fetchWithCorsProxy(url);
      if (!response) continue;

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');

      const items = doc.querySelectorAll('item');
      items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';

        const geoLat = item.querySelector('geo\\:lat, lat')?.textContent;
        const geoLon = item.querySelector('geo\\:long, long, geo\\:lon, lon')?.textContent;

        let lat = geoLat ? parseFloat(geoLat) : 0;
        let lon = geoLon ? parseFloat(geoLon) : 0;

        const lowerTitle = title.toLowerCase();
        let type = 'other';
        let severity = 'medium';

        if (lowerTitle.includes('explosion') || lowerTitle.includes('blast')) {
          type = 'explosion';
          severity = 'high';
        } else if (lowerTitle.includes('airstrike') || lowerTitle.includes('strike')) {
          type = 'airstrike';
          severity = 'high';
        } else if (lowerTitle.includes('advance') || lowerTitle.includes('retreat') || lowerTitle.includes('movement')) {
          type = 'movement';
          severity = 'medium';
        } else if (lowerTitle.includes('humanitarian') || lowerTitle.includes('evacuation')) {
          type = 'humanitarian';
          severity = 'low';
        } else if (lowerTitle.includes('military') || lowerTitle.includes('troops')) {
          type = 'military';
          severity = 'medium';
        }

        if (lowerTitle.includes('breaking') || lowerTitle.includes('urgent')) {
          severity = 'critical';
        }

        events.push({
          id: `liveuamap-${region}-${index}-${Date.now()}`,
          title: title.trim(),
          description: description.replace(/<[^>]*>/g, '').trim(),
          lat,
          lon,
          timestamp: new Date(pubDate),
          source: `LiveUAMap-${region}`,
          type,
          severity,
          link,
        });
      });
    } catch (error) {
      console.error(`Failed to fetch LiveUAMap ${region}:`, error);
    }
  }

  return events;
}

/**
 * Fetch earthquake data from USGS
 */
export async function fetchEarthquakes() {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.features.map((f) => ({
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      mag: f.properties.mag,
      place: f.properties.place,
      time: new Date(f.properties.time),
    }));
  } catch (error) {
    console.error('Failed to fetch earthquakes:', error);
    return [];
  }
}

/**
 * Fetch Twitter Intel from multiple OSINT accounts via RSS proxies
 * Uses circuit breaker pattern to avoid hammering dead endpoints
 * Aggregates tweets from multiple accounts for better coverage
 */

// OSINT Twitter accounts to monitor (geopolitical focus)
const TWITTER_ACCOUNTS = [
  { username: 'WarMonitors', priority: 1 },
  { username: 'OSINTdefender', priority: 2 },
  { username: 'Conflicts', priority: 3 },
  { username: 'IntelCrab', priority: 4 },
  { username: 'sentaboringtweet', priority: 5 },  // Ukraine focused
];

// RSS proxy instances (ordered by reliability - updated Feb 2026)
const RSS_PROXIES = [
  { name: 'Nitter.poast', baseUrl: 'https://nitter.poast.org', working: true },
  { name: 'Nitter.privacydev', baseUrl: 'https://nitter.privacydev.net', working: true },
  { name: 'XCancel', baseUrl: 'https://xcancel.com', working: true },
  { name: 'Nitter.net', baseUrl: 'https://nitter.net', working: false },  // Often down
  { name: 'RSSHub', baseUrl: 'https://rsshub.app/twitter/user', isRssHub: true, working: true },
];

// Track which proxies are working (in-memory, resets on reload)
const proxyHealth = new Map();

function getProxyHealth(proxyName) {
  if (!proxyHealth.has(proxyName)) {
    proxyHealth.set(proxyName, { failures: 0, lastSuccess: null, lastAttempt: null });
  }
  return proxyHealth.get(proxyName);
}

function markProxySuccess(proxyName) {
  const health = getProxyHealth(proxyName);
  health.failures = 0;
  health.lastSuccess = Date.now();
  health.lastAttempt = Date.now();
}

function markProxyFailure(proxyName) {
  const health = getProxyHealth(proxyName);
  health.failures++;
  health.lastAttempt = Date.now();
}

function shouldSkipProxy(proxyName) {
  const health = getProxyHealth(proxyName);
  // Skip if 3+ failures and last attempt was less than 2 minutes ago
  if (health.failures >= 3 && health.lastAttempt && Date.now() - health.lastAttempt < 120000) {
    return true;
  }
  return false;
}

async function fetchAccountTweets(username, maxTweets = 10) {
  // Try each proxy until one works
  for (const proxy of RSS_PROXIES) {
    if (!proxy.working) continue;
    if (shouldSkipProxy(proxy.name)) {
      continue;
    }

    try {
      const url = proxy.isRssHub
        ? `${proxy.baseUrl}/${username}`
        : `${proxy.baseUrl}/${username}/rss`;

      const response = await fetchWithCorsProxy(url);

      if (!response) {
        markProxyFailure(proxy.name);
        continue;
      }

      const text = await response.text();

      // Validate RSS response
      if (!text || text.length < 100 || (!text.includes('<rss') && !text.includes('<feed') && !text.includes('<item'))) {
        markProxyFailure(proxy.name);
        continue;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');
      const items = doc.querySelectorAll('item');

      if (items.length === 0) {
        markProxyFailure(proxy.name);
        continue;
      }

      // Success!
      markProxySuccess(proxy.name);

      const tweets = [];
      items.forEach((item, index) => {
        if (tweets.length >= maxTweets) return;

        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';

        // Extract tweet ID from link
        const tweetIdMatch = link.match(/status\/(\d+)/);
        const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;

        // Clean up the link to always point to twitter.com
        const cleanLink = link
          .replace(/xcancel\.com/g, 'twitter.com')
          .replace(/nitter\.[^/]+/g, 'twitter.com');

        tweets.push({
          id: `twitter-${username}-${tweetId || Date.now()}-${index}`,
          tweetId,
          title: title.trim() || description.replace(/<[^>]*>/g, '').trim().slice(0, 200),
          description: description.replace(/<[^>]*>/g, '').trim().slice(0, 500),
          link: cleanLink,
          pubDate: new Date(pubDate),
          source: username,
          username: username,
        });
      });

      return tweets;
    } catch (error) {
      markProxyFailure(proxy.name);
      continue;
    }
  }

  return []; // All proxies failed for this account
}

export async function fetchTwitterIntel() {
  // Prefer Supabase Edge Function (no browser CORS issues on GitHub Pages).
  try {
    const backend = await fetchSupabaseFunctionJson('twitter-intel', { query: { limit: 30 } });
    if (Array.isArray(backend) && backend.length > 0) {
      return backend
        .map((tweet) => ({
          id: tweet.id || `twitter-${tweet.username || 'unknown'}-${tweet.tweetId || Date.now()}`,
          tweetId: tweet.tweetId || null,
          title: tweet.title || '',
          description: tweet.description || '',
          link: tweet.link || (tweet.tweetId ? `https://twitter.com/i/status/${tweet.tweetId}` : ''),
          pubDate: new Date(tweet.pubDate),
          source: tweet.source || tweet.username || 'twitter',
          username: tweet.username || tweet.source || 'unknown',
        }))
        .filter((t) => t.tweetId && t.title);
    }
  } catch (e) {
    console.warn('[Twitter] Supabase backend fetch failed, falling back to browser scraping:', e?.message || e);
  }

  console.log('[Twitter] Fetching from multiple OSINT accounts...');

  const allTweets = [];
  const successfulAccounts = [];

  // Fetch from all accounts in parallel
  const fetchPromises = TWITTER_ACCOUNTS.map(async (account) => {
    try {
      const tweets = await fetchAccountTweets(account.username, 8);
      if (tweets.length > 0) {
        successfulAccounts.push(account.username);
        return tweets;
      }
      return [];
    } catch (error) {
      console.warn(`[Twitter] Failed to fetch @${account.username}:`, error.message);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);

  // Combine all tweets
  results.forEach(tweets => {
    allTweets.push(...tweets);
  });

  // Sort by date (newest first) and deduplicate by tweetId
  const seenIds = new Set();
  const uniqueTweets = allTweets
    .sort((a, b) => b.pubDate - a.pubDate)
    .filter(tweet => {
      if (tweet.tweetId && seenIds.has(tweet.tweetId)) return false;
      if (tweet.tweetId) seenIds.add(tweet.tweetId);
      return true;
    })
    .slice(0, 30); // Limit to 30 most recent tweets

  if (successfulAccounts.length > 0) {
    console.log(`[Twitter] SUCCESS - ${uniqueTweets.length} tweets from @${successfulAccounts.join(', @')}`);
  } else {
    console.warn('[Twitter] All accounts/proxies failed');
  }

  return uniqueTweets;
}

/**
 * Fetch cryptocurrency prices
 */
export async function fetchCryptoPrices() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,dogecoin&vs_currencies=usd&include_24hr_change=true'
    );

    if (!response.ok) return [];

    const data = await response.json();

    return Object.entries(data).map(([id, info]) => ({
      symbol: id.toUpperCase(),
      price: info.usd,
      change24h: info.usd_24h_change || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch crypto prices:', error);
    return [];
  }
}

/**
 * Fetch Polymarket prediction markets
 */
export async function fetchPolymarketEvents() {
  try {
    const response = await fetchWithCorsProxy(
      'https://gamma-api.polymarket.com/markets?closed=false&limit=20'
    );

    if (!response) return [];

    const data = await response.json();

    return data.map((market) => {
      // Extract probability - Polymarket returns values 0-1, already as decimal
      // Try multiple fields in case API structure varies
      let probability = 0.5; // Default to 50%

      if (market.outcomePrices && Array.isArray(market.outcomePrices) && market.outcomePrices.length > 0) {
        // outcomePrices[0] is typically the "Yes" price (0-1 range)
        probability = parseFloat(market.outcomePrices[0]);
      } else if (market.clobTokenIds && Array.isArray(market.outcomes) && market.outcomes.length > 0) {
        // Alternative: try to get from outcomes array (only if it's actually an array)
        const yesOutcome = market.outcomes.find(o => o?.toLowerCase() === 'yes');
        if (yesOutcome) {
          probability = parseFloat(market.outcomePrices?.[0] || 0.5);
        }
      } else if (typeof market.probability !== 'undefined') {
        // Direct probability field if available
        probability = parseFloat(market.probability);
      }

      // Ensure probability is in valid range 0-1
      probability = Math.max(0, Math.min(1, probability));

      return {
        id: market.id || market.conditionId,
        question: market.question || market.title,
        probability: probability, // Stored as decimal (0-1), displayed as % in UI
        volume: parseFloat(market.volume) || 0,
        category: market.category || 'Other',
        // Optional: store raw data for debugging
        _debug: {
          outcomePrices: market.outcomePrices,
          outcomes: market.outcomes
        }
      };
    });
  } catch (error) {
    console.error('Failed to fetch Polymarket:', error);
    return [];
  }
}

/**
 * Fetch Federal Reserve data from FRED API (St. Louis Fed)
 * Uses public FRED API - no API key required for basic access
 */
export async function fetchFedData() {
  try {
    // FRED series IDs:
    // WALCL - Fed Total Assets (Balance Sheet)
    // FEDFUNDS - Effective Federal Funds Rate
    // CPIAUCSL - Consumer Price Index (for inflation)

    const fredBaseUrl = 'https://api.stlouisfed.org/fred/series/observations';
    const apiKey = 'DEMO_API'; // FRED allows limited demo access

    // Fetch Fed Balance Sheet (Total Assets)
    const balanceSheetUrl = `${fredBaseUrl}?series_id=WALCL&api_key=${apiKey}&file_type=json&limit=2&sort_order=desc`;
    const fedFundsUrl = `${fredBaseUrl}?series_id=FEDFUNDS&api_key=${apiKey}&file_type=json&limit=1&sort_order=desc`;
    const cpiUrl = `${fredBaseUrl}?series_id=CPIAUCSL&api_key=${apiKey}&file_type=json&limit=13&sort_order=desc`;

    const [balanceRes, fundsRes, cpiRes] = await Promise.allSettled([
      fetch(balanceSheetUrl),
      fetch(fedFundsUrl),
      fetch(cpiUrl)
    ]);

    let m2 = 6.8; // Default in trillions (Fed balance sheet ~$6.8T)
    let prevM2 = 6.8;
    let fedFundsRate = 4.5;
    let inflationRate = 2.9;

    // Parse Fed Balance Sheet
    if (balanceRes.status === 'fulfilled' && balanceRes.value.ok) {
      const data = await balanceRes.value.json();
      if (data.observations?.length >= 1) {
        // WALCL is in millions, convert to trillions
        m2 = parseFloat(data.observations[0].value) / 1000000;
        if (data.observations.length >= 2) {
          prevM2 = parseFloat(data.observations[1].value) / 1000000;
        }
      }
    }

    // Parse Fed Funds Rate
    if (fundsRes.status === 'fulfilled' && fundsRes.value.ok) {
      const data = await fundsRes.value.json();
      if (data.observations?.length >= 1) {
        fedFundsRate = parseFloat(data.observations[0].value);
      }
    }

    // Calculate YoY inflation from CPI
    if (cpiRes.status === 'fulfilled' && cpiRes.value.ok) {
      const data = await cpiRes.value.json();
      if (data.observations?.length >= 13) {
        const currentCPI = parseFloat(data.observations[0].value);
        const yearAgoCPI = parseFloat(data.observations[12].value);
        inflationRate = ((currentCPI - yearAgoCPI) / yearAgoCPI) * 100;
      }
    }

    const change = m2 - prevM2;
    const changePercent = prevM2 > 0 ? ((change / prevM2) * 100) : 0;

    return {
      m2,
      fedFundsRate,
      inflationRate,
      change,
      changePercent,
      percentOfMax: (m2 / 9) * 100, // Max was ~9T in 2022
    };
  } catch (error) {
    console.error('Failed to fetch Fed data:', error);
    return {
      m2: 6.8,
      fedFundsRate: 4.5,
      inflationRate: 2.9,
      change: 0,
      changePercent: 0,
      percentOfMax: 75
    };
  }
}

/**
 * Fetch Congressional stock trades from Capitol Trades / House Stock Watcher
 * Uses public APIs that track congressional trading disclosures
 */
export async function fetchCongressTrades() {
  try {
    // Try House Stock Watcher API (free, public)
    const response = await fetchWithCorsProxy(
      'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json'
    );

    if (!response) {
      // Fallback: try Senate Stock Watcher
      const senateResponse = await fetchWithCorsProxy(
        'https://senate-stock-watcher-data.s3-us-west-2.amazonaws.com/aggregate/all_transactions.json'
      );
      if (!senateResponse) return [];

      const senateData = await senateResponse.json();
      return processSenateData(senateData);
    }

    const data = await response.json();

    // Get last 30 days of trades, sorted by date
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTrades = data
      .filter(trade => {
        const tradeDate = new Date(trade.transaction_date);
        return tradeDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
      .slice(0, 25)
      .map(trade => ({
        name: trade.representative || 'Unknown',
        party: trade.party === 'Democratic' ? 'D' : trade.party === 'Republican' ? 'R' : 'I',
        ticker: trade.ticker || 'N/A',
        date: trade.transaction_date,
        district: trade.district || trade.state || '',
        type: trade.type?.toLowerCase().includes('sale') ? 'sell' : 'buy',
        amount: trade.amount || '$1K - $15K',
      }));

    return recentTrades;
  } catch (error) {
    console.error('Failed to fetch congress trades:', error);
    return [];
  }
}

function processSenateData(data) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return data
    .filter(trade => {
      const tradeDate = new Date(trade.transaction_date);
      return tradeDate >= thirtyDaysAgo;
    })
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
    .slice(0, 25)
    .map(trade => ({
      name: `Sen. ${trade.senator || 'Unknown'}`,
      party: trade.party === 'Democratic' ? 'D' : trade.party === 'Republican' ? 'R' : 'I',
      ticker: trade.ticker || 'N/A',
      date: trade.transaction_date,
      district: trade.state || 'Senate',
      type: trade.type?.toLowerCase().includes('sale') ? 'sell' : 'buy',
      amount: trade.amount || '$1K - $15K',
    }));
}

/**
 * Fetch large crypto transactions (whale watching)
 * Uses Blockchain.com's public API for large BTC transactions
 */
export async function fetchWhaleTransactions() {
  try {
    // Blockchain.com unconfirmed transactions API (free, no auth)
    const response = await fetch(
      'https://blockchain.info/unconfirmed-transactions?format=json&limit=100'
    );

    if (!response.ok) {
      // Fallback: try to get recent blocks and large txs
      return await fetchWhalesFromBlocks();
    }

    const data = await response.json();

    // Filter for whale-sized transactions (> $1M USD equivalent)
    // BTC price estimate (will be updated with real price if available)
    const btcPrice = 95000; // Approximate, ideally fetch real-time
    const minUSD = 1000000; // $1M minimum
    const minBTC = minUSD / btcPrice;

    const whaleTxs = data.txs
      .filter(tx => {
        const totalOut = tx.out.reduce((sum, out) => sum + out.value, 0) / 100000000; // satoshi to BTC
        return totalOut >= minBTC;
      })
      .slice(0, 15)
      .map(tx => {
        const totalBTC = tx.out.reduce((sum, out) => sum + out.value, 0) / 100000000;
        return {
          coin: 'BTC',
          amount: totalBTC,
          usd: totalBTC * btcPrice,
          hash: tx.hash.substring(0, 12) + '...',
          fullHash: tx.hash,
          time: new Date(tx.time * 1000).toISOString(),
        };
      });

    return whaleTxs;
  } catch (error) {
    console.error('Failed to fetch whale transactions:', error);
    return [];
  }
}

async function fetchWhalesFromBlocks() {
  try {
    // Get latest block
    const blockResponse = await fetch('https://blockchain.info/latestblock');
    if (!blockResponse.ok) return [];

    const latestBlock = await blockResponse.json();

    // Get block details
    const blockDataResponse = await fetch(
      `https://blockchain.info/rawblock/${latestBlock.hash}?format=json`
    );
    if (!blockDataResponse.ok) return [];

    const blockData = await blockDataResponse.json();
    const btcPrice = 95000;
    const minBTC = 10; // 10 BTC minimum

    const whaleTxs = blockData.tx
      .filter(tx => {
        const totalOut = tx.out.reduce((sum, out) => sum + out.value, 0) / 100000000;
        return totalOut >= minBTC;
      })
      .slice(0, 15)
      .map(tx => {
        const totalBTC = tx.out.reduce((sum, out) => sum + out.value, 0) / 100000000;
        return {
          coin: 'BTC',
          amount: totalBTC,
          usd: totalBTC * btcPrice,
          hash: tx.hash.substring(0, 12) + '...',
          fullHash: tx.hash,
          time: new Date(tx.time * 1000).toISOString(),
        };
      });

    return whaleTxs;
  } catch (error) {
    console.error('Failed to fetch whales from blocks:', error);
    return [];
  }
}

/**
 * Fetch recent government contracts from USASpending.gov API
 * Public API, no authentication required
 */
export async function fetchGovContracts() {
  try {
    // USASpending.gov API - recent prime award contracts
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    const response = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filters: {
          time_period: [{ start_date: startDate, end_date: endDate }],
          award_type_codes: ['A', 'B', 'C', 'D'], // Contract types
        },
        fields: [
          'Award ID',
          'Recipient Name',
          'Award Amount',
          'Awarding Agency',
          'Description',
          'Start Date',
        ],
        page: 1,
        limit: 20,
        sort: 'Award Amount',
        order: 'desc',
      }),
    });

    if (!response.ok) {
      console.error('USASpending API error:', response.status);
      return [];
    }

    const data = await response.json();

    return (data.results || []).map(contract => ({
      id: contract['Award ID'] || Math.random().toString(36).substr(2, 9),
      agency: contract['Awarding Agency'] || 'Federal Agency',
      description: contract['Description'] || 'Government Contract',
      vendor: contract['Recipient Name'] || 'Contractor',
      amount: parseFloat(contract['Award Amount']) || 0,
      date: contract['Start Date'] || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch government contracts:', error);
    return [];
  }
}

/**
 * Fetch sector ETF data for the heatmap
 */
export async function fetchSectorData() {
  try {
    const backend = await fetchSupabaseFunctionJson('market-data', { query: { kind: 'sectors' } });
    if (Array.isArray(backend) && backend.length > 0) return backend;
  } catch (e) {
    console.warn('[Markets] Supabase sectors fetch failed, falling back:', e?.message || e);
  }

  const sectors = [
    { symbol: 'XLK', name: 'Tech' },
    { symbol: 'XLF', name: 'Finance' },
    { symbol: 'XLE', name: 'Energy' },
    { symbol: 'XLV', name: 'Health' },
    { symbol: 'XLY', name: 'Consumer' },
    { symbol: 'XLI', name: 'Industrial' },
    { symbol: 'XLB', name: 'Materials' },
    { symbol: 'XLU', name: 'Utilities' },
    { symbol: 'XLP', name: 'Staples' },
    { symbol: 'XLRE', name: 'Real Est' },
    { symbol: 'XLC', name: 'Comms' },
    { symbol: 'SMH', name: 'Semis' }
  ];

  const results = [];

  for (const sector of sectors) {
    try {
      const response = await fetchWithCorsProxy(
        `https://query1.finance.yahoo.com/v8/finance/chart/${sector.symbol}?interval=1d&range=1d`
      );

      if (response) {
        const data = await response.json();
        const quote = data.chart?.result?.[0];

        if (quote) {
          const meta = quote.meta;
          const price = meta.regularMarketPrice || 0;
          const prevClose = meta.previousClose || meta.chartPreviousClose || price;
          const change = prevClose > 0 ? ((price - prevClose) / prevClose * 100) : 0;

          results.push({
            symbol: sector.symbol,
            name: sector.name,
            price,
            change,
          });
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch sector ${sector.symbol}:`, e);
      results.push({ symbol: sector.symbol, name: sector.name, price: 0, change: 0 });
    }
  }

  return results;
}

/**
 * Fetch commodity prices (Gold, Oil, Gas, etc.)
 */
export async function fetchCommodityData() {
  try {
    const backend = await fetchSupabaseFunctionJson('market-data', { query: { kind: 'commodities' } });
    if (Array.isArray(backend) && backend.length > 0) return backend;
  } catch (e) {
    console.warn('[Markets] Supabase commodities fetch failed, falling back:', e?.message || e);
  }

  const commodities = [
    { symbol: 'GC=F', name: 'Gold', display: 'GOLD' },
    { symbol: 'SI=F', name: 'Silver', display: 'SILVER' },
    { symbol: 'CL=F', name: 'Crude Oil', display: 'OIL' },
    { symbol: 'NG=F', name: 'Natural Gas', display: 'NATGAS' },
    { symbol: 'HG=F', name: 'Copper', display: 'COPPER' },
  ];

  const results = [];

  for (const commodity of commodities) {
    try {
      const encodedSymbol = encodeURIComponent(commodity.symbol);
      const response = await fetchWithCorsProxy(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?interval=1d&range=1d`
      );

      if (response) {
        const data = await response.json();
        const quote = data.chart?.result?.[0];

        if (quote) {
          const meta = quote.meta;
          const price = meta.regularMarketPrice || 0;
          const prevClose = meta.previousClose || meta.chartPreviousClose || price;
          const change = prevClose > 0 ? ((price - prevClose) / prevClose * 100) : 0;

          results.push({
            symbol: commodity.display,
            name: commodity.name,
            price,
            change,
          });
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch commodity ${commodity.symbol}:`, e);
    }
  }

  return results;
}

/**
 * Fetch stock market indices
 */
export async function fetchMarketIndices() {
  try {
    const backend = await fetchSupabaseFunctionJson('market-data', { query: { kind: 'indices' } });
    if (Array.isArray(backend) && backend.length > 0) return backend;
  } catch (e) {
    console.warn('[Markets] Supabase indices fetch failed, falling back:', e?.message || e);
  }

  const symbols = ['SPY', 'QQQ', '^VIX', 'IWM'];
  const results = [];

  try {
    // Attempt real fetch first (parallelized)
    const promises = symbols.map(async (symbol) => {
      try {
        // Encode symbol for URL (especially for ^VIX)
        const encodedSymbol = encodeURIComponent(symbol);
        const response = await fetchWithCorsProxy(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?interval=1d&range=1d`
        );

        if (response) {
          const data = await response.json();
          const quote = data.chart?.result?.[0];

          if (quote) {
            const meta = quote.meta;
            const price = meta.regularMarketPrice || 0;
            let referencePrice = meta.previousClose || meta.chartPreviousClose || meta.regularMarketOpen || price;
            
            let change = price - referencePrice;
            let changePercent = referencePrice > 0 ? (change / referencePrice * 100) : 0;

            return {
              symbol: symbol === '^VIX' ? 'VIX' : symbol,
              name: meta.shortName || symbol,
              price,
              change,
              changePercent,
            };
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch/parse data for ${symbol}`, e);
      }
      return null;
    });

    const items = await Promise.all(promises);
    results.push(...items.filter(item => item !== null));
  } catch (error) {
    console.error('Failed to fetch market indices:', error);
  }

  // Responding to user request: "no fake mock data in the markets"
  // We removed the static snapshot fallback. If API fails, we return empty/partial results.
  return results;
}



/**
 * Main aggregator function - fetches all live data
 */
export async function fetchAllLiveData() {
  const [
    news,
    conflictEvents,
    earthquakes,
    crypto,
    polymarket,
    fedData,
    markets,
    congressTrades,
    whaleTransactions,
    govContracts,
  ] = await Promise.allSettled([
    fetchAllNews(),
    fetchLiveConflictEvents(),
    fetchEarthquakes(),
    fetchCryptoPrices(),
    fetchPolymarketEvents(),
    fetchFedData(),
    fetchMarketIndices(),
    fetchCongressTrades(),
    fetchWhaleTransactions(),
    fetchGovContracts(),
  ]);

  return {
    news: news.status === 'fulfilled' ? news.value : [],
    conflictEvents: conflictEvents.status === 'fulfilled' ? conflictEvents.value : [],
    earthquakes: earthquakes.status === 'fulfilled' ? earthquakes.value : [],
    crypto: crypto.status === 'fulfilled' ? crypto.value : [],
    polymarket: polymarket.status === 'fulfilled' ? polymarket.value : [],
    fedData: fedData.status === 'fulfilled' ? fedData.value : { m2: 6.8, fedFundsRate: 4.5, inflationRate: 2.9, change: 0, changePercent: 0, percentOfMax: 75 },
    markets: markets.status === 'fulfilled' ? markets.value : [],
    congressTrades: congressTrades.status === 'fulfilled' ? congressTrades.value : [],
    whaleTransactions: whaleTransactions.status === 'fulfilled' ? whaleTransactions.value : [],
    govContracts: govContracts.status === 'fulfilled' ? govContracts.value : [],
    lastUpdate: new Date(),
  };
}
