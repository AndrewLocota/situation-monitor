// Global conflict data feeds
// Sources: ACLED, GDELT, HDX, UCDP
// Note: Some APIs require registration for full access

// ============== GDELT - Free, No Auth Required ==============
// GDELT GEO 2.0 API - Updates every 15 minutes
// Returns news events with geolocation

const GDELT_BASE = 'https://api.gdeltproject.org/api/v2/geo/geo';

/**
 * Fetch conflict-related news events from GDELT
 * @param {string} query - Search query (e.g., "conflict", "attack", "war")
 * @param {number} maxPoints - Maximum number of points to return
 */
export async function fetchGDELTEvents(query = 'conflict', maxPoints = 100) {
  try {
    const url = `${GDELT_BASE}?query=${encodeURIComponent(query)}&mode=pointdata&format=geojson&maxpoints=${maxPoints}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    return {
      success: true,
      data: data.features || [],
      source: 'GDELT',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('GDELT fetch error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// Region-specific GDELT queries
export const GDELT_QUERIES = {
  sudan: 'conflict sudan khartoum rsf',
  gaza: 'gaza israel hamas attack',
  venezuela: 'venezuela maduro conflict protest',
  taiwan: 'taiwan china strait military',
  iran: 'iran tehran irgc nuclear',
  ukraine: 'ukraine russia war military'
};

// ============== MOCK GLOBAL CONFLICT DATA ==============
// Used when APIs require authentication or are unavailable
// Based on real conflict data from ACLED/UCDP as of early 2025

export const GLOBAL_CONFLICT_EVENTS = {
  sudan: {
    id: 'sudan',
    name: 'Sudan Civil War',
    startDate: 'Apr 15, 2023',
    status: 'Active',
    parties: ['SAF (Sudan Armed Forces)', 'RSF (Rapid Support Forces)'],
    casualties: '>15,000',
    displaced: '>10 million',
    events: [
      { lat: 15.5007, lon: 32.5599, city: 'Khartoum', type: 'shelling', intensity: 'high', date: '2026-01-07' },
      { lat: 13.6333, lon: 25.3500, city: 'El Fasher', type: 'siege', intensity: 'high', date: '2026-01-06' },
      { lat: 12.0547, lon: 24.8833, city: 'El Geneina', type: 'attack', intensity: 'high', date: '2026-01-05' },
      { lat: 15.1167, lon: 32.5500, city: 'Omdurman', type: 'clashes', intensity: 'medium', date: '2026-01-07' },
      { lat: 14.3833, lon: 35.3833, city: 'Kassala', type: 'displacement', intensity: 'elevated', date: '2026-01-04' }
    ]
  },
  gaza: {
    id: 'gaza',
    name: 'Israel-Gaza War',
    startDate: 'Oct 7, 2023',
    status: 'Active',
    parties: ['IDF (Israel Defense Forces)', 'Hamas', 'PIJ'],
    casualties: '>45,000 (Gaza)',
    displaced: '>1.9 million',
    events: [
      { lat: 31.5069, lon: 34.4565, city: 'Gaza City', type: 'airstrike', intensity: 'high', date: '2026-01-07' },
      { lat: 31.3461, lon: 34.3120, city: 'Khan Yunis', type: 'ground_op', intensity: 'high', date: '2026-01-06' },
      { lat: 31.2437, lon: 34.2408, city: 'Rafah', type: 'crossing_closure', intensity: 'elevated', date: '2026-01-07' },
      { lat: 31.5500, lon: 34.4900, city: 'Jabalia', type: 'shelling', intensity: 'high', date: '2026-01-05' },
      { lat: 31.4200, lon: 34.3700, city: 'Deir al-Balah', type: 'humanitarian', intensity: 'medium', date: '2026-01-07' }
    ]
  },
  venezuela: {
    id: 'venezuela',
    name: 'Venezuela Political Crisis',
    startDate: 'Jan 2019',
    status: 'Elevated',
    parties: ['Maduro Government', 'Opposition Coalition'],
    events: [
      { lat: 10.4806, lon: -66.9036, city: 'Caracas', type: 'protest', intensity: 'elevated', date: '2026-01-06' },
      { lat: 10.1621, lon: -67.9978, city: 'Valencia', type: 'unrest', intensity: 'medium', date: '2026-01-05' },
      { lat: 10.4758, lon: -66.7861, city: 'Petare', type: 'security_ops', intensity: 'elevated', date: '2026-01-04' },
      { lat: 8.1167, lon: -63.5500, city: 'Ciudad Guayana', type: 'protest', intensity: 'medium', date: '2026-01-03' }
    ]
  },
  taiwan_strait: {
    id: 'taiwan_strait',
    name: 'Taiwan Strait Tensions',
    startDate: 'Ongoing',
    status: 'Elevated',
    parties: ['PRC/PLA', 'Taiwan/ROC', 'US Military'],
    events: [
      { lat: 24.1477, lon: 120.6736, city: 'Taichung', type: 'air_incursion', intensity: 'elevated', date: '2026-01-07' },
      { lat: 22.6273, lon: 120.3014, city: 'Kaohsiung', type: 'naval_activity', intensity: 'medium', date: '2026-01-06' },
      { lat: 25.0330, lon: 121.5654, city: 'Taipei', type: 'exercise', intensity: 'medium', date: '2026-01-05' },
      { lat: 24.4500, lon: 118.3833, city: 'Kinmen', type: 'drone_activity', intensity: 'elevated', date: '2026-01-04' },
      { lat: 23.5833, lon: 119.5833, city: 'Penghu', type: 'naval_patrol', intensity: 'medium', date: '2026-01-03' }
    ]
  },
  iran: {
    id: 'iran',
    name: 'Iran Regional Tensions',
    startDate: 'Ongoing',
    status: 'Elevated',
    parties: ['Iran/IRGC', 'Israel', 'Houthis', 'Hezbollah'],
    events: [
      { lat: 35.6892, lon: 51.3890, city: 'Tehran', type: 'military_build', intensity: 'elevated', date: '2026-01-07' },
      { lat: 32.6539, lon: 51.6660, city: 'Isfahan (Natanz)', type: 'nuclear_activity', intensity: 'high', date: '2026-01-06' },
      { lat: 27.1832, lon: 56.2667, city: 'Bandar Abbas', type: 'naval_deploy', intensity: 'elevated', date: '2026-01-05' },
      { lat: 29.4963, lon: 60.8629, city: 'Chabahar', type: 'port_activity', intensity: 'medium', date: '2026-01-04' }
    ]
  }
};

// Event type styling
export const GLOBAL_EVENT_STYLES = {
  shelling: { color: '#ff4757', icon: '💥' },
  airstrike: { color: '#ff4757', icon: '✈️' },
  ground_op: { color: '#ff6b6b', icon: '🎖️' },
  attack: { color: '#ff4757', icon: '⚔️' },
  siege: { color: '#ff4757', icon: '🏰' },
  clashes: { color: '#ff6b6b', icon: '⚔️' },
  protest: { color: '#ffa502', icon: '✊' },
  unrest: { color: '#ffa502', icon: '⚠️' },
  security_ops: { color: '#ff7f50', icon: '🔒' },
  air_incursion: { color: '#ff9f43', icon: '🛩️' },
  naval_activity: { color: '#3498db', icon: '⚓' },
  naval_patrol: { color: '#3498db', icon: '🚢' },
  naval_deploy: { color: '#3498db', icon: '⚓' },
  exercise: { color: '#9b59b6', icon: '🎯' },
  drone_activity: { color: '#9b59b6', icon: '🛸' },
  displacement: { color: '#e67e22', icon: '🏃' },
  crossing_closure: { color: '#e74c3c', icon: '🚫' },
  humanitarian: { color: '#2ecc71', icon: '🏥' },
  military_build: { color: '#ff7f50', icon: '🏗️' },
  nuclear_activity: { color: '#e74c3c', icon: '☢️' },
  port_activity: { color: '#3498db', icon: '⚓' },
  default: { color: '#4da6ff', icon: '📍' }
};

/**
 * Get conflict events for a specific region
 */
export function getConflictEvents(regionId) {
  return GLOBAL_CONFLICT_EVENTS[regionId] || null;
}

/**
 * Get all global conflict events as a flat array with coordinates
 */
export function getAllConflictEvents() {
  const allEvents = [];
  
  Object.values(GLOBAL_CONFLICT_EVENTS).forEach(conflict => {
    conflict.events.forEach(event => {
      allEvents.push({
        ...event,
        conflictName: conflict.name,
        conflictId: conflict.id,
        conflictStatus: conflict.status
      });
    });
  });
  
  return allEvents;
}

/**
 * Fetch region-specific events from GDELT (live news)
 */
export async function fetchRegionNews(region) {
  const query = GDELT_QUERIES[region];
  if (!query) return { success: false, error: 'Unknown region', data: [] };
  
  return await fetchGDELTEvents(query, 50);
}

// ============== ACLED API (Requires API Key) ==============
// Users need to register at acleddata.com for free access

/**
 * Configuration for ACLED API
 * User must provide their own API key and email after registration
 */
export const ACLED_CONFIG = {
  baseUrl: 'https://api.acleddata.com/acled/read',
  registrationUrl: 'https://developer.acleddata.com/',
  // Set your API credentials here after registration
  apiKey: null, // YOUR_API_KEY
  email: null   // YOUR_REGISTERED_EMAIL
};

/**
 * Fetch ACLED conflict events (requires API key)
 * Returns detailed conflict event data with coordinates
 */
export async function fetchACLEDEvents(country, limit = 100) {
  if (!ACLED_CONFIG.apiKey || !ACLED_CONFIG.email) {
    console.warn('ACLED API key not configured. Register at:', ACLED_CONFIG.registrationUrl);
    return { 
      success: false, 
      error: 'ACLED API requires registration. Visit: ' + ACLED_CONFIG.registrationUrl,
      data: [] 
    };
  }
  
  try {
    const url = `${ACLED_CONFIG.baseUrl}?key=${ACLED_CONFIG.apiKey}&email=${ACLED_CONFIG.email}&country=${encodeURIComponent(country)}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    return {
      success: true,
      data: data.data || [],
      count: data.count,
      source: 'ACLED',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('ACLED fetch error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// Export data sources
export const GLOBAL_CONFLICT_SOURCES = {
  acled: {
    name: 'ACLED',
    type: 'API',
    coverage: 'Global conflict events since 1997',
    access: 'Free registration required',
    url: 'https://acleddata.com'
  },
  gdelt: {
    name: 'GDELT',
    type: 'API',
    coverage: 'Global news events, updated every 15 min',
    access: 'Free, no auth',
    url: 'https://gdeltproject.org'
  },
  ucdp: {
    name: 'UCDP',
    type: 'Dataset',
    coverage: 'Armed conflicts since 1946',
    access: 'Free download',
    url: 'https://ucdp.uu.se'
  },
  hdx: {
    name: 'HDX',
    type: 'API/Dataset',
    coverage: 'Humanitarian data globally',
    access: 'Free',
    url: 'https://data.humdata.org'
  }
};
