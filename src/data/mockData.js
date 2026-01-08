// Mock data ported from original index.html
// This file contains static data that would normally come from APIs
// Can be replaced with live API calls when available

// Market symbols - from original fetchMarkets()
export const MARKET_SYMBOLS = [
  { symbol: '^GSPC', name: 'S&P 500', display: 'SPX' },
  { symbol: '^DJI', name: 'Dow Jones', display: 'DJI' },
  { symbol: '^IXIC', name: 'NASDAQ', display: 'NDX' },
  { symbol: 'AAPL', name: 'Apple', display: 'AAPL' },
  { symbol: 'MSFT', name: 'Microsoft', display: 'MSFT' },
  { symbol: 'NVDA', name: 'NVIDIA', display: 'NVDA' },
  { symbol: 'GOOGL', name: 'Alphabet', display: 'GOOGL' },
  { symbol: 'AMZN', name: 'Amazon', display: 'AMZN' },
  { symbol: 'META', name: 'Meta', display: 'META' },
  { symbol: 'BRK-B', name: 'Berkshire', display: 'BRK.B' },
  { symbol: 'TSM', name: 'TSMC', display: 'TSM' },
  { symbol: 'LLY', name: 'Eli Lilly', display: 'LLY' },
  { symbol: 'TSLA', name: 'Tesla', display: 'TSLA' },
  { symbol: 'AVGO', name: 'Broadcom', display: 'AVGO' },
  { symbol: 'JPM', name: 'JPMorgan', display: 'JPM' },
  { symbol: 'V', name: 'Visa', display: 'V' },
  { symbol: 'UNH', name: 'UnitedHealth', display: 'UNH' },
  { symbol: 'XOM', name: 'Exxon', display: 'XOM' },
  { symbol: 'NFLX', name: 'Netflix', display: 'NFLX' }
];

// Sector ETFs for heatmap
export const SECTORS = [
  { symbol: 'XLK', name: 'Tech' },
  { symbol: 'XLF', name: 'Finance' },
  { symbol: 'XLE', name: 'Energy' },
  { symbol: 'XLV', name: 'Health' },
  { symbol: 'XLY', name: 'Consumer' },
  { symbol: 'XLI', name: 'Industrial' },
  { symbol: 'XLP', name: 'Staples' },
  { symbol: 'XLU', name: 'Utilities' },
  { symbol: 'XLB', name: 'Materials' },
  { symbol: 'XLRE', name: 'Real Est' },
  { symbol: 'XLC', name: 'Comms' },
  { symbol: 'SMH', name: 'Semis' }
];

// Commodities and VIX
export const COMMODITIES = [
  { symbol: '^VIX', name: 'VIX', display: 'VIX' },
  { symbol: 'GC=F', name: 'Gold', display: 'GOLD' },
  { symbol: 'CL=F', name: 'Crude Oil', display: 'OIL' },
  { symbol: 'NG=F', name: 'Natural Gas', display: 'NATGAS' },
  { symbol: 'SI=F', name: 'Silver', display: 'SILVER' },
  { symbol: 'HG=F', name: 'Copper', display: 'COPPER' }
];

// RSS Feed sources
export const NEWS_SOURCES = {
  politics: [
    { name: 'Reuters World', url: 'https://www.reutersagency.com/feed/?taxonomy=best-sectors&post_type=best' },
    { name: 'AP News', url: 'https://feeds.apnews.com/rss/apf-topnews' },
    { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml' }
  ],
  tech: [
    { name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/' }
  ],
  finance: [
    { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
    { name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
    { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex' }
  ],
  intel: [
    { name: 'CSIS', url: 'https://www.csis.org/analysis/feed', type: 'think-tank' },
    { name: 'Defense One', url: 'https://www.defenseone.com/rss/all/', type: 'defense' },
    { name: 'War on Rocks', url: 'https://warontherocks.com/feed/', type: 'defense' },
    { name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/', type: 'defense' },
    { name: 'The Diplomat', url: 'https://thediplomat.com/feed/', type: 'regional' },
    { name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/', type: 'osint' },
    { name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml', type: 'cyber' }
  ]
};

// Alert keywords that trigger highlighting
export const ALERT_KEYWORDS = [
  'breaking', 'urgent', 'alert', 'emergency', 'attack', 'explosion',
  'nuclear', 'invasion', 'strike', 'war', 'missile', 'evacuate',
  'shutdown', 'crash', 'breach', 'hack', 'leaked', 'killed'
];

// Mock market data (when API unavailable)
export const MOCK_MARKETS = [
  { symbol: 'SPX', name: 'S&P 500', value: 4785.20, change: +0.52 },
  { symbol: 'DJI', name: 'Dow Jones', value: 37440.50, change: +0.35 },
  { symbol: 'NDX', name: 'NASDAQ', value: 15120.80, change: -0.18 },
  { symbol: 'NVDA', name: 'NVIDIA', value: 485.50, change: +2.15 },
  { symbol: 'AAPL', name: 'Apple', value: 195.30, change: -0.42 },
  { symbol: 'MSFT', name: 'Microsoft', value: 378.20, change: +0.88 },
  { symbol: 'TSLA', name: 'Tesla', value: 248.50, change: -1.24 },
  { symbol: 'BTC', name: 'Bitcoin', value: 95400, change: +1.85 },
  { symbol: 'ETH', name: 'Ethereum', value: 3420, change: +0.92 },
  { symbol: 'GC=F', name: 'Gold', value: 2045.80, change: +0.33 },
  { symbol: 'CL=F', name: 'Crude Oil', value: 75.50, change: +1.42 },
  { symbol: 'VIX', name: 'VIX', value: 14.25, change: -3.80 }
];

// Mock sector data (when API unavailable)
export const MOCK_SECTORS = [
  { name: 'Tech', symbol: 'XLK', change: -0.08 },
  { name: 'Health', symbol: 'XLV', change: +0.99 },
  { name: 'Finance', symbol: 'XLF', change: -1.40 },
  { name: 'Utilities', symbol: 'XLU', change: -2.42 },
  { name: 'Energy', symbol: 'XLE', change: +1.12 },
  { name: 'Consumer', symbol: 'XLY', change: +0.45 },
  { name: 'Materials', symbol: 'XLB', change: -0.23 },
  { name: 'Industrial', symbol: 'XLI', change: +0.12 },
  { name: 'Staples', symbol: 'XLP', change: +0.32 },
  { name: 'Real Est', symbol: 'XLRE', change: -0.88 },
  { name: 'Comms', symbol: 'XLC', change: +0.55 },
  { name: 'Semis', symbol: 'SMH', change: +1.78 }
];

// Mock intelligence feed (when RSS unavailable)
export const MOCK_INTEL_FEED = [
  { time: '14:32', source: 'DEFENSE ONE', title: 'Pentagon announces new Pacific deterrence initiative' },
  { time: '14:15', source: 'REUTERS', title: 'NATO allies agree to boost defense spending amid tensions' },
  { time: '13:58', source: 'BELLINGCAT', title: 'OSINT analysis reveals troop movements near contested border' },
  { time: '13:42', source: 'CSIS', title: 'Think tank warns of emerging cybersecurity vulnerabilities' },
  { time: '13:25', source: 'AP', title: 'Diplomatic talks stall as Eastern European tensions rise' },
  { time: '13:10', source: 'WAR ON ROCKS', title: 'Analysis: The changing nature of modern deterrence' },
  { time: '12:55', source: 'CISA', title: 'New cyber threat advisory issued for critical infrastructure' },
  { time: '12:40', source: 'THE DIPLOMAT', title: 'Taiwan Strait activity heightens regional concerns' },
  { time: '12:25', source: 'BREAKING DEF', title: 'New hypersonic missile test confirmed by intelligence sources' },
  { time: '12:10', source: 'JANES', title: 'Naval assets repositioning in South China Sea' }
];

// Mock Polymarket predictions
export const MOCK_POLYMARKET = [
  { question: 'China invades Taiwan before 2027?', yes: 0.12, no: 0.88, volume: '$65M' },
  { question: 'Ukraine-Russia Ceasefire in 2026?', yes: 0.28, no: 0.72, volume: '$42M' },
  { question: 'Bitcoin above $200k in 2026?', yes: 0.45, no: 0.55, volume: '$125M' },
  { question: 'Fed cuts rates below 3% by Dec 2026?', yes: 0.35, no: 0.65, volume: '$85M' },
  { question: 'GPT-6 released by Q3 2026?', yes: 0.62, no: 0.38, volume: '$55M' },
  { question: 'US-Iran Military Conflict in 2026?', yes: 0.18, no: 0.82, volume: '$35M' },
  { question: 'SpaceX lands Humans on Mars in 2026?', yes: 0.01, no: 0.99, volume: '$15M' }
];

// US Hotspots
export const US_HOTSPOTS = [
  {
    id: 'la-wildfires',
    name: 'California Wildfires',
    location: 'Los Angeles, CA',
    lat: 34.0522, lon: -118.2437,
    level: 'high',
    category: 'Natural Disaster',
    description: 'Ongoing wildfire emergency in Los Angeles area. Multiple fires, evacuations.',
    keywords: ['california', 'wildfire', 'los angeles', 'fire', 'evacuation'],
    status: 'Active Emergency'
  },
  {
    id: 'border-crisis',
    name: 'Border Enforcement',
    location: 'El Paso, TX',
    lat: 31.7619, lon: -106.4850,
    level: 'elevated',
    category: 'Immigration',
    description: 'Ongoing migration and border enforcement actions.',
    keywords: ['border', 'immigration', 'el paso', 'texas'],
    status: 'Ongoing'
  },
  {
    id: 'ai-regulation',
    name: 'AI & Tech Policy',
    location: 'San Francisco, CA',
    lat: 37.7749, lon: -122.4194,
    level: 'medium',
    category: 'Technology',
    description: 'Major tech companies facing regulatory scrutiny. AI safety debates.',
    keywords: ['openai', 'anthropic', 'ai regulation', 'tech'],
    status: 'Developing'
  }
];
