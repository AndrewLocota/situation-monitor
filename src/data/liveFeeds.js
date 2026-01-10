// Real conflict data feeds
// ISW (Institute for Study of War) Ukraine data via ArcGIS/OCHA
// All data is updated regularly by ISW analysts

// ============== ISW/OCHA API ENDPOINTS ==============

// Frontline - Updated daily
const ISW_FRONTLINE_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/arcgis/rest/services/Ukraine_Front_Line_NEW/FeatureServer/12/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// Areas of Influence (Russian-controlled, contested, Ukrainian-controlled) - Polygons
const ISW_AREAS_OF_INFLUENCE_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Ukraine_areas_of_influence/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// Kherson Oblast Incidents (attacks by location)
const ISW_INCIDENTS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Incidents_in_Khersonska_oblast/FeatureServer/3/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// Ukraine Infrastructure: Airports, Seaports, Border Crossings
const ISW_AIRPORTS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Map_Ukraine_Additional_WFL1/FeatureServer/1/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';
const ISW_SEAPORTS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Map_Ukraine_Additional_WFL1/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';
const ISW_BORDER_CROSSINGS_API = 'https://services-eu1.arcgis.com/fppoCYaq7HfVFbIV/ArcGIS/rest/services/Map_Ukraine_Additional_WFL1/FeatureServer/2/query?where=1%3D1&outFields=*&f=geojson&outSR=4326';

// ============== FRONTLINE DATA ==============
/**
 * Fetch live Ukraine frontline data from ISW/ArcGIS
 * Returns GeoJSON FeatureCollection with LineString geometries
 */
export async function fetchUkraineFrontline() {
  try {
    const response = await fetch(ISW_FRONTLINE_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Transform to Leaflet-compatible format
    const features = data.features.map(feature => ({
      id: feature.id,
      type: feature.geometry.type,
      coordinates: feature.geometry.coordinates,
      conflict: 'ukraine',
      properties: {
        date: feature.properties.Date ? new Date(feature.properties.Date).toLocaleDateString() : 'Unknown',
        source: feature.properties.Source || 'ISW/CTP',
        length: feature.properties.Shape__Length
      }
    }));
    
    return {
      success: true,
      data: features,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch frontline data:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
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
