/**
 * Instagram Scraper for @iranintlenglish
 *
 * Automatically fetches Instagram posts, extracts locations from descriptions,
 * and creates video markers on the map.
 *
 * IMPORTANT: This uses Instagram's public/embed endpoints which don't require API keys.
 * However, Instagram may rate-limit or block requests. For production, consider:
 * - Adding a backend proxy server
 * - Caching results to minimize requests
 * - Using a third-party Instagram API service
 */

import { fetchWithCorsProxy } from './corsProxy';

const INSTAGRAM_USERNAME = 'iranintlenglish';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// City/location coordinates database for Iran
const IRAN_LOCATIONS = {
  // Major cities
  'tehran': { lat: 35.6892, lng: 51.3890, alt: ['تهران'] },
  'mashhad': { lat: 36.2974, lng: 59.6067, alt: ['مشهد'] },
  'isfahan': { lat: 32.6546, lng: 51.6680, alt: ['اصفهان', 'esfahan'] },
  'shiraz': { lat: 29.5918, lng: 52.5836, alt: ['شیراز'] },
  'tabriz': { lat: 38.0800, lng: 46.2919, alt: ['تبریز'] },
  'karaj': { lat: 35.8355, lng: 50.9866, alt: ['کرج'] },
  'qom': { lat: 34.6416, lng: 50.8764, alt: ['قم'] },
  'ahvaz': { lat: 31.3183, lng: 48.6706, alt: ['اهواز', 'ahwaz'] },
  'kermanshah': { lat: 34.3142, lng: 47.0650, alt: ['کرمانشاه'] },
  'urmia': { lat: 37.5527, lng: 45.0761, alt: ['ارومیه', 'orumiyeh'] },
  'rasht': { lat: 37.2808, lng: 49.5832, alt: ['رشت'] },
  'zahedan': { lat: 29.4963, lng: 60.8629, alt: ['زاهدان'] },
  'hamadan': { lat: 34.7992, lng: 48.5146, alt: ['همدان'] },
  'yazd': { lat: 31.8974, lng: 54.3569, alt: ['یزد'] },
  'ardabil': { lat: 38.2498, lng: 48.2933, alt: ['اردبیل'] },
  'bandar abbas': { lat: 27.1865, lng: 56.2808, alt: ['بندرعباس'] },
  'arak': { lat: 34.0917, lng: 49.6892, alt: ['اراک'] },
  'qazvin': { lat: 36.2688, lng: 50.0041, alt: ['قزوین'] },
  'zanjan': { lat: 36.6736, lng: 48.4787, alt: ['زنجان'] },
  'sanandaj': { lat: 35.3150, lng: 46.9988, alt: ['سنندج'] },

  // Notable locations for protests
  'azadi square': { lat: 35.6997, lng: 51.3381, alt: ['میدان آزادی', 'azadi'] },
  'tehran university': { lat: 35.7011, lng: 51.4010, alt: ['دانشگاه تهران'] },
  'sharif university': { lat: 35.7047, lng: 51.3510, alt: ['دانشگاه صنعتی شریف'] },
  'amir kabir university': { lat: 35.7031, lng: 51.3900, alt: ['امیرکبیر', 'amirkabir'] },
  'evin prison': { lat: 35.7953, lng: 51.3833, alt: ['زندان اوین', 'evin'] },
  'revolution square': { lat: 35.6892, lng: 51.3890, alt: ['میدان انقلاب'] },
};

/**
 * Extract location from Instagram post caption/description
 * Uses keyword matching against Iranian cities and locations
 */
function extractLocation(caption) {
  if (!caption) return null;

  const lowerCaption = caption.toLowerCase();

  // Search for location matches
  for (const [city, coords] of Object.entries(IRAN_LOCATIONS)) {
    // Check main city name
    if (lowerCaption.includes(city.toLowerCase())) {
      return { city, ...coords };
    }

    // Check alternative names
    if (coords.alt) {
      for (const altName of coords.alt) {
        if (lowerCaption.includes(altName.toLowerCase())) {
          return { city, ...coords };
        }
      }
    }
  }

  // If no specific location found, default to Tehran (capital)
  return { city: 'Tehran (default)', ...IRAN_LOCATIONS.tehran };
}

/**
 * Fetch Instagram profile data using public endpoints
 * This uses Instagram's public/embed API which doesn't require authentication
 */
async function fetchInstagramPosts(username) {
  try {
    // Try Instagram's public API endpoint (no auth required, but may be rate-limited)
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

    const response = await fetchWithCorsProxy(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-IG-App-ID': '936619743392459', // Public Instagram web app ID
      }
    });

    if (!response || !response.ok) {
      console.warn('Instagram API request failed, using cached data');
      return null;
    }

    const data = await response.json();

    if (!data.data || !data.data.user || !data.data.user.edge_owner_to_timeline_media) {
      return null;
    }

    const posts = data.data.user.edge_owner_to_timeline_media.edges;
    return posts;

  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return null;
  }
}

/**
 * Parse Instagram posts and create video markers
 */
function parseInstagramPosts(posts) {
  if (!posts || posts.length === 0) return [];

  const videoMarkers = [];

  for (const post of posts.slice(0, 20)) { // Limit to most recent 20 posts
    const node = post.node;

    // Only process video posts
    if (!node.is_video) continue;

    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
    const location = extractLocation(caption);

    if (!location) continue;

    const shortcode = node.shortcode;
    const videoUrl = `https://www.instagram.com/p/${shortcode}/`;
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed`;
    const thumbnailUrl = node.thumbnail_src || node.display_url;

    videoMarkers.push({
      id: `instagram_${shortcode}`,
      lat: location.lat,
      lng: location.lng,
      title: `${location.city.toUpperCase()} // INSTAGRAM INTEL`,
      description: caption.substring(0, 150) + (caption.length > 150 ? '...' : ''),
      instagramUrl: videoUrl,
      embedUrl: embedUrl,
      thumbnail: thumbnailUrl,
      date: new Date(node.taken_at_timestamp * 1000).toISOString().split('T')[0],
      likes: node.edge_liked_by?.count || 0,
      views: node.video_view_count || 0,
      tags: extractHashtags(caption),
      theatre: 'middle_east',
      active: true,
      source: 'instagram',
      account: INSTAGRAM_USERNAME
    });
  }

  return videoMarkers;
}

/**
 * Extract hashtags from caption
 */
function extractHashtags(caption) {
  if (!caption) return [];
  const hashtags = caption.match(/#[\w\u0600-\u06FF]+/g) || [];
  return hashtags.map(tag => tag.substring(1).toLowerCase()).slice(0, 5);
}

/**
 * Main function to fetch and process Instagram videos
 * Returns cached data if available and fresh
 */
export async function getInstagramVideos(forceRefresh = false) {
  const cacheKey = 'instagram_videos_cache';
  const cacheTimeKey = 'instagram_videos_cache_time';

  // Check cache first
  if (!forceRefresh) {
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);

    if (cachedData && cacheTime) {
      const age = Date.now() - parseInt(cacheTime, 10);
      if (age < CACHE_DURATION) {
        console.log('Using cached Instagram data, age:', Math.floor(age / 60000), 'minutes');
        return JSON.parse(cachedData);
      }
    }
  }

  console.log('Fetching fresh Instagram data...');

  // Fetch new data
  const posts = await fetchInstagramPosts(INSTAGRAM_USERNAME);

  if (!posts) {
    // If fetch failed, return cached data even if stale
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.warn('Instagram fetch failed, using stale cache');
      return JSON.parse(cachedData);
    }
    return [];
  }

  const videoMarkers = parseInstagramPosts(posts);

  // Cache the results
  localStorage.setItem(cacheKey, JSON.stringify(videoMarkers));
  localStorage.setItem(cacheTimeKey, Date.now().toString());

  console.log(`Fetched ${videoMarkers.length} Instagram videos from @${INSTAGRAM_USERNAME}`);

  return videoMarkers;
}

/**
 * Get only active Instagram videos (all are active by default)
 */
export function getActiveInstagramVideos(videos) {
  return videos.filter(v => v.active);
}
