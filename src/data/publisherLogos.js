/**
 * Publisher Logo URLs and Configurations
 * Small logos displayed on news markers (bottom-right corner, half height)
 */

export const PUBLISHER_LOGOS = {
  // Major News Agencies
  'reuters': {
    url: 'https://logo.clearbit.com/reuters.com',
    fallback: 'https://www.google.com/s2/favicons?domain=reuters.com&sz=32',
    name: 'Reuters'
  },
  'ap': {
    url: 'https://logo.clearbit.com/apnews.com',
    fallback: 'https://www.google.com/s2/favicons?domain=apnews.com&sz=32',
    name: 'Associated Press'
  },
  'bbc': {
    url: 'https://logo.clearbit.com/bbc.com',
    fallback: 'https://www.google.com/s2/favicons?domain=bbc.com&sz=32',
    name: 'BBC'
  },
  'aljazeera': {
    url: 'https://logo.clearbit.com/aljazeera.com',
    fallback: 'https://www.google.com/s2/favicons?domain=aljazeera.com&sz=32',
    name: 'Al Jazeera'
  },
  'guardian': {
    url: 'https://logo.clearbit.com/theguardian.com',
    fallback: 'https://www.google.com/s2/favicons?domain=theguardian.com&sz=32',
    name: 'The Guardian'
  },

  // Defense/Security
  'kyivIndependent': {
    url: 'https://www.google.com/s2/favicons?domain=kyivindependent.com&sz=32',
    fallback: 'https://www.google.com/s2/favicons?domain=kyivindependent.com&sz=32',
    name: 'Kyiv Independent'
  },
  'defenseOne': {
    url: 'https://logo.clearbit.com/defenseone.com',
    fallback: 'https://www.google.com/s2/favicons?domain=defenseone.com&sz=32',
    name: 'Defense One'
  },
  'warOnTheRocks': {
    url: 'https://www.google.com/s2/favicons?domain=warontherocks.com&sz=32',
    fallback: 'https://www.google.com/s2/favicons?domain=warontherocks.com&sz=32',
    name: 'War on the Rocks'
  },

  // Financial
  'marketWatch': {
    url: 'https://logo.clearbit.com/marketwatch.com',
    fallback: 'https://www.google.com/s2/favicons?domain=marketwatch.com&sz=32',
    name: 'MarketWatch'
  },
  'cnbc': {
    url: 'https://logo.clearbit.com/cnbc.com',
    fallback: 'https://www.google.com/s2/favicons?domain=cnbc.com&sz=32',
    name: 'CNBC'
  },
  'bloomberg': {
    url: 'https://logo.clearbit.com/bloomberg.com',
    fallback: 'https://www.google.com/s2/favicons?domain=bloomberg.com&sz=32',
    name: 'Bloomberg'
  },

  // Tech
  'techCrunch': {
    url: 'https://logo.clearbit.com/techcrunch.com',
    fallback: 'https://www.google.com/s2/favicons?domain=techcrunch.com&sz=32',
    name: 'TechCrunch'
  },
  'wired': {
    url: 'https://logo.clearbit.com/wired.com',
    fallback: 'https://www.google.com/s2/favicons?domain=wired.com&sz=32',
    name: 'Wired'
  },
  'arstechnica': {
    url: 'https://logo.clearbit.com/arstechnica.com',
    fallback: 'https://www.google.com/s2/favicons?domain=arstechnica.com&sz=32',
    name: 'Ars Technica'
  },

  // Geopolitics
  'foreignPolicy': {
    url: 'https://logo.clearbit.com/foreignpolicy.com',
    fallback: 'https://www.google.com/s2/favicons?domain=foreignpolicy.com&sz=32',
    name: 'Foreign Policy'
  },
  'cfr': {
    url: 'https://logo.clearbit.com/cfr.org',
    fallback: 'https://www.google.com/s2/favicons?domain=cfr.org&sz=32',
    name: 'Council on Foreign Relations'
  },

  // Default fallback for unknown sources
  'default': {
    url: 'https://www.google.com/s2/favicons?domain=news.com&sz=32',
    fallback: null,
    name: 'News'
  }
};

/**
 * Get logo URL for a news source
 * @param {string} source - Source identifier (e.g., 'reuters', 'bbc')
 * @returns {Object} - Logo configuration { url, fallback, name }
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

/**
 * Create custom Leaflet icon with publisher logo overlay
 * @param {string} color - Base marker color
 * @param {string} logoUrl - Publisher logo URL
 * @returns {L.DivIcon} - Leaflet div icon
 */
export function createMarkerWithLogo(color, logoUrl) {
  return L.divIcon({
    className: 'news-marker-with-logo',
    html: `
      <div style="position: relative; width: 12px; height: 12px;">
        <div style="
          width: 12px;
          height: 12px;
          background: ${color};
          border: 2px solid rgba(255,255,255,0.9);
          border-radius: 50%;
          box-shadow: 0 0 8px ${color}aa;
        "></div>
        ${logoUrl ? `
          <img
            src="${logoUrl}"
            style="
              position: absolute;
              bottom: -2px;
              right: -2px;
              width: 8px;
              height: 8px;
              border-radius: 2px;
              border: 1px solid rgba(0,0,0,0.3);
              background: white;
              object-fit: contain;
            "
            onerror="this.style.display='none'"
          />
        ` : ''}
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
}
