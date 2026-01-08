// Theatre regions with geographically accurate bounding boxes
export const THEATRES = [
  {
    id: 'europe',
    name: 'Eastern Europe',
    description: 'Ukraine / Russia Conflict Zone',
    center: [35, 50],
    // Accurate bounds: Western Europe to Urals, Scandinavia to Mediterranean
    bounds: { west: 15, east: 45, north: 60, south: 42 },
    scale: 4
  },
  {
    id: 'middle_east',
    name: 'Middle East',
    description: 'Levant / Gulf / Iran',
    center: [45, 30],
    // Accurate bounds: Egypt to Pakistan, Turkey to Yemen
    bounds: { west: 26, east: 65, north: 42, south: 12 },
    scale: 4
  },
  {
    id: 'pacific',
    name: 'Indo-Pacific',
    description: 'Taiwan Strait / South China Sea',
    center: [125, 20],
    // Accurate bounds: Bay of Bengal to Japan, Mongolia to Indonesia
    bounds: { west: 95, east: 147, north: 45, south: -10 },
    scale: 3
  },
  {
    id: 'africa',
    name: 'Africa',
    description: 'Sahel / Horn of Africa',
    center: [20, 5],
    // Accurate bounds: African continent
    bounds: { west: -18, east: 52, north: 37, south: -35 },
    scale: 2.5
  },
  {
    id: 'americas',
    name: 'Americas',
    description: 'Western Hemisphere',
    center: [-80, 15],
    // Accurate bounds: North and South America
    bounds: { west: -150, east: -34, north: 60, south: -55 },
    scale: 2
  }
];

// Intelligence Hotspots - accurate coordinates
export const INTEL_HOTSPOTS = [
  {
    id: 'dc', name: 'Washington DC', subtext: 'Pentagon', lat: 38.9072, lon: -77.0369,
    keywords: ['pentagon', 'white house', 'washington'],
    description: 'US national security hub.',
    status: 'Active monitoring',
    level: 'medium'
  },
  {
    id: 'moscow', name: 'Moscow', subtext: 'Kremlin', lat: 55.7558, lon: 37.6173,
    keywords: ['russia', 'putin', 'kremlin'],
    description: 'Russian command center.',
    status: 'High activity',
    level: 'high'
  },
  {
    id: 'beijing', name: 'Beijing', subtext: 'PLA/MSS', lat: 39.9042, lon: 116.4074,
    keywords: ['china', 'beijing', 'xi jinping'],
    description: 'CCP headquarters.',
    status: 'Elevated posture',
    level: 'elevated'
  },
  {
    id: 'kyiv', name: 'Kyiv', subtext: 'Active Conflict', lat: 50.4501, lon: 30.5234,
    keywords: ['ukraine', 'kyiv', 'zelensky'],
    description: 'Ukrainian capital.',
    status: 'Active conflict',
    level: 'high'
  },
  {
    id: 'taipei', name: 'Taipei', subtext: 'Strait Watch', lat: 25.0330, lon: 121.5654,
    keywords: ['taiwan', 'taipei'],
    description: 'Taiwan government HQ.',
    status: 'Heightened alert',
    level: 'elevated'
  },
  {
    id: 'tehran', name: 'Tehran', subtext: 'IRGC', lat: 35.6892, lon: 51.3890,
    keywords: ['iran', 'tehran', 'irgc'],
    description: 'Iranian regime center.',
    status: 'Proxy operations active',
    level: 'high'
  },
  {
    id: 'telaviv', name: 'Tel Aviv', subtext: 'IDF/Mossad', lat: 32.0853, lon: 34.7818,
    keywords: ['israel', 'gaza', 'hamas'],
    description: 'Israeli security apparatus.',
    status: 'Active operations',
    level: 'high'
  },
  {
    id: 'pyongyang', name: 'Pyongyang', subtext: 'DPRK', lat: 39.0392, lon: 125.7625,
    keywords: ['north korea', 'kim jong'],
    description: 'DPRK leadership.',
    status: 'Missile tests',
    level: 'elevated'
  },
  {
    id: 'brussels', name: 'Brussels', subtext: 'NATO HQ', lat: 50.8503, lon: 4.3517,
    keywords: ['nato', 'eu'],
    description: 'NATO headquarters.',
    status: 'Enhanced readiness',
    level: 'medium'
  },
  {
    id: 'caracas', name: 'Caracas', subtext: 'Venezuela', lat: 10.4806, lon: -66.9036,
    keywords: ['venezuela', 'maduro'],
    description: 'Venezuelan crisis center.',
    status: 'Political instability',
    level: 'elevated'
  }
];

// Conflict zones with accurate polygon coordinates
export const CONFLICT_ZONES = [
  {
    id: 'ukraine',
    name: 'Ukraine Front',
    intensity: 'high',
    coords: [
      [36.0, 47.5], [37.5, 48.0], [39.5, 48.5], [40.0, 49.5],
      [38.5, 50.0], [37.0, 49.5], [35.5, 48.5], [35.0, 47.8]
    ],
    labelPos: { lat: 48.5, lon: 37.5 },
    startDate: 'Feb 24, 2022',
    description: 'Active frontline in Donbas region.',
    keywords: ['ukraine', 'russia', 'donbas']
  },
  {
    id: 'gaza',
    name: 'Gaza',
    intensity: 'high',
    coords: [
      [34.22, 31.59], [34.56, 31.59], [34.56, 31.22], [34.22, 31.22]
    ],
    labelPos: { lat: 31.4, lon: 34.4 },
    startDate: 'Oct 7, 2023',
    description: 'Israeli-Hamas conflict zone.',
    keywords: ['gaza', 'israel', 'hamas']
  },
  {
    id: 'sudan',
    name: 'Sudan',
    intensity: 'medium',
    coords: [
      [32.0, 16.0], [34.0, 16.5], [35.0, 15.0], [33.5, 13.5],
      [31.5, 14.0], [31.0, 15.5]
    ],
    labelPos: { lat: 15.0, lon: 32.5 },
    startDate: 'Apr 15, 2023',
    description: 'SAF vs RSF civil war.',
    keywords: ['sudan', 'khartoum']
  },
  {
    id: 'taiwan_strait',
    name: 'Taiwan Strait',
    intensity: 'watch',
    coords: [
      [118.5, 26.5], [122.5, 26.5], [122.5, 22.0], [118.5, 22.0]
    ],
    labelPos: { lat: 24.0, lon: 120.5 },
    startDate: 'Ongoing',
    description: 'PLA exercises, tension zone.',
    keywords: ['taiwan', 'china', 'strait']
  }
];

// Military bases with accurate coordinates
export const MILITARY_BASES = [
  // US/NATO
  { id: 'ramstein', name: 'Ramstein AB', lat: 49.4369, lon: 7.6003, type: 'us-nato' },
  { id: 'diego_garcia', name: 'Diego Garcia', lat: -7.3195, lon: 72.4229, type: 'us-nato' },
  { id: 'guam', name: 'Andersen AFB', lat: 13.5840, lon: 144.9305, type: 'us-nato' },
  { id: 'okinawa', name: 'Kadena AB', lat: 26.3516, lon: 127.7695, type: 'us-nato' },
  { id: 'yokosuka', name: 'Yokosuka', lat: 35.2833, lon: 139.6667, type: 'us-nato' },
  { id: 'bahrain', name: 'NSA Bahrain', lat: 26.2285, lon: 50.6501, type: 'us-nato' },
  { id: 'qatar', name: 'Al Udeid', lat: 25.1175, lon: 51.3150, type: 'us-nato' },
  { id: 'incirlik', name: 'Incirlik AB', lat: 37.0017, lon: 35.4258, type: 'us-nato' },
  // Chinese
  { id: 'djibouti_cn', name: 'PLA Djibouti', lat: 11.5886, lon: 43.0500, type: 'china' },
  { id: 'woody_island', name: 'Woody Island', lat: 16.8333, lon: 112.3333, type: 'china' },
  { id: 'fiery_cross', name: 'Fiery Cross', lat: 9.5500, lon: 112.8900, type: 'china' },
  { id: 'mischief_reef', name: 'Mischief Reef', lat: 9.9000, lon: 115.5300, type: 'china' },
  // Russian
  { id: 'kaliningrad', name: 'Kaliningrad', lat: 54.7104, lon: 20.4522, type: 'russia' },
  { id: 'sevastopol', name: 'Sevastopol', lat: 44.6166, lon: 33.5254, type: 'russia' },
  { id: 'tartus', name: 'Tartus (Syria)', lat: 34.8959, lon: 35.8867, type: 'russia' },
  { id: 'hmeimim', name: 'Hmeimim AB', lat: 35.4008, lon: 35.9486, type: 'russia' }
];

// Shipping chokepoints with accurate coordinates
export const SHIPPING_CHOKEPOINTS = [
  { id: 'suez', name: 'Suez Canal', lat: 30.4500, lon: 32.3500, desc: '12% of global trade', traffic: '~50/day' },
  { id: 'panama', name: 'Panama Canal', lat: 9.0800, lon: -79.6800, desc: '5% of global trade', traffic: '~40/day' },
  { id: 'hormuz', name: 'Strait of Hormuz', lat: 26.5500, lon: 56.2500, desc: '21% of global oil', traffic: '~20/day' },
  { id: 'malacca', name: 'Malacca Strait', lat: 2.5000, lon: 101.4500, desc: '25% of global trade', traffic: '~80/day' },
  { id: 'bosphorus', name: 'Bosphorus', lat: 41.1190, lon: 29.0510, desc: 'Black Sea access', traffic: '~45/day' },
  { id: 'bab_el_mandeb', name: 'Bab el-Mandeb', lat: 12.5833, lon: 43.3333, desc: 'Red Sea gateway', traffic: '~30/day' }
];

// Nuclear facilities with accurate coordinates
export const NUCLEAR_FACILITIES = [
  { id: 'natanz', name: 'Natanz', lat: 33.7200, lon: 51.7200, country: 'Iran', type: 'Enrichment' },
  { id: 'fordow', name: 'Fordow', lat: 34.8800, lon: 50.9700, country: 'Iran', type: 'Enrichment' },
  { id: 'yongbyon', name: 'Yongbyon', lat: 39.7900, lon: 125.7500, country: 'DPRK', type: 'Reactor' },
  { id: 'dimona', name: 'Dimona', lat: 31.0000, lon: 35.1500, country: 'Israel', type: 'Reactor' },
  { id: 'zaporizhzhia', name: 'Zaporizhzhia NPP', lat: 47.5060, lon: 34.5850, country: 'Ukraine', type: 'Power' }
];

// Cyber threat zones
export const CYBER_ZONES = [
  { id: 'cyber_russia', name: 'RU', fullName: 'Russia', lat: 55.75, lon: 45.0, group: 'APT28/29', targets: ['Government', 'Defense'] },
  { id: 'cyber_china', name: 'CN', fullName: 'China', lat: 35.0, lon: 105.0, group: 'APT41', targets: ['Tech', 'Supply Chain'] },
  { id: 'cyber_nk', name: 'NK', fullName: 'North Korea', lat: 39.0, lon: 127.0, group: 'Lazarus', targets: ['Crypto', 'Banks'] },
  { id: 'cyber_iran', name: 'IR', fullName: 'Iran', lat: 32.0, lon: 53.0, group: 'APT33/35', targets: ['Energy', 'Israel'] }
];
