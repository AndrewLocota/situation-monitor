/**
 * RSS/Atom Feed Parser for Backend
 * Server-side feed parsing with no CORS restrictions
 */

import { JSDOM } from 'jsdom';

/**
 * Parse RSS/Atom feed from URL
 */
export async function parseRSSFeed(url, sourceName, biasInfo = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SituationMonitor/1.0 (RSS Aggregator)',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const dom = new JSDOM(text, { contentType: 'text/xml' });
    const doc = dom.window.document;

    const items = [];

    // Try RSS format first
    const rssItems = doc.querySelectorAll('item');
    if (rssItems.length > 0) {
      rssItems.forEach((item, index) => {
        if (index >= 20) return; // Limit to 20 items per feed

        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDateStr = item.querySelector('pubDate')?.textContent || '';

        // Extract description
        let description = item.querySelector('description')?.textContent || '';
        description = cleanHTML(description);

        // Extract image
        let imageUrl = extractImageFromItem(item, description);

        // Extract video
        const { videoUrl, videoType } = extractVideoFromItem(item, description);

        // Parse date
        const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();

        // Geolocate from title/description
        const location = geolocateContent(title + ' ' + description);

        items.push({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: title.trim(),
          description: description.slice(0, 500),
          fullDescription: description,
          link: link.trim(),
          source: sourceName,
          pubDate: pubDate.toISOString(),
          imageUrl,
          videoUrl,
          videoType,
          location,
          bias: biasInfo.bias || 0,
          biasLabel: biasInfo.biasLabel || 'Center',
          reliability: biasInfo.reliability || 'Mixed',
        });
      });
    } else {
      // Try Atom format
      const atomEntries = doc.querySelectorAll('entry');
      atomEntries.forEach((entry, index) => {
        if (index >= 20) return;

        const title = entry.querySelector('title')?.textContent || '';
        const link = entry.querySelector('link')?.getAttribute('href') || '';
        const pubDateStr = entry.querySelector('published, updated')?.textContent || '';

        let summary = entry.querySelector('summary, content')?.textContent || '';
        summary = cleanHTML(summary);

        let imageUrl = extractImageFromItem(entry, summary);
        const { videoUrl, videoType } = extractVideoFromItem(entry, summary);

        const pubDate = pubDateStr ? new Date(pubDateStr) : new Date();
        const location = geolocateContent(title + ' ' + summary);

        items.push({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: title.trim(),
          description: summary.slice(0, 500),
          fullDescription: summary,
          link: link.trim(),
          source: sourceName,
          pubDate: pubDate.toISOString(),
          imageUrl,
          videoUrl,
          videoType,
          location,
          bias: biasInfo.bias || 0,
          biasLabel: biasInfo.biasLabel || 'Center',
          reliability: biasInfo.reliability || 'Mixed',
        });
      });
    }

    return items;
  } catch (error) {
    console.error(`[RSS Parser] Failed to fetch ${sourceName}:`, error.message);
    return [];
  }
}

/**
 * Clean HTML tags and entities from text
 */
function cleanHTML(html) {
  if (!html) return '';

  return html
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\[CDATA\[|\]\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract image URL from RSS item
 */
function extractImageFromItem(item, description) {
  // Try media:content
  let img = item.querySelector('media\\:content, content')?.getAttribute('url');
  if (img) return img;

  // Try enclosure
  const enclosure = item.querySelector('enclosure');
  if (enclosure && enclosure.getAttribute('type')?.startsWith('image')) {
    return enclosure.getAttribute('url');
  }

  // Try media:thumbnail
  img = item.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url');
  if (img) return img;

  // Try og:image in description
  const ogMatch = description.match(/og:image["']?\s*content=["']([^"']+)/i);
  if (ogMatch) return ogMatch[1];

  // Try img src in description
  const imgMatch = description.match(/<img[^>]+src=["']([^"']+)/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

/**
 * Extract video URL from RSS item
 */
function extractVideoFromItem(item, description) {
  // YouTube embed
  const ytMatch = description.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return { videoUrl: `https://www.youtube.com/embed/${ytMatch[1]}`, videoType: 'youtube' };
  }

  // YouTube watch
  const ytWatchMatch = description.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (ytWatchMatch) {
    return { videoUrl: `https://www.youtube.com/embed/${ytWatchMatch[1]}`, videoType: 'youtube' };
  }

  // Check for video enclosure
  const enclosure = item.querySelector('enclosure');
  if (enclosure && enclosure.getAttribute('type')?.startsWith('video')) {
    return { videoUrl: enclosure.getAttribute('url'), videoType: 'direct' };
  }

  return { videoUrl: null, videoType: null };
}

/**
 * Simple geolocation from content
 * Returns { lat, lng } or null
 */
function geolocateContent(text) {
  const lowerText = text.toLowerCase();

  // Major cities database (simplified)
  const locations = {
    'kyiv': { lat: 50.4501, lng: 30.5234 },
    'kiev': { lat: 50.4501, lng: 30.5234 },
    'moscow': { lat: 55.7558, lng: 37.6173 },
    'tehran': { lat: 35.6892, lng: 51.3890 },
    'gaza': { lat: 31.5, lng: 34.46 },
    'tel aviv': { lat: 32.0853, lng: 34.7818 },
    'jerusalem': { lat: 31.7683, lng: 35.2137 },
    'damascus': { lat: 33.5138, lng: 36.2765 },
    'beijing': { lat: 39.9042, lng: 116.4074 },
    'taipei': { lat: 25.033, lng: 121.5654 },
    'washington': { lat: 38.9072, lng: -77.0369 },
    'baghdad': { lat: 33.3152, lng: 44.3661 },
    'beirut': { lat: 33.8938, lng: 35.5018 },
    'ankara': { lat: 39.9334, lng: 32.8597 },
    'istanbul': { lat: 41.0082, lng: 28.9784 },
    'cairo': { lat: 30.0444, lng: 31.2357 },
    'riyadh': { lat: 24.7136, lng: 46.6753 },
    'dubai': { lat: 25.2048, lng: 55.2708 },
    'mumbai': { lat: 19.076, lng: 72.8777 },
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'seoul': { lat: 37.5665, lng: 126.978 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'berlin': { lat: 52.52, lng: 13.405 },
    'ukraine': { lat: 49.0, lng: 32.0 },
    'russia': { lat: 60.0, lng: 100.0 },
    'iran': { lat: 32.0, lng: 53.0 },
    'israel': { lat: 31.5, lng: 34.75 },
    'syria': { lat: 35.0, lng: 38.0 },
    'china': { lat: 35.0, lng: 105.0 },
    'taiwan': { lat: 23.5, lng: 121.0 },
  };

  for (const [place, coords] of Object.entries(locations)) {
    if (lowerText.includes(place)) {
      return coords;
    }
  }

  return null;
}
