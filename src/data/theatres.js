// Theatre regions with polygon coordinates for irregular shapes
export const THEATRES = [
  {
    id: 'europe',
    name: 'Eastern Europe',
    description: 'Ukraine / Russia Conflict Zone',
    center: [35, 50],
    bounds: { west: 15, east: 45, north: 60, south: 42 },
    scale: 4,
    // Polygon roughly covering Ukraine, Belarus, Western Russia, Poland border
    polygon: [
      [60, 20], [60, 35], [56, 42], [50, 42], [47, 35], 
      [45, 30], [45, 22], [48, 20], [52, 15], [58, 18]
    ]
  },
  {
    id: 'middle_east',
    name: 'Middle East',
    description: 'Levant / Gulf / Iran',
    center: [45, 30],
    bounds: { west: 26, east: 65, north: 42, south: 12 },
    scale: 4,
    // Polygon covering Turkey, Syria, Iraq, Iran, Gulf states, Israel
    polygon: [
      [42, 26], [42, 45], [38, 50], [35, 62], [25, 62],
      [22, 55], [15, 50], [12, 42], [28, 32], [35, 26]
    ]
  },
  {
    id: 'pacific',
    name: 'Indo-Pacific',
    description: 'Taiwan Strait / South China Sea',
    center: [125, 20],
    bounds: { west: 95, east: 147, north: 45, south: -10 },
    scale: 3,
    // Polygon covering China coast, Taiwan, Philippines, Vietnam, Korea, Japan
    polygon: [
      [45, 100], [45, 130], [40, 145], [25, 145], [10, 140],
      [-5, 130], [-10, 110], [5, 95], [20, 95], [35, 100]
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    description: 'Sahel / Horn of Africa',
    center: [20, 5],
    bounds: { west: -18, east: 52, north: 37, south: -35 },
    scale: 2.5,
    // Polygon roughly covering African continent
    polygon: [
      [37, -10], [35, 12], [30, 32], [20, 42], [5, 50],
      [-5, 50], [-35, 25], [-35, 15], [-25, -15], [10, -18],
      [25, -5], [35, 5]
    ]
  },
  {
    id: 'americas',
    name: 'Americas',
    description: 'Western Hemisphere',
    center: [-80, 15],
    bounds: { west: -150, east: -34, north: 60, south: -55 },
    scale: 2,
    // Polygon covering North/Central/South America
    polygon: [
      [60, -130], [55, -55], [50, -50], [25, -80], [10, -60],
      [-10, -35], [-35, -40], [-55, -70], [-55, -80], [-40, -75],
      [10, -85], [20, -105], [35, -120], [50, -130]
    ]
  }
];

// Intelligence Hotspots - enriched with agencies and detailed info from Claude
export const INTEL_HOTSPOTS = [
  {
    id: 'dc',
    name: 'Washington DC',
    subtext: 'Capitol Hill / Congress',
    lat: 38.8899,
    lon: -77.0090,
    keywords: ['white house', 'washington', 'biden', 'trump', 'congress', 'senate'],
    description: 'US political center. Capitol Hill legislative monitoring.',
    agencies: ['Congress', 'Secret Service'],
    status: 'Active monitoring',
    level: 'watch',
    theatre: 'US_DOMESTIC'
  },
  {
    id: 'pentagon',
    name: 'The Pentagon',
    subtext: 'Pizza Index: ELEVATED',
    lat: 38.8719,
    lon: -77.0563,
    keywords: ['pentagon', 'pizza index', 'logistics', 'dod', 'defense'],
    description: 'Department of Defense HQ. Monitoring Pizza Index: Spike in late-night deliveries indicates potential operational planning.',
    agencies: ['DoD', 'Joint Chiefs', 'DIA'],
    status: 'Pizza Orders: +450%',
    level: 'high',
    theatre: 'US_DOMESTIC'
  },
  {
    id: 'moscow',
    name: 'Moscow',
    subtext: 'Kremlin Activity',
    lat: 55.7558,
    lon: 37.6173,
    keywords: ['russia', 'putin', 'kremlin', 'moscow', 'russian', 'medvedev', 'lavrov'],
    description: 'Russian political and military command center. FSB, GRU, Presidential Administration.',
    agencies: ['FSB', 'GRU', 'SVR', 'Kremlin'],
    status: 'High activity',
    level: 'high',
    theatre: 'EASTERN_EUROPE'
  },
  {
    id: 'beijing',
    name: 'Beijing',
    subtext: 'PLA/MSS Activity',
    lat: 39.9042,
    lon: 116.4074,
    keywords: ['china', 'beijing', 'chinese', 'xi jinping', 'taiwan strait', 'pla', 'ccp'],
    description: 'Chinese Communist Party headquarters. PLA command, MSS intelligence operations.',
    agencies: ['PLA', 'MSS', 'CCP Politburo'],
    status: 'Elevated posture',
    level: 'elevated',
    theatre: 'EAST_ASIA'
  },
  {
    id: 'kyiv',
    name: 'Kyiv',
    subtext: 'Conflict Zone',
    lat: 50.4501,
    lon: 30.5234,
    keywords: ['ukraine', 'kyiv', 'zelensky', 'ukrainian', 'donbas', 'crimea'],
    description: 'Ukrainian capital under wartime conditions. Government, military coordination center.',
    agencies: ['SBU', 'GUR', 'Armed Forces'],
    status: 'Active conflict',
    level: 'high',
    theatre: 'EASTERN_EUROPE'
  },
  {
    id: 'taipei',
    name: 'Taipei',
    subtext: 'Strait Watch',
    lat: 25.0330,
    lon: 121.5654,
    keywords: ['taiwan', 'taipei', 'taiwanese', 'strait', 'tsmc'],
    description: 'Taiwan government and military HQ. ADIZ violations and PLA exercises tracked.',
    agencies: ['NSB', 'MND', 'AIT'],
    status: 'Heightened alert',
    level: 'elevated',
    theatre: 'EAST_ASIA'
  },
  {
    id: 'tehran',
    name: 'Tehran',
    subtext: 'IRGC Activity',
    lat: 35.6892,
    lon: 51.3890,
    keywords: ['iran', 'tehran', 'iranian', 'irgc', 'hezbollah', 'nuclear', 'khamenei'],
    description: 'Iranian regime center. IRGC Quds Force, nuclear program oversight, proxy coordination.',
    agencies: ['IRGC', 'MOIS', 'AEOI'],
    status: 'Proxy operations active',
    level: 'high',
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'telaviv',
    name: 'Tel Aviv',
    subtext: 'Mossad/IDF',
    lat: 32.0853,
    lon: 34.7818,
    keywords: ['israel', 'israeli', 'gaza', 'hamas', 'idf', 'netanyahu', 'mossad'],
    description: 'Israeli security apparatus. IDF operations, Mossad intel, Shin Bet domestic security.',
    agencies: ['Mossad', 'IDF', 'Shin Bet', 'Aman'],
    status: 'Active operations',
    level: 'high',
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'pyongyang',
    name: 'Pyongyang',
    subtext: 'DPRK Watch',
    lat: 39.0392,
    lon: 125.7625,
    keywords: ['north korea', 'kim jong', 'pyongyang', 'dprk', 'korean missile', 'icbm'],
    description: 'North Korean leadership compound. Nuclear/missile program, regime stability indicators.',
    agencies: ['RGB', 'KPA', 'SSD'],
    status: 'Missile tests ongoing',
    level: 'elevated',
    theatre: 'EAST_ASIA'
  },
  {
    id: 'london',
    name: 'London',
    subtext: 'GCHQ/MI6',
    lat: 51.5074,
    lon: -0.1278,
    keywords: ['uk', 'britain', 'british', 'mi6', 'gchq', 'london'],
    description: 'UK intelligence community hub. Five Eyes partner, SIGINT, foreign intelligence.',
    agencies: ['MI6', 'GCHQ', 'MI5'],
    status: 'Normal operations',
    level: 'low',
    theatre: 'GLOBAL'
  },
  {
    id: 'brussels',
    name: 'Brussels',
    subtext: 'NATO HQ',
    lat: 50.8503,
    lon: 4.3517,
    keywords: ['nato', 'eu', 'european union', 'brussels', 'stoltenberg'],
    description: 'NATO headquarters and EU institutions. Alliance coordination, Article 5 readiness.',
    agencies: ['NATO', 'EU Commission', 'EEAS'],
    status: 'Enhanced readiness',
    level: 'elevated',
    theatre: 'GLOBAL'
  },
  {
    id: 'caracas',
    name: 'Caracas',
    subtext: 'Venezuela Crisis',
    lat: 10.4806,
    lon: -66.9036,
    keywords: ['venezuela', 'maduro', 'caracas', 'guaido', 'venezuelan', 'pdvsa'],
    description: 'Venezuelan political crisis center. Maduro regime, opposition movements, oil politics.',
    agencies: ['SEBIN', 'DGCIM', 'GNB'],
    status: 'Political instability',
    level: 'elevated',
    theatre: 'AMERICAS'
  },
  {
    id: 'nuuk',
    name: 'Nuuk',
    subtext: 'Arctic Dispute',
    lat: 64.1836,
    lon: -51.7214,
    keywords: ['greenland', 'denmark', 'arctic', 'nuuk', 'thule', 'rare earth'],
    description: 'Arctic strategic territory. US military presence, rare earth minerals, sovereignty questions.',
    agencies: ['Danish Defence', 'US Space Force', 'Arctic Council'],
    status: 'Diplomatic tensions',
    level: 'watch',
    theatre: 'ARCTIC'
  },
  {
    id: 'new_delhi',
    name: 'New Delhi',
    subtext: 'RAW/IB Activity',
    lat: 28.6139,
    lon: 77.2090,
    keywords: ['india', 'indian', 'modi', 'new delhi', 'kashmir'],
    description: 'Indian government and intelligence hub. Regional power dynamics, Pakistan/China tensions.',
    agencies: ['RAW', 'IB', 'NSA'],
    status: 'Regional monitoring',
    level: 'watch',
    theatre: 'GLOBAL'
  },
  {
    id: 'islamabad',
    name: 'Islamabad',
    subtext: 'ISI Activity',
    lat: 33.7294,
    lon: 73.0931,
    keywords: ['pakistan', 'pakistani', 'islamabad', 'isi', 'imran khan'],
    description: 'Pakistani military and intelligence center. Nuclear state, Afghanistan border, India tensions.',
    agencies: ['ISI', 'Military GHQ'],
    status: 'Political flux',
    level: 'elevated',
    theatre: 'GLOBAL'
  }
];

// Conflict zones enriched with parties, casualties, displaced data from Claude
export const CONFLICT_ZONES = [
  {
    id: 'ukraine',
    name: 'Ukraine Conflict',
    intensity: 'high',
    coords: [
      [37.5, 47.0], [38.5, 47.5], [39.0, 48.5], [38.0, 49.5],
      [37.0, 49.0], [36.0, 48.5], [35.5, 47.5], [36.5, 47.0]
    ],
    labelPos: { lat: 48.0, lon: 37.5 },
    startDate: 'Feb 24, 2022',
    parties: ['Russia', 'Ukraine', 'NATO (support)'],
    casualties: '500,000+ (est.)',
    displaced: '6.5M+ refugees',
    description: 'Full-scale Russian invasion of Ukraine. Active frontlines in Donetsk, Luhansk, Zaporizhzhia, and Kherson oblasts. Heavy artillery, drone warfare, and trench combat.',
    keyEvents: ['Battle of Bakhmut', 'Kursk incursion', 'Black Sea drone strikes', 'Infrastructure attacks'],
    keywords: ['ukraine', 'russia', 'zelensky', 'putin', 'donbas', 'crimea', 'bakhmut', 'kursk', 'kherson', 'zaporizhzhia'],
    theatre: 'EASTERN_EUROPE'
  },
  {
    id: 'gaza',
    name: 'Gaza Conflict',
    intensity: 'high',
    coords: [
      [34.2, 31.6], [34.6, 31.6], [34.6, 31.2], [34.2, 31.2]
    ],
    labelPos: { lat: 31.4, lon: 34.4 },
    startDate: 'Oct 7, 2023',
    parties: ['Israel (IDF)', 'Hamas', 'Palestinian Islamic Jihad'],
    casualties: '45,000+ (Gaza), 1,200+ (Israel)',
    displaced: '2M+ internally displaced',
    description: 'Israeli military operation in Gaza following Oct 7 Hamas attacks. Urban warfare, humanitarian crisis, regional escalation with Hezbollah and Houthis.',
    keyEvents: ['Oct 7 attacks', 'Ground invasion', 'Rafah operation', 'Hostage negotiations'],
    keywords: ['gaza', 'israel', 'hamas', 'idf', 'netanyahu', 'hostage', 'rafah', 'hezbollah', 'palestinian'],
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'sudan',
    name: 'Sudan Civil War',
    intensity: 'medium',
    coords: [
      [32.0, 16.0], [34.0, 16.5], [35.0, 15.0], [33.5, 13.5],
      [31.5, 14.0], [31.0, 15.5]
    ],
    labelPos: { lat: 15.0, lon: 32.5 },
    startDate: 'Apr 15, 2023',
    parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
    casualties: '15,000+ killed',
    displaced: '10M+ displaced',
    description: 'Power struggle between SAF and RSF paramilitary. Fighting centered around Khartoum, Darfur. Major humanitarian catastrophe with famine conditions.',
    keyEvents: ['Khartoum battle', 'Darfur massacres', 'El Fasher siege', 'Famine declared'],
    keywords: ['sudan', 'khartoum', 'rsf', 'darfur', 'burhan', 'hemedti', 'sudanese'],
    theatre: 'AFRICA'
  },
  {
    id: 'myanmar',
    name: 'Myanmar Civil War',
    intensity: 'medium',
    coords: [
      [96.0, 22.0], [98.0, 23.0], [98.5, 21.0], [97.0, 19.5], [95.5, 20.5]
    ],
    labelPos: { lat: 21.0, lon: 96.5 },
    startDate: 'Feb 1, 2021',
    parties: ['Military Junta (SAC)', 'Ethnic Armed Organizations', "People's Defense Forces"],
    casualties: '50,000+ (est.)',
    displaced: '3M+ internally displaced',
    description: "Armed resistance following 2021 military coup. Multiple ethnic armies and pro-democracy forces fighting junta. Recent rebel advances in border regions.",
    keyEvents: ['Operation 1027', 'Lashio capture', 'Myawaddy offensive', 'Junta conscription'],
    keywords: ['myanmar', 'burma', 'junta', 'arakan', 'karen', 'kachin', 'rohingya'],
    theatre: 'SOUTHEAST_ASIA'
  },
  {
    id: 'taiwan_strait',
    name: 'Taiwan Strait',
    intensity: 'watch',
    coords: [
      [119.0, 26.0], [121.5, 26.0], [121.5, 22.5], [119.0, 22.5]
    ],
    labelPos: { lat: 24.5, lon: 120.0 },
    startDate: 'Ongoing tensions',
    parties: ['China (PLA)', 'Taiwan (ROC)', 'United States (deterrence)'],
    casualties: 'N/A - no active combat',
    displaced: 'N/A',
    description: 'Heightened tensions over Taiwan sovereignty. Regular PLA exercises, airspace incursions, naval activity. Risk of flashpoint escalation.',
    keyEvents: ['PLA exercises', 'ADIZ incursions', 'US arms sales', 'Diplomatic tensions'],
    keywords: ['taiwan', 'china', 'strait', 'pla', 'taipei', 'invasion', 'chinese military'],
    theatre: 'EAST_ASIA'
  },
  {
    id: 'yemen',
    name: 'Yemen / Red Sea',
    intensity: 'medium',
    coords: [
      [42.5, 12.5], [45.0, 13.0], [48.0, 15.5], [52.0, 16.5],
      [52.0, 14.0], [48.0, 12.0], [44.0, 11.5]
    ],
    labelPos: { lat: 14.0, lon: 47.0 },
    startDate: '2014 (Houthi); 2023 (Red Sea)',
    parties: ['Houthis (Ansar Allah)', 'Saudi-led Coalition', 'US/UK Naval Forces'],
    casualties: '150,000+ (civil war)',
    displaced: '4M+ displaced',
    description: 'Ongoing civil war with regional proxy involvement. Houthi attacks on Red Sea shipping since Oct 2023 disrupting global trade.',
    keyEvents: ['Red Sea attacks', 'US/UK airstrikes', 'Shipping diversions', 'Ceasefire talks'],
    keywords: ['yemen', 'houthi', 'red sea', 'shipping', 'saudi', 'aden', 'sanaa'],
    theatre: 'MIDDLE_EAST'
  }
];

// Frontline data from Claude
export const FRONTLINES = [
  {
    conflictId: 'ukraine',
    name: 'Eastern Front',
    coords: [
      [37.0, 47.2], [37.5, 47.8], [38.0, 48.2], [38.2, 48.8], [37.8, 49.2]
    ],
    type: 'active'
  },
  {
    conflictId: 'ukraine',
    name: 'Southern Front',
    coords: [
      [35.0, 46.8], [35.5, 47.0], [36.2, 47.1], [37.0, 47.2]
    ],
    type: 'fortified'
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
