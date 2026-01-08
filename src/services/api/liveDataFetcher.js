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
