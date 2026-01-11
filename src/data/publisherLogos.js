/**
 * Publisher Logo URLs and Configurations
 * Small logos displayed on news markers (bottom-right corner, half height)
 * Using local logos stored in public/logos/ folder
 */

const BASE = import.meta.env.BASE_URL;

export const PUBLISHER_LOGOS = {
  // Major News Agencies
  'reuters': {
    url: `${BASE}logos/reuters.png`,
    name: 'Reuters'
  },
  'ap': {
    url: `${BASE}logos/ap.png`,
    name: 'Associated Press'
  },
  'apnews': {
    url: `${BASE}logos/ap.png`,
    name: 'AP News'
  },
  'bbc': {
    url: `${BASE}logos/bbc.png`,
    name: 'BBC'
  },
  'aljazeera': {
    url: `${BASE}logos/aljazeera.png`,
    name: 'Al Jazeera'
  },
  'guardian': {
    url: `${BASE}logos/guardian.png`,
    name: 'The Guardian'
  },

  // Defense/Security
  'kyivIndependent': {
    url: `${BASE}logos/kyivindependent.png`,
    name: 'Kyiv Independent'
  },
  'kyivindependent': {
    url: `${BASE}logos/kyivindependent.png`,
    name: 'Kyiv Independent'
  },
  'defenseOne': {
    url: `${BASE}logos/defenseone.png`,
    name: 'Defense One'
  },
  'defenseone': {
    url: `${BASE}logos/defenseone.png`,
    name: 'Defense One'
  },
  'warOnTheRocks': {
    url: `${BASE}logos/warontherocks.png`,
    name: 'War on the Rocks'
  },
  'warontherocks': {
    url: `${BASE}logos/warontherocks.png`,
    name: 'War on the Rocks'
  },

  // Financial
  'marketWatch': {
    url: `${BASE}logos/marketwatch.png`,
    name: 'MarketWatch'
  },
  'marketwatch': {
    url: `${BASE}logos/marketwatch.png`,
    name: 'MarketWatch'
  },
  'cnbc': {
    url: `${BASE}logos/cnbc.png`,
    name: 'CNBC'
  },
  'bloomberg': {
    url: `${BASE}logos/bloomberg.png`,
    name: 'Bloomberg'
  },

  // Tech
  'techCrunch': {
    url: `${BASE}logos/techcrunch.png`,
    name: 'TechCrunch'
  },
  'techcrunch': {
    url: `${BASE}logos/techcrunch.png`,
    name: 'TechCrunch'
  },
  'wired': {
    url: `${BASE}logos/wired.png`,
    name: 'Wired'
  },
  'arstechnica': {
    url: `${BASE}logos/arstechnica.png`,
    name: 'Ars Technica'
  },

  // Geopolitics
  'foreignPolicy': {
    url: `${BASE}logos/foreignpolicy.png`,
    name: 'Foreign Policy'
  },
  'foreignpolicy': {
    url: `${BASE}logos/foreignpolicy.png`,
    name: 'Foreign Policy'
  },
  'cfr': {
    url: `${BASE}logos/cfr.png`,
    name: 'Council on Foreign Relations'
  },

  // Iran/Middle East Sources
  'iranintl': {
    url: `${BASE}logos/iranintl.svg`,
    name: 'Iran International'
  },
  'iranwire': {
    url: `${BASE}logos/iranwire.svg`,
    name: 'Iran Wire'
  },
  'iran wire': {
    url: `${BASE}logos/iranwire.svg`,
    name: 'Iran Wire'
  },
  'timesofisrael': {
    url: `${BASE}logos/timesofisrael.svg`,
    name: 'Times of Israel'
  },
  'jpost': {
    url: `${BASE}logos/jpost.svg`,
    name: 'Jerusalem Post'
  },
  'haaretz': {
    url: `${BASE}logos/haaretz.svg`,
    name: 'Haaretz'
  },
  'middleeasteye': {
    url: `${BASE}logos/middleeasteye.svg`,
    name: 'Middle East Eye'
  },
  'almonitoriran': {
    url: `${BASE}logos/almonitor.svg`,
    name: 'Al-Monitor'
  },
  'almonitor': {
    url: `${BASE}logos/almonitor.svg`,
    name: 'Al-Monitor'
  },
  'rudawenglish': {
    url: `${BASE}logos/rudaw.svg`,
    name: 'Rudaw'
  },
  'rudaw': {
    url: `${BASE}logos/rudaw.svg`,
    name: 'Rudaw'
  },

  // Default fallback for unknown sources
  'default': {
    url: null,
    name: 'News'
  }
};

/**
 * Get logo URL for a news source
 * @param {string} source - Source identifier (e.g., 'reuters', 'bbc')
 * @returns {Object} - Logo configuration { url, name }
 */
export function getPublisherLogo(source) {
  // Normalize source name (remove special chars, lowercase)
  const normalized = source?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';

  // Direct match
  if (PUBLISHER_LOGOS[normalized]) {
    return PUBLISHER_LOGOS[normalized];
  }

  // Try partial match
  for (const [key, value] of Object.entries(PUBLISHER_LOGOS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Default fallback
  return PUBLISHER_LOGOS.default;
}
