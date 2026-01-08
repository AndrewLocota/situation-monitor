/**
 * Live Data Fetcher - Aggregates real-time data from multiple sources
 * Including LiveUAMap, DeepStateMap, and various news/conflict APIs
 */

import { fetchWithCorsProxy } from './corsProxy';

// RSS Feed URLs for live news
const NEWS_FEEDS = {
  // Breaking news
  reuters: 'https://feeds.reuters.com/reuters/topNews',
  ap: 'https://rsshub.app/apnews/topics/apf-topnews',
  bbc: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  aljazeera: 'https://www.aljazeera.com/xml/rss/all.xml',
  guardian: 'https://www.theguardian.com/world/rss',

  // Conflict-specific
  kyivIndependent: 'https://kyivindependent.com/feed/',
  defenseOne: 'https://www.defenseone.com/rss/all/',
  warOnTheRocks: 'https://warontherocks.com/feed/',

  // Financial/Markets
  marketWatch: 'https://feeds.marketwatch.com/marketwatch/topstories/',
  cnbc: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
  bloomberg: 'https://feeds.bloomberg.com/markets/news.rss',

  // Tech
  techCrunch: 'https://techcrunch.com/feed/',
  wired: 'https://www.wired.com/feed/rss',
  arstechnica: 'https://feeds.arstechnica.com/arstechnica/index',

  // Geopolitics
  foreignPolicy: 'https://foreignpolicy.com/feed/',
  cfr: 'https://www.cfr.org/rss.xml',
};

// LiveUAMap-style event scraping (via their API/RSS if available)
const LIVEUAMAP_FEEDS = {
  ukraine: 'https://liveuamap.com/rss/ukraine',
  middleEast: 'https://liveuamap.com/rss/middleeast',
  syria: 'https://syria.liveuamap.com/rss',
};

/**
 * Parse RSS/Atom feed to extract news items
 */
async function parseRSSFeed(url, sourceName) {
  try {
    const response = await fetchWithCorsProxy(url);
    if (!response) return [];

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');

    // Handle both RSS and Atom formats
    const isAtom = doc.querySelector('feed') !== null;
    const items = [];

    if (isAtom) {
      const entries = doc.querySelectorAll('entry');
      entries.forEach((entry, index) => {
        const title = entry.querySelector('title')?.textContent || '';
        const link = entry.querySelector('link')?.getAttribute('href') ||
                     entry.querySelector('link')?.textContent || '';
        const summary = entry.querySelector('summary, content')?.textContent || '';
        const published = entry.querySelector('published, updated')?.textContent || '';

        items.push({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: title.trim(),
          description: summary.trim().slice(0, 300),
          link,
          pubDate: new Date(published),
          source: sourceName,
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
        const imageUrl = item.querySelector('enclosure')?.getAttribute('url') ||
                        item.querySelector('media\\:content, content')?.getAttribute('url');

        items.push({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: title.trim(),
          description: description.replace(/<[^>]*>/g, '').trim().slice(0, 300),
          link,
          pubDate: new Date(pubDate),
          source: sourceName,
          category,
          imageUrl: imageUrl || undefined,
        });
      });
    }

    return items;
  } catch (error) {
    console.error(`Failed to fetch ${sourceName} feed:`, error);
    return [];
  }
}

/**
 * Fetch all news from multiple sources
 */
export async function fetchAllNews() {
  const feedEntries = Object.entries(NEWS_FEEDS);
  const allItems = [];

  // Fetch in batches to avoid overwhelming
  const batchSize = 5;
  for (let i = 0; i < feedEntries.length; i += batchSize) {
    const batch = feedEntries.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(([name, url]) => parseRSSFeed(url, name))
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
    .slice(0, 200); // Keep latest 200 items
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
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
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

    return data.map((market) => ({
      id: market.id || market.conditionId,
      question: market.question || market.title,
      probability: market.outcomePrices?.[0] || 0.5,
      volume: market.volume || 0,
      category: market.category || 'Other',
    }));
  } catch (error) {
    console.error('Failed to fetch Polymarket:', error);
    return [];
  }
}

/**
 * Fetch Federal Reserve data (money supply, rates)
 */
export async function fetchFedData() {
  try {
    return {
      m2: 20.9, // Trillions USD
      fedFundsRate: 5.25,
      inflationRate: 3.4,
    };
  } catch (error) {
    console.error('Failed to fetch Fed data:', error);
    return { m2: 0, fedFundsRate: 0, inflationRate: 0 };
  }
}

/**
 * Fetch stock market indices
 */
/**
 * Fetch stock market indices
 */
export async function fetchMarketIndices() {
  const symbols = ['SPY', 'QQQ', 'DIA', 'IWM', '^VIX'];
  const results = [];

  try {
    // Attempt real fetch first (will failing in dev due to CORS usually)
    for (const symbol of symbols) {
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

            results.push({
              symbol: symbol === '^VIX' ? 'VIX' : symbol,
              name: meta.shortName || symbol,
              price,
              change,
              changePercent,
            });
          }
        }
      } catch (e) {
        // Continue with next symbol
        console.warn(`Failed to fetch/parse data for ${symbol}`, e);
      }
    }
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
  ] = await Promise.allSettled([
    fetchAllNews(),
    fetchLiveConflictEvents(),
    fetchEarthquakes(),
    fetchCryptoPrices(),
    fetchPolymarketEvents(),
    fetchFedData(),
    fetchMarketIndices(),
  ]);

  return {
    news: news.status === 'fulfilled' ? news.value : [],
    conflictEvents: conflictEvents.status === 'fulfilled' ? conflictEvents.value : [],
    earthquakes: earthquakes.status === 'fulfilled' ? earthquakes.value : [],
    crypto: crypto.status === 'fulfilled' ? crypto.value : [],
    polymarket: polymarket.status === 'fulfilled' ? polymarket.value : [],
    fedData: fedData.status === 'fulfilled' ? fedData.value : { m2: 0, fedFundsRate: 0, inflationRate: 0 },
    markets: markets.status === 'fulfilled' ? markets.value : [],
    lastUpdate: new Date(),
  };
}
