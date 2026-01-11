/**
 * News Aggregation API Endpoint
 * Fetches and caches RSS feeds server-side
 * Returns pre-processed JSON to eliminate CORS issues
 *
 * Endpoint: /api/news?limit=200
 */

import { NEWS_FEEDS } from './utils/feedConfig.js';
import { parseRSSFeed } from './utils/rssParser.js';

// In-memory cache
let newsCache = {
  data: [],
  timestamp: 0,
  isRefreshing: false,
};

const CACHE_TTL = 30 * 1000; // 30 seconds for faster updates

/**
 * Main handler for /api/news endpoint
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 200 } = req.query;
    const limitNum = parseInt(limit, 10);

    // Check cache validity
    const now = Date.now();
    const cacheAge = now - newsCache.timestamp;
    const isCacheValid = cacheAge < CACHE_TTL && newsCache.data.length > 0;

    if (isCacheValid) {
      // Return cached data
      console.log(`[News API] Cache hit (age: ${Math.round(cacheAge / 1000)}s)`);
      return res.status(200).json({
        success: true,
        cached: true,
        cacheAge: Math.round(cacheAge / 1000),
        count: Math.min(limitNum, newsCache.data.length),
        news: newsCache.data.slice(0, limitNum),
      });
    }

    // If another request is already refreshing, wait a bit and return stale cache
    if (newsCache.isRefreshing) {
      console.log('[News API] Refresh in progress, returning stale cache');
      return res.status(200).json({
        success: true,
        cached: true,
        stale: true,
        cacheAge: Math.round(cacheAge / 1000),
        count: Math.min(limitNum, newsCache.data.length),
        news: newsCache.data.slice(0, limitNum),
      });
    }

    // Refresh cache
    console.log('[News API] Cache miss, fetching fresh data...');
    newsCache.isRefreshing = true;

    const startTime = Date.now();
    const allNews = await fetchAllFeeds();
    const fetchTime = Date.now() - startTime;

    // Update cache
    newsCache = {
      data: allNews,
      timestamp: Date.now(),
      isRefreshing: false,
    };

    console.log(`[News API] Fetched ${allNews.length} items in ${fetchTime}ms`);

    return res.status(200).json({
      success: true,
      cached: false,
      fetchTime,
      count: Math.min(limitNum, allNews.length),
      news: allNews.slice(0, limitNum),
    });
  } catch (error) {
    console.error('[News API] Error:', error);
    newsCache.isRefreshing = false;

    // Return stale cache if available
    if (newsCache.data.length > 0) {
      console.log('[News API] Error occurred, returning stale cache');
      return res.status(200).json({
        success: true,
        cached: true,
        stale: true,
        error: error.message,
        count: newsCache.data.length,
        news: newsCache.data.slice(0, parseInt(req.query.limit || 200, 10)),
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Fetch all RSS feeds in parallel
 */
async function fetchAllFeeds() {
  const feedEntries = Object.entries(NEWS_FEEDS);
  const batchSize = 5; // Process 5 feeds at a time to avoid overwhelming servers
  const allItems = [];

  for (let i = 0; i < feedEntries.length; i += batchSize) {
    const batch = feedEntries.slice(i, i + batchSize);

    const results = await Promise.allSettled(
      batch.map(([name, feedInfo]) => {
        const { url, bias, biasLabel, reliability } = feedInfo;
        return parseRSSFeed(url, name, { bias, biasLabel, reliability });
      })
    );

    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        const items = result.value;
        allItems.push(...items);
        console.log(`  ✓ ${batch[idx][0]}: ${items.length} items`);
      } else {
        console.error(`  ✗ ${batch[idx][0]}: ${result.reason?.message || 'Failed'}`);
      }
    });
  }

  // Sort by date (newest first) and deduplicate
  const sorted = allItems
    .filter(item => item.title && item.pubDate)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .filter((item, index, arr) =>
      index === arr.findIndex(i => i.title === item.title)
    );

  return sorted;
}
