/**
 * RSS Feed Configuration
 * Centralized feed definitions for backend aggregation
 */

export const NEWS_FEEDS = {
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
