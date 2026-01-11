// Theatre regions with polygon coordinates for irregular shapes
export const THEATRES = [
  {
    id: 'europe',
    name: 'Eastern Europe',
    description: 'Ukraine / Russia Conflict Zone',
    center: [35, 50],
    bounds: { west: 15, east: 45, north: 60, south: 42 },
    scale: 4,
    // Polygon covering Ukraine, Belarus, Russia, Poland, Czechia, Slovakia, Hungary, Romania, Serbia, Bulgaria, Georgia (excludes Austria/Slovenia)
    polygon: [
      [55, 14], [60, 22], [60, 45], [55, 48], [50, 46], [42, 46],
      [42, 28], [42, 22], [45, 17], [49, 14], [52, 14]
    ]
  },
  {
    id: 'middle_east',
    name: 'Middle East',
    description: 'Levant / Gulf / Iran',
    center: [45, 30],
    bounds: { west: 26, east: 65, north: 42, south: 12 },
    scale: 4,
    // Polygon covering Turkey, Syria, Iraq, Iran, Gulf states, Oman, Israel (excludes Rhodes)
    polygon: [
      [36, 28.5], [42, 26], [42, 45], [38, 55], [35, 62], [25, 62],
      [20, 60], [17, 55], [15, 50], [12, 42], [28, 32], [31, 34], [34, 34]
    ]
  },
  {
    id: 'pacific',
    name: 'Indo-Pacific',
    description: 'Taiwan Strait / South China Sea',
    center: [125, 20],
    bounds: { west: 95, east: 147, north: 45, south: -10 },
    scale: 3,
    // Polygon covering China coast, Taiwan, Philippines, Vietnam, Korea, all of Japan including Hokkaido
    polygon: [
      [46, 100], [46, 145], [42, 148], [30, 148], [10, 140],
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
      // North Africa (West to East): Morocco -> Egypt
      [36, -6], [37, 3], [37, 10], [33, 11], [32, 25], [31, 34],
      // East Coast (North to South): Red Sea -> Horn -> South Africa
      [15, 40], [12, 43], [12, 51], [0, 42], [-10, 40], [-25, 33], [-30, 31], [-35, 20],
      // West Coast (South to North): South Africa -> Namibia -> West Africa -> Morocco
      [-34, 18], [-28, 16], [-22, 14], [-15, 12], [4, 9], [4, -8], [12, -17], [20, -17], [28, -13], [36, -6]
    ]
  },
  {
    id: 'americas',
    name: 'Americas',
    description: 'Western Hemisphere',
    center: [-80, 15],
    bounds: { west: -150, east: -34, north: 60, south: -55 },
    scale: 2,
    // Polygon covering North/Central/South America including Brazil, Caribbean (Puerto Rico/DR), and Bahamas
    polygon: [
      [60, -130], [55, -55], [50, -50], [30, -70], [25, -70], [20, -60], [18, -60], [15, -55],
      [5, -35], [-5, -35], [-25, -35], [-35, -40], [-55, -70], [-55, -80], [-40, -75],
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
  // Ukraine - ISW data
  {
    conflictId: 'ukraine',
    name: 'Eastern Front',
    coords: [
      [37.0, 47.2], [37.5, 47.8], [38.0, 48.2], [38.2, 48.8], [37.8, 49.2]
    ],
    type: 'active',
    description: 'Donbas frontline - active Russian offensive operations'
  },
  {
    conflictId: 'ukraine',
    name: 'Southern Front',
    coords: [
      [35.0, 46.8], [35.5, 47.0], [36.2, 47.1], [37.0, 47.2]
    ],
    type: 'fortified',
    description: 'Zaporizhzhia-Kherson axis - fortified defensive positions'
  },

  // Sudan - SAF vs RSF (Jan 2026)
  // RSF controls Darfur (west), SAF controls east, Kordofan is contested
  {
    conflictId: 'sudan',
    name: 'Kordofan Front',
    coords: [
      [27.5, 11.5], [29.0, 12.0], [30.5, 12.5], [31.5, 13.0], [32.0, 13.5]
    ],
    type: 'active',
    description: 'SAF-RSF contested territory - North/South/West Kordofan'
  },
  {
    conflictId: 'sudan',
    name: 'Darfur Line',
    coords: [
      [24.0, 12.0], [25.0, 13.5], [26.0, 14.5], [27.0, 15.5]
    ],
    type: 'fortified',
    description: 'RSF-controlled Darfur region boundary'
  },

  // Myanmar - Junta vs Ethnic Armed Groups & PDF (Jan 2026)
  // AA controls Rakhine, MNDAA in Shan, PDF widespread
  {
    conflictId: 'myanmar',
    name: 'Rakhine-Chin Front',
    coords: [
      [92.5, 20.0], [93.0, 21.0], [93.5, 22.0], [94.0, 23.0]
    ],
    type: 'active',
    description: 'Arakan Army territorial control - Western Myanmar'
  },
  {
    conflictId: 'myanmar',
    name: 'Northern Shan Front',
    coords: [
      [97.5, 23.0], [98.0, 23.5], [98.5, 24.0], [99.0, 24.5], [99.5, 25.0]
    ],
    type: 'active',
    description: 'MNDAA/TNLA operations - Shan State northern corridor'
  },
  {
    conflictId: 'myanmar',
    name: 'Central Myanmar',
    coords: [
      [95.0, 19.5], [95.5, 20.0], [96.0, 21.0], [96.5, 21.5]
    ],
    type: 'active',
    description: 'PDF resistance zones - Sagaing/Magway regions'
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

// Undersea cables - critical communications infrastructure
// Major transoceanic fiber optic cables
export const UNDERSEA_CABLES = [
  {
    id: 'seamewe3',
    name: 'SEA-ME-WE 3',
    coords: [
      [103.85, 1.29],    // Singapore
      [100.50, 13.75],   // Thailand
      [88.35, 22.57],    // Bangladesh
      [72.88, 19.07],    // India (Mumbai)
      [58.38, 23.61],    // Oman
      [39.23, 21.49],    // Saudi Arabia (Jeddah)
      [32.90, 29.98],    // Egypt (Suez)
      [25.05, 35.33],    // Crete
      [23.73, 37.98],    // Greece
      [12.50, 41.90],    // Italy (Rome)
      [-5.35, 36.14],    // Spain
      [-9.15, 38.72],    // Portugal
      [-0.13, 51.51]     // UK (London)
    ],
    capacity: '1.92 Tbps',
    length: '39,000 km',
    status: 'active'
  },
  {
    id: 'flag_ea',
    name: 'FLAG Europe-Asia',
    coords: [
      [114.17, 22.28],   // Hong Kong
      [121.05, 14.60],   // Philippines
      [103.85, 1.29],    // Singapore
      [80.27, 13.09],    // India (Chennai)
      [72.88, 19.07],    // India (Mumbai)
      [58.38, 23.61],    // Oman
      [51.52, 25.28],    // Qatar
      [48.50, 29.37],    // Kuwait
      [44.40, 33.31],    // Iraq
      [32.90, 29.98],    // Egypt
      [-0.13, 51.51]     // UK
    ],
    capacity: '5.12 Tbps',
    length: '28,000 km',
    status: 'active'
  },
  {
    id: 'tata_tgn',
    name: 'TATA TGN-Atlantic',
    coords: [
      [-0.13, 51.51],    // UK
      [-6.26, 53.35],    // Ireland
      [-52.71, 47.56],   // Canada (Newfoundland)
      [-73.57, 45.50],   // Canada (Montreal)
      [-74.01, 40.71]    // USA (New York)
    ],
    capacity: '5.12 Tbps',
    length: '15,000 km',
    status: 'active'
  },
  {
    id: 'pacific_light',
    name: 'Pacific Light Cable',
    coords: [
      [114.17, 22.28],   // Hong Kong
      [121.05, 14.60],   // Philippines
      [144.96, 13.48],   // Guam
      [151.21, -33.87],  // Australia (Sydney)
      [-118.24, 34.05]   // USA (Los Angeles)
    ],
    capacity: '144 Tbps',
    length: '12,800 km',
    status: 'active'
  },
  {
    id: 'unity',
    name: 'UNITY',
    coords: [
      [139.69, 35.68],   // Japan (Tokyo)
      [144.96, 13.48],   // Guam
      [-118.24, 34.05]   // USA (Los Angeles)
    ],
    capacity: '7.68 Tbps',
    length: '9,620 km',
    status: 'active'
  },
  {
    id: 'marea',
    name: 'MAREA',
    coords: [
      [-8.62, 41.14],    // Spain (Bilbao)
      [-9.15, 38.72],    // Portugal
      [-38.50, 36.00],   // Mid-Atlantic
      [-77.03, 38.90]    // USA (Virginia Beach)
    ],
    capacity: '200 Tbps',
    length: '6,600 km',
    status: 'active',
    owner: 'Microsoft/Facebook/Telxius'
  }
];
