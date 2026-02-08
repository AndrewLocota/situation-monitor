// Real conflict data feeds
// ISW (Institute for Study of War) Ukraine data via ArcGIS/OCHA
// All data is updated regularly by ISW analysts
import { fetchWithCorsProxy } from '../services/api/corsProxy';

// ============== ISW/OCHA API ENDPOINTS ==============

// Frontline - Updated daily
const ISW_FRONTLINE_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/arcgis/rest/services/Ukraine_Front_Line_NEW/FeatureServer/12/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';
const ISW_FRONTLINE_API_ALT_LAYER = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/arcgis/rest/services/Ukraine_Front_Line_NEW/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';
const ISW_FRONTLINE_API_ALT_SERVICE = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/UKR_Frontline_27072025/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// Areas of Influence (Russian-controlled, contested, Ukrainian-controlled) - Polygons
const ISW_AREAS_OF_INFLUENCE_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Ukraine_areas_of_influence/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// Kherson Oblast Incidents (attacks by location)
const ISW_INCIDENTS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Incidents_in_Khersonska_oblast/FeatureServer/3/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// Ukraine Infrastructure: Airports, Seaports, Border Crossings
const ISW_AIRPORTS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Map_Ukraine_Additional_WFL1/FeatureServer/1/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';
const ISW_SEAPORTS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Map_Ukraine_Additional_WFL1/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';
const ISW_BORDER_CROSSINGS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Map_Ukraine_Additional_WFL1/FeatureServer/2/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// ============== UKRAINE FRONTLINE (Static Fallback) ==============
// Approximate frontline positions based on publicly reported data (Feb 2026)
// This serves as a fallback when the ISW API requires authentication
// Coordinates follow the general line of contact from north to south
const UKRAINE_FRONTLINE_FALLBACK = [
  {
    id: 'ukraine-frontline-north-1',
    type: 'LineString',
    conflict: 'ukraine',
    // Northern sector: Kharkiv Oblast border area
    coordinates: [
      [36.80, 50.35], [37.00, 50.25], [37.20, 50.15], [37.40, 50.05], [37.60, 49.95]
    ],
    properties: { name: 'Kharkiv Oblast Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-north-2',
    type: 'LineString',
    conflict: 'ukraine',
    // Kupyansk-Svatove area
    coordinates: [
      [37.60, 49.95], [37.80, 49.75], [38.00, 49.55], [38.10, 49.35], [38.00, 49.15]
    ],
    properties: { name: 'Kupyansk-Svatove Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-luhansk',
    type: 'LineString',
    conflict: 'ukraine',
    // Luhansk Oblast - Kreminna sector
    coordinates: [
      [38.00, 49.15], [37.90, 49.00], [37.85, 48.85], [37.90, 48.70], [38.00, 48.55]
    ],
    properties: { name: 'Kreminna-Siversk Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-bakhmut',
    type: 'LineString',
    conflict: 'ukraine',
    // Bakhmut area - heavily contested
    coordinates: [
      [38.00, 48.55], [37.95, 48.45], [37.90, 48.35], [37.85, 48.25], [37.80, 48.15]
    ],
    properties: { name: 'Bakhmut-Chasiv Yar Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-avdiivka',
    type: 'LineString',
    conflict: 'ukraine',
    // Avdiivka-Pokrovsk direction
    coordinates: [
      [37.80, 48.15], [37.60, 48.10], [37.40, 48.05], [37.20, 48.00], [37.00, 47.95]
    ],
    properties: { name: 'Pokrovsk Direction Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-south-donetsk',
    type: 'LineString',
    conflict: 'ukraine',
    // South Donetsk - Vuhledar area
    coordinates: [
      [37.00, 47.95], [36.80, 47.85], [36.60, 47.75], [36.40, 47.65], [36.20, 47.55]
    ],
    properties: { name: 'Vuhledar Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-zaporizhzhia',
    type: 'LineString',
    conflict: 'ukraine',
    // Zaporizhzhia Oblast line
    coordinates: [
      [36.20, 47.55], [35.80, 47.45], [35.40, 47.35], [35.00, 47.25], [34.60, 47.15]
    ],
    properties: { name: 'Zaporizhzhia Front', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-dnipro',
    type: 'LineString',
    conflict: 'ukraine',
    // Dnipro River line - Kherson area
    coordinates: [
      [34.60, 47.15], [34.20, 46.95], [33.80, 46.75], [33.40, 46.60], [33.00, 46.55]
    ],
    properties: { name: 'Dnipro River Line', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  },
  {
    id: 'ukraine-frontline-crimea-border',
    type: 'LineString',
    conflict: 'ukraine',
    // Northern Crimea border area
    coordinates: [
      [33.00, 46.55], [33.50, 46.20], [34.00, 46.00], [34.50, 45.80], [35.00, 45.60]
    ],
    properties: { name: 'Crimea Administrative Border', source: 'Public reporting (approximate)', date: 'Feb 2026' }
  }
];

const ISW_FRONTLINE_ENDPOINTS = [
  { name: 'Ukraine_Front_Line_NEW/12', url: ISW_FRONTLINE_API },
  { name: 'Ukraine_Front_Line_NEW/0', url: ISW_FRONTLINE_API_ALT_LAYER },
  { name: 'UKR_Frontline_27072025/0', url: ISW_FRONTLINE_API_ALT_SERVICE }
];

function parseTimestamp(value) {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'number') {
    // ArcGIS epoch values are usually milliseconds.
    if (value > 1e12) return value;
    if (value > 1e9) return value * 1000;
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDateFromTimestamp(timestamp) {
  if (!timestamp) return 'Unknown';
  return new Date(timestamp).toLocaleDateString();
}

function isValidLonLatPair(coord) {
  return Array.isArray(coord) &&
    coord.length >= 2 &&
    Number.isFinite(coord[0]) &&
    Number.isFinite(coord[1]) &&
    Math.abs(coord[0]) <= 180 &&
    Math.abs(coord[1]) <= 90;
}

function normalizeFrontlineFeatures(data, endpointName) {
  if (!data || !Array.isArray(data.features)) return [];

  const normalized = [];

  data.features.forEach((feature, featureIdx) => {
    const geometry = feature?.geometry;
    const properties = feature?.properties || {};
    const rawDate = properties.Date ?? properties.EditDate ?? properties.date ?? properties.CreationDa ?? null;
    const timestamp = parseTimestamp(rawDate);

    const baseProps = {
      date: formatDateFromTimestamp(timestamp),
      rawDate,
      source: properties.Source || properties.source || 'ISW/CTP',
      endpoint: endpointName
    };

    if (!geometry) return;

    if (geometry.type === 'LineString' && Array.isArray(geometry.coordinates)) {
      const coords = geometry.coordinates.filter(isValidLonLatPair);
      if (coords.length >= 2) {
        normalized.push({
          id: feature.id || `ukraine-frontline-${featureIdx}`,
          type: 'LineString',
          coordinates: coords,
          conflict: 'ukraine',
          properties: baseProps
        });
      }
      return;
    }

    if (geometry.type === 'MultiLineString' && Array.isArray(geometry.coordinates)) {
      geometry.coordinates.forEach((lineCoords, lineIdx) => {
        const coords = Array.isArray(lineCoords) ? lineCoords.filter(isValidLonLatPair) : [];
        if (coords.length >= 2) {
          normalized.push({
            id: `${feature.id || featureIdx}-line-${lineIdx}`,
            type: 'LineString',
            coordinates: coords,
            conflict: 'ukraine',
            properties: baseProps
          });
        }
      });
      return;
    }

    // Esri JSON fallback (paths) if a proxy does not preserve GeoJSON formatting.
    if (Array.isArray(geometry.paths)) {
      geometry.paths.forEach((lineCoords, lineIdx) => {
        const coords = Array.isArray(lineCoords) ? lineCoords.filter(isValidLonLatPair) : [];
        if (coords.length >= 2) {
          normalized.push({
            id: `${feature.id || featureIdx}-path-${lineIdx}`,
            type: 'LineString',
            coordinates: coords,
            conflict: 'ukraine',
            properties: baseProps
          });
        }
      });
    }
  });

  return normalized;
}

async function fetchFrontlineEndpoint(endpoint) {
  const response = await fetchWithCorsProxy(endpoint.url);
  if (!response) {
    throw new Error('No response from endpoint/proxies');
  }

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON payload');
  }

  if (data.error) {
    throw new Error(data.error.message || 'ArcGIS API returned error');
  }

  const segments = normalizeFrontlineFeatures(data, endpoint.name);
  if (segments.length === 0) {
    throw new Error('No usable frontline segments');
  }

  const latestTimestamp = segments.reduce((max, segment) => {
    const ts = parseTimestamp(segment.properties?.rawDate) || 0;
    return Math.max(max, ts);
  }, 0);

  return {
    endpointName: endpoint.name,
    endpointUrl: endpoint.url,
    segments,
    latestTimestamp
  };
}

// ============== FRONTLINE DATA ==============
/**
 * Fetch live Ukraine frontline data from ISW/ArcGIS.
 * Tries multiple ISW endpoints and proxy fallback, then chooses the best result.
 */
export async function fetchUkraineFrontline() {
  const candidates = [];

  for (const endpoint of ISW_FRONTLINE_ENDPOINTS) {
    try {
      const result = await fetchFrontlineEndpoint(endpoint);
      candidates.push(result);
      console.log(`[ISW] ${endpoint.name}: ${result.segments.length} segments`);
    } catch (error) {
      console.warn(`[ISW] ${endpoint.name} failed:`, error.message);
    }
  }

  if (candidates.length > 0) {
    const best = candidates
      .sort((a, b) => {
        const tsDiff = (b.latestTimestamp || 0) - (a.latestTimestamp || 0);
        if (tsDiff !== 0) return tsDiff;
        return b.segments.length - a.segments.length;
      })[0];

    console.log(
      `[ISW] Using ${best.endpointName} (${best.segments.length} segments, ` +
      `latest=${best.latestTimestamp ? new Date(best.latestTimestamp).toISOString() : 'unknown'})`
    );

    return {
      success: true,
      data: best.segments,
      source: `ISW/CTP (live: ${best.endpointName})`,
      dataTimestamp: best.latestTimestamp ? new Date(best.latestTimestamp).toISOString() : null,
      endpoint: best.endpointUrl,
      lastUpdated: new Date().toISOString()
    };
  }

  console.warn('[ISW] All frontline endpoints failed, using fallback approximation');
  return {
    success: true,
    data: UKRAINE_FRONTLINE_FALLBACK,
    source: 'Fallback (approximate)',
    lastUpdated: new Date().toISOString()
  };
}

// ============== SUDAN FRONTLINES (Static approximation) ==============
// Sudan Civil War: SAF (Sudanese Armed Forces) vs RSF (Rapid Support Forces)
// Data based on publicly reported conflict zones as of early 2026
const SUDAN_FRONTLINES = [
  {
    id: 'sudan-khartoum-1',
    type: 'LineString',
    conflict: 'sudan',
    // Khartoum battle lines - around the city center
    coordinates: [
      [32.48, 15.62], [32.52, 15.60], [32.56, 15.58], [32.60, 15.56], [32.64, 15.55]
    ],
    properties: { name: 'Khartoum Front', source: 'Estimated from ACLED data', parties: 'SAF vs RSF' }
  },
  {
    id: 'sudan-khartoum-2',
    type: 'LineString',
    conflict: 'sudan',
    // Omdurman front
    coordinates: [
      [32.42, 15.68], [32.46, 15.66], [32.50, 15.64], [32.52, 15.62]
    ],
    properties: { name: 'Omdurman Front', source: 'Estimated from ACLED data', parties: 'SAF vs RSF' }
  },
  {
    id: 'sudan-darfur-1',
    type: 'LineString',
    conflict: 'sudan',
    // El Fasher area - North Darfur
    coordinates: [
      [25.20, 13.60], [25.30, 13.65], [25.40, 13.62], [25.50, 13.58]
    ],
    properties: { name: 'El Fasher Front', source: 'Estimated from ACLED data', parties: 'SAF vs RSF' }
  },
  {
    id: 'sudan-gezira',
    type: 'LineString',
    conflict: 'sudan',
    // Gezira/Wad Madani area
    coordinates: [
      [33.40, 14.38], [33.50, 14.40], [33.60, 14.42], [33.70, 14.45]
    ],
    properties: { name: 'Gezira Front', source: 'Estimated from ACLED data', parties: 'SAF vs RSF' }
  }
];

// ============== MYANMAR FRONTLINES (Static approximation) ==============
// Myanmar Civil War: Military Junta (Tatmadaw) vs Various Resistance Forces (NUG/PDF, Ethnic Armed Organizations)
// Data based on publicly reported conflict zones as of early 2026
const MYANMAR_FRONTLINES = [
  {
    id: 'myanmar-sagaing-1',
    type: 'LineString',
    conflict: 'myanmar',
    // Sagaing Region - heavy resistance area
    coordinates: [
      [95.00, 22.00], [95.20, 22.10], [95.40, 22.05], [95.60, 21.95], [95.80, 21.90]
    ],
    properties: { name: 'Sagaing Front', source: 'Estimated from conflict reports', parties: 'Tatmadaw vs PDF/NUG' }
  },
  {
    id: 'myanmar-chin-1',
    type: 'LineString',
    conflict: 'myanmar',
    // Chin State
    coordinates: [
      [93.60, 22.50], [93.70, 22.60], [93.80, 22.55], [93.90, 22.45]
    ],
    properties: { name: 'Chin State Front', source: 'Estimated from conflict reports', parties: 'Tatmadaw vs CDF' }
  },
  {
    id: 'myanmar-kayah-1',
    type: 'LineString',
    conflict: 'myanmar',
    // Kayah (Karenni) State
    coordinates: [
      [97.10, 19.70], [97.20, 19.75], [97.30, 19.72], [97.40, 19.68]
    ],
    properties: { name: 'Kayah State Front', source: 'Estimated from conflict reports', parties: 'Tatmadaw vs KNDF' }
  },
  {
    id: 'myanmar-karen-1',
    type: 'LineString',
    conflict: 'myanmar',
    // Karen (Kayin) State - Myawaddy area
    coordinates: [
      [98.40, 16.80], [98.50, 16.75], [98.55, 16.65], [98.50, 16.55]
    ],
    properties: { name: 'Karen State Front', source: 'Estimated from conflict reports', parties: 'Tatmadaw vs KNLA' }
  },
  {
    id: 'myanmar-shan-1',
    type: 'LineString',
    conflict: 'myanmar',
    // Northern Shan State - Operation 1027 area
    coordinates: [
      [96.80, 23.80], [97.00, 23.85], [97.20, 23.82], [97.40, 23.78], [97.60, 23.75]
    ],
    properties: { name: 'Northern Shan Front', source: 'Operation 1027 area', parties: 'Tatmadaw vs 3BHA' }
  }
];

/**
 * Fetch Sudan frontlines (static data based on conflict reports)
 */
export async function fetchSudanFrontlines() {
  return {
    success: true,
    data: SUDAN_FRONTLINES,
    source: 'ACLED/conflict reports (approximated)',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Fetch Myanmar frontlines (static data based on conflict reports)
 */
export async function fetchMyanmarFrontlines() {
  return {
    success: true,
    data: MYANMAR_FRONTLINES,
    source: 'Conflict reports (approximated)',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Fetch all frontlines (Ukraine live + Sudan/Myanmar static)
 */
export async function fetchAllFrontlines() {
  const [ukraine, sudan, myanmar] = await Promise.all([
    fetchUkraineFrontline(),
    fetchSudanFrontlines(),
    fetchMyanmarFrontlines()
  ]);

  return {
    ukraine: ukraine.success ? ukraine.data : [],
    sudan: sudan.data,
    myanmar: myanmar.data,
    lastUpdated: new Date().toISOString()
  };
}

// ============== AREAS OF INFLUENCE ==============
/**
 * Fetch areas of influence (Russian infiltration areas, contested zones, etc.)
 * Returns polygon data showing control status
 */
export async function fetchAreasOfInfluence() {
  try {
    const response = await fetch(ISW_AREAS_OF_INFLUENCE_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    const features = data.features.map(feature => ({
      id: feature.id,
      type: feature.geometry.type,
      coordinates: feature.geometry.coordinates,
      properties: {
        actorType: feature.properties.Actor_Type || 'Unknown',
        createdDate: feature.properties.CreationDa ? new Date(feature.properties.CreationDa).toLocaleDateString() : null,
        editDate: feature.properties.EditDate ? new Date(feature.properties.EditDate).toLocaleDateString() : null,
        creator: feature.properties.Creator,
        area: feature.properties.Shape__Area
      }
    }));
    
    return {
      success: true,
      data: features,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch areas of influence:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

// ============== ATTACK INCIDENTS ==============
/**
 * Fetch attack incidents in Kherson Oblast
 * Returns point data with attack counts and locations
 */
export async function fetchIncidents() {
  try {
    const response = await fetch(ISW_INCIDENTS_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    const features = data.features.map(feature => ({
      id: feature.id,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      properties: {
        location: feature.properties.ADM4_EN || 'Unknown',
        region: feature.properties.ADM3_EN,
        oblast: feature.properties.ADM1_EN,
        attacks: feature.properties.Attacks || 1,
        date: feature.properties.date ? new Date(feature.properties.date).toLocaleDateString() : null
      }
    }));
    
    return {
      success: true,
      data: features,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

// ============== UKRAINE INFRASTRUCTURE ==============
/**
 * Fetch Ukraine airports
 */
export async function fetchUkraineAirports() {
  try {
    const response = await fetch(ISW_AIRPORTS_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return {
      success: true,
      data: data.features.map(f => ({
        id: f.id,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        name: f.properties.name || f.properties.Name || 'Airport',
        type: 'airport'
      })),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch airports:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Fetch Ukraine seaports
 */
export async function fetchUkraineSeaports() {
  try {
    const response = await fetch(ISW_SEAPORTS_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return {
      success: true,
      data: data.features.map(f => ({
        id: f.id,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        name: f.properties.name || f.properties.Name || 'Seaport',
        type: 'seaport'
      })),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch seaports:', error);
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Fetch Ukraine border crossings
 */
export async function fetchBorderCrossings() {
  try {
    const response = await fetch(ISW_BORDER_CROSSINGS_API);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return {
      success: true,
      data: data.features.map(f => ({
        id: f.id,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
        name: f.properties.name || f.properties.Name || 'Border Crossing',
        type: 'border_crossing'
      })),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch border crossings:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// ============== LIVE EVENT STYLES ==============
export const EVENT_STYLES = {
  shelling: { color: '#ff4757', label: 'SHELLING', icon: '💥' },
  air_alert: { color: '#ffa502', label: 'AIR ALERT', icon: '🚨' },
  drone: { color: '#9b59b6', label: 'DRONE', icon: '🛸' },
  explosion: { color: '#e74c3c', label: 'EXPLOSION', icon: '💣' },
  military: { color: '#3498db', label: 'MILITARY', icon: '🎖️' },
  naval: { color: '#1abc9c', label: 'NAVAL', icon: '⚓' },
  incident: { color: '#ff6b6b', label: 'INCIDENT', icon: '⚠️' }
};

// Area of influence colors
export const INFLUENCE_COLORS = {
  'Assessed Russian Infiltration Areas in Ukraine': '#ff4757',
  'Russian Controlled': '#ff4757',
  'Contested': '#ffa502',
  'Ukrainian Controlled': '#2ed573',
  'default': '#ff4757'
};

// Mock live events for Ukraine theater (used when real API unavailable)
const MOCK_UKRAINE_EVENTS = [
  { id: 'evt1', type: 'shelling', lat: 48.0159, lon: 37.8028, title: 'Artillery strikes reported', timestamp: '2 min ago', city: 'Donetsk' },
  { id: 'evt2', type: 'air_alert', lat: 50.4501, lon: 30.5234, title: 'Air raid alert active', timestamp: '5 min ago', city: 'Kyiv' },
  { id: 'evt3', type: 'drone', lat: 46.4825, lon: 30.7233, title: 'Drone activity detected', timestamp: '12 min ago', city: 'Odesa' },
  { id: 'evt4', type: 'explosion', lat: 48.4647, lon: 35.0462, title: 'Explosion reported', timestamp: '18 min ago', city: 'Dnipro' },
  { id: 'evt5', type: 'military', lat: 49.9935, lon: 36.2304, title: 'Troop movements observed', timestamp: '25 min ago', city: 'Kharkiv' },
  { id: 'evt6', type: 'shelling', lat: 47.0951, lon: 37.5437, title: 'Heavy bombardment', timestamp: '30 min ago', city: 'Mariupol' },
  { id: 'evt7', type: 'naval', lat: 44.6166, lon: 33.5254, title: 'Naval activity detected', timestamp: '45 min ago', city: 'Sevastopol' },
  { id: 'evt8', type: 'drone', lat: 51.5074, lon: 31.2848, title: 'Shahed drone interception', timestamp: '1 hour ago', city: 'Chernihiv' }
];

/**
 * Fetch live events (mock data - replace with real LiveUAMap API when available)
 */
export async function fetchLiveUAMapEvents() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    success: true,
    data: MOCK_UKRAINE_EVENTS,
    source: 'Mock Data (LiveUAMap API unavailable)',
    lastUpdated: new Date().toISOString()
  };
}

// ============== DATA SOURCE REGISTRY ==============
export const ISW_DATA_SOURCES = {
  frontline: {
    name: 'Ukraine Frontline',
    url: ISW_FRONTLINE_API,
    type: 'LineString',
    description: 'Current front line positions, updated daily',
    attribution: 'ISW/Critical Threats Project'
  },
  areasOfInfluence: {
    name: 'Areas of Influence',
    url: ISW_AREAS_OF_INFLUENCE_API,
    type: 'Polygon',
    description: 'Russian-controlled, contested, and infiltration areas',
    attribution: 'ISW/OCHA'
  },
  incidents: {
    name: 'Attack Incidents',
    url: ISW_INCIDENTS_API,
    type: 'Point',
    description: 'Recorded attack incidents in Kherson Oblast',
    attribution: 'OCHA'
  },
  airports: {
    name: 'Airports',
    url: ISW_AIRPORTS_API,
    type: 'Point',
    description: 'Ukraine airports',
    attribution: 'OCHA'
  },
  seaports: {
    name: 'Seaports',
    url: ISW_SEAPORTS_API,
    type: 'Point',
    description: 'Ukraine seaports',
    attribution: 'OCHA'
  },
  borderCrossings: {
    name: 'Border Crossings',
    url: ISW_BORDER_CROSSINGS_API,
    type: 'Point',
    description: 'Ukraine border crossing points',
    attribution: 'OCHA'
  }
};

/**
 * Fetch all ISW data at once
 */
export async function fetchAllISWData() {
  const results = await Promise.allSettled([
    fetchUkraineFrontline(),
    fetchAreasOfInfluence(),
    fetchIncidents()
  ]);
  
  return {
    frontline: results[0].status === 'fulfilled' ? results[0].value : { success: false, data: [] },
    areasOfInfluence: results[1].status === 'fulfilled' ? results[1].value : { success: false, data: [] },
    incidents: results[2].status === 'fulfilled' ? results[2].value : { success: false, data: [] },
    lastUpdated: new Date().toISOString()
  };
}
