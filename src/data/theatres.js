// Theatre regions with polygon coordinates for irregular shapes
export const THEATRES = [
  {
    id: 'middle_east',
    name: 'Middle East',
    description: 'Iran Revolution Monitoring',
    hoverDescription: 'Ongoing protests and civil unrest across Iran. Regime crackdown on demonstrators. Monitoring live situation via social media, protests, and regional impacts.',
    center: [45, 30],
    bounds: { west: 26, east: 65, north: 42, south: 12 },
    scale: 4,
    color: '#ff7700', // Orange for active monitoring
    glowing: true, // Enable pulsing glow effect
    priority: 'high', // High priority theater
    // Polygon covering Turkey, Syria, Iraq, Iran, Gulf states, Oman, Israel (excludes Rhodes)
    polygon: [
      [36, 28.5], [42, 26], [42, 45], [38, 55], [35, 62], [25, 62],
      [20, 60], [17, 55], [15, 50], [12, 42], [28, 32], [31, 34], [34, 34]
    ]
  },
  {
    id: 'europe',
    name: 'Eastern Europe',
    description: 'Ukraine / Russia Conflict Zone',
    hoverDescription: 'Active conflict between Russia and Ukraine. Monitoring frontline movements, drone strikes, and regional security developments.',
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
    id: 'pacific',
    name: 'Indo-Pacific',
    description: 'Taiwan Strait / South China Sea',
    hoverDescription: 'Heightened tensions over Taiwan sovereignty. Monitoring PLA exercises, ADIZ incursions, and regional security dynamics in the Taiwan Strait.',
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
    hoverDescription: 'Sudan civil war (SAF vs RSF), Myanmar resistance, and Sahel instability. Monitoring humanitarian crises, territorial control, and Wagner Group activity.',
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
    hoverDescription: 'Monitoring US political developments, Latin American instability, and Western Hemisphere security issues including Venezuela and migration patterns.',
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
    id: 'iran_protests',
    name: 'Iran Protests',
    subtext: 'Revolutionary Activity',
    lat: 35.7,
    lon: 51.4,
    type: 'protest', // Special type for protest markers
    keywords: ['iran', 'protest', 'revolution', 'demonstration', 'uprising', 'mahsa amini', 'woman life freedom'],
    description: 'Ongoing civil unrest and protests across Iran. Monitoring demonstrations, regime response, and revolutionary activity via social media and ground reports.',
    agencies: ['Social Media Intel', 'Ground Reports', 'Open Source'],
    status: 'Active protests nationwide',
    level: 'critical',
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
  // =====================================================
  // US/NATO BASES IN EUROPE (Comprehensive)
  // =====================================================
  
  // GERMANY (Largest US presence in Europe)
  { id: 'ramstein', name: 'Ramstein AB (USAFE HQ)', lat: 49.4369, lon: 7.6003, type: 'us-nato', country: 'Germany' },
  { id: 'spangdahlem', name: 'Spangdahlem AB', lat: 49.9726, lon: 6.6925, type: 'us-nato', country: 'Germany' },
  { id: 'grafenwoehr', name: 'Grafenwöhr Training Area', lat: 49.6983, lon: 11.9400, type: 'us-nato', country: 'Germany' },
  { id: 'landstuhl', name: 'Landstuhl Medical Center', lat: 49.4069, lon: 7.5700, type: 'us-nato', country: 'Germany' },
  { id: 'ansbach', name: 'Ansbach (Katterbach)', lat: 49.2953, lon: 10.5614, type: 'us-nato', country: 'Germany' },
  { id: 'baumholder', name: 'Baumholder (Smith Barracks)', lat: 49.6586, lon: 7.3364, type: 'us-nato', country: 'Germany' },
  { id: 'hohenfels', name: 'Hohenfels Training Area', lat: 49.2167, lon: 11.8333, type: 'us-nato', country: 'Germany' },
  { id: 'vilseck', name: 'Vilseck (Rose Barracks)', lat: 49.6167, lon: 11.8000, type: 'us-nato', country: 'Germany' },
  { id: 'wiesbaden', name: 'Wiesbaden (Clay Kaserne)', lat: 50.0497, lon: 8.2603, type: 'us-nato', country: 'Germany' },
  { id: 'stuttgart', name: 'Stuttgart (EUCOM HQ)', lat: 48.6911, lon: 9.1069, type: 'us-nato', country: 'Germany' },
  { id: 'kaiserslautern', name: 'Kaiserslautern (Kleber)', lat: 49.4331, lon: 7.7436, type: 'us-nato', country: 'Germany' },
  
  // ITALY
  { id: 'aviano', name: 'Aviano AB', lat: 46.0319, lon: 12.5967, type: 'us-nato', country: 'Italy' },
  { id: 'naples', name: 'NSA Naples (6th Fleet HQ)', lat: 40.8500, lon: 14.2833, type: 'us-nato', country: 'Italy' },
  { id: 'sigonella', name: 'NAS Sigonella', lat: 37.4017, lon: 14.9222, type: 'us-nato', country: 'Italy' },
  { id: 'camp_darby', name: 'Camp Darby', lat: 43.6833, lon: 10.3333, type: 'us-nato', country: 'Italy' },
  { id: 'vicenza', name: 'Vicenza (Caserma Ederle)', lat: 45.5475, lon: 11.5361, type: 'us-nato', country: 'Italy' },
  { id: 'gaeta', name: 'Gaeta Naval Base', lat: 41.2167, lon: 13.5500, type: 'us-nato', country: 'Italy' },
  
  // UNITED KINGDOM (All major US/RAF joint facilities)
  { id: 'lakenheath', name: 'RAF Lakenheath (48th FW, F-35s)', lat: 52.4093, lon: 0.5608, type: 'us-nato', country: 'UK' },
  { id: 'mildenhall', name: 'RAF Mildenhall (100th ARW)', lat: 52.3617, lon: 0.4864, type: 'us-nato', country: 'UK' },
  { id: 'fairford', name: 'RAF Fairford (B-52s, B-2s)', lat: 51.6822, lon: -1.7900, type: 'us-nato', country: 'UK' },
  { id: 'croughton', name: 'RAF Croughton (Comm Hub)', lat: 51.9997, lon: -1.2064, type: 'us-nato', country: 'UK' },
  { id: 'menwith_hill', name: 'Menwith Hill (NSA/GCHQ)', lat: 54.0000, lon: -1.6900, type: 'us-nato', country: 'UK' },
  { id: 'fylingdales', name: 'RAF Fylingdales (BMD Radar)', lat: 54.3617, lon: -0.6708, type: 'us-nato', country: 'UK' },
  { id: 'alconbury', name: 'RAF Alconbury', lat: 52.3694, lon: -0.2117, type: 'us-nato', country: 'UK' },
  { id: 'molesworth', name: 'RAF Molesworth (JIOCEUR)', lat: 52.3900, lon: -0.3533, type: 'us-nato', country: 'UK' },
  { id: 'welford', name: 'RAF Welford (Ammo Depot)', lat: 51.4403, lon: -1.4478, type: 'us-nato', country: 'UK' },
  
  // TURKEY
  { id: 'incirlik', name: 'Incirlik AB', lat: 37.0017, lon: 35.4258, type: 'us-nato', country: 'Turkey' },
  { id: 'izmir', name: 'Izmir Air Station', lat: 38.4237, lon: 27.1428, type: 'us-nato', country: 'Turkey' },
  { id: 'kurecik', name: 'Kürecik (AN/TPY-2 Radar)', lat: 38.4500, lon: 37.8167, type: 'us-nato', country: 'Turkey' },
  
  // POLAND (NATO Eastern Flank)
  { id: 'lask', name: 'Łask AB', lat: 51.5517, lon: 19.1792, type: 'us-nato', country: 'Poland' },
  { id: 'powidz', name: 'Powidz AB', lat: 52.3794, lon: 17.8539, type: 'us-nato', country: 'Poland' },
  { id: 'redzikowo', name: 'Redzikowo (Aegis Ashore)', lat: 54.4781, lon: 17.1028, type: 'us-nato', country: 'Poland' },
  { id: 'poznan', name: 'Poznań (Camp Kosciuszko)', lat: 52.4064, lon: 16.9252, type: 'us-nato', country: 'Poland' },
  { id: 'drawsko', name: 'Drawsko Pomorskie', lat: 53.5167, lon: 15.8167, type: 'us-nato', country: 'Poland' },
  
  // ROMANIA
  { id: 'deveselu', name: 'Deveselu (Aegis Ashore)', lat: 43.7667, lon: 24.4167, type: 'us-nato', country: 'Romania' },
  { id: 'mihail_kogalniceanu', name: 'Mihail Kogălniceanu AB', lat: 44.3617, lon: 28.4372, type: 'us-nato', country: 'Romania' },
  { id: 'campia_turzii', name: 'Câmpia Turzii AB', lat: 46.5167, lon: 23.8833, type: 'us-nato', country: 'Romania' },
  
  // BALTIC STATES
  { id: 'amari', name: 'Ämari AB', lat: 59.2603, lon: 24.2086, type: 'us-nato', country: 'Estonia' },
  { id: 'tapa', name: 'Tapa Army Base', lat: 59.2639, lon: 25.9583, type: 'us-nato', country: 'Estonia' },
  { id: 'siauliai', name: 'Šiauliai AB (Baltic Air Policing)', lat: 55.8939, lon: 23.3950, type: 'us-nato', country: 'Lithuania' },
  { id: 'rukla', name: 'Rukla (eFP Battlegroup)', lat: 55.1167, lon: 24.2000, type: 'us-nato', country: 'Lithuania' },
  { id: 'lielvarde', name: 'Lielvārde AB', lat: 56.7678, lon: 24.8075, type: 'us-nato', country: 'Latvia' },
  { id: 'adazi', name: 'Ādaži Military Base', lat: 57.0833, lon: 24.3833, type: 'us-nato', country: 'Latvia' },
  
  // NORWAY
  { id: 'rygge', name: 'Rygge Air Station', lat: 59.3783, lon: 10.7864, type: 'us-nato', country: 'Norway' },
  { id: 'orland', name: 'Ørland Air Base', lat: 63.6989, lon: 9.6044, type: 'us-nato', country: 'Norway' },
  { id: 'evenes', name: 'Evenes Air Station', lat: 68.4917, lon: 16.6778, type: 'us-nato', country: 'Norway' },
  { id: 'bodo', name: 'Bodø Main Air Station', lat: 67.2692, lon: 14.3653, type: 'us-nato', country: 'Norway' },
  { id: 'vardoe', name: 'Vardø (Globus II Radar)', lat: 70.3367, lon: 31.0972, type: 'us-nato', country: 'Norway' },
  
  // SPAIN (All US facilities)
  { id: 'rota', name: 'Naval Station Rota (BMD Destroyers)', lat: 36.6442, lon: -6.3497, type: 'us-nato', country: 'Spain' },
  { id: 'moron', name: 'Morón AB (SPMAGTF-CR)', lat: 37.1742, lon: -5.6158, type: 'us-nato', country: 'Spain' },
  { id: 'zaragoza', name: 'Zaragoza AB (Training)', lat: 41.6661, lon: -1.0419, type: 'us-nato', country: 'Spain' },
  
  // FRANCE - Note: No permanent US bases since 1966
  // US forces use French facilities for exercises and transit only
  
  // GREECE
  { id: 'souda_bay', name: 'NSA Souda Bay', lat: 35.5314, lon: 24.1183, type: 'us-nato', country: 'Greece' },
  { id: 'larissa', name: 'Larissa AB', lat: 39.6500, lon: 22.4333, type: 'us-nato', country: 'Greece' },
  { id: 'alexandroupoli', name: 'Alexandroupoli Port', lat: 40.8500, lon: 25.8833, type: 'us-nato', country: 'Greece' },
  
  // BELGIUM
  { id: 'kleine_brogel', name: 'Kleine Brogel AB (B61)', lat: 51.1681, lon: 5.4700, type: 'us-nato', country: 'Belgium' },
  { id: 'shape', name: 'SHAPE (NATO Military HQ)', lat: 50.5014, lon: 3.9667, type: 'us-nato', country: 'Belgium' },
  
  // NETHERLANDS
  { id: 'volkel', name: 'Volkel AB (B61)', lat: 51.6567, lon: 5.7083, type: 'us-nato', country: 'Netherlands' },
  
  // ICELAND
  { id: 'keflavik', name: 'Keflavík (NASKEF)', lat: 63.9850, lon: -22.6056, type: 'us-nato', country: 'Iceland' },
  
  // PORTUGAL
  { id: 'lajes', name: 'Lajes Field (Azores)', lat: 38.7617, lon: -27.0906, type: 'us-nato', country: 'Portugal' },
  
  // HUNGARY
  { id: 'papa', name: 'Pápa Air Base', lat: 47.3633, lon: 17.5008, type: 'us-nato', country: 'Hungary' },
  
  // BULGARIA
  { id: 'bezmer', name: 'Bezmer AB', lat: 42.4500, lon: 26.3500, type: 'us-nato', country: 'Bulgaria' },
  { id: 'novo_selo', name: 'Novo Selo Range', lat: 42.0333, lon: 26.1833, type: 'us-nato', country: 'Bulgaria' },
  
  // CZECH REPUBLIC
  { id: 'namest', name: 'Náměšť nad Oslavou', lat: 49.1658, lon: 16.1189, type: 'us-nato', country: 'Czech Republic' },
  
  // SLOVAKIA
  { id: 'sliac', name: 'Sliač AB', lat: 48.6381, lon: 19.1344, type: 'us-nato', country: 'Slovakia' },
  
  // =====================================================
  // US/NATO BASES - MIDDLE EAST
  // =====================================================
  { id: 'bahrain', name: 'NSA Bahrain (5th Fleet)', lat: 26.2285, lon: 50.6501, type: 'us-nato', country: 'Bahrain' },
  { id: 'qatar', name: 'Al Udeid AB (CENTCOM FWD)', lat: 25.1175, lon: 51.3150, type: 'us-nato', country: 'Qatar' },
  { id: 'kuwait', name: 'Camp Arifjan', lat: 29.0833, lon: 48.1000, type: 'us-nato', country: 'Kuwait' },
  { id: 'ali_al_salem', name: 'Ali Al Salem AB', lat: 29.3469, lon: 47.5208, type: 'us-nato', country: 'Kuwait' },
  { id: 'prince_sultan', name: 'Prince Sultan AB (Saudi)', lat: 24.0625, lon: 47.5800, type: 'us-nato', country: 'Saudi Arabia' },
  { id: 'muwaffaq', name: 'Muwaffaq Salti AB (Jordan)', lat: 32.3564, lon: 36.7822, type: 'us-nato', country: 'Jordan' },
  { id: 'uae_dhafra', name: 'Al Dhafra AB', lat: 24.2483, lon: 54.5472, type: 'us-nato', country: 'UAE' },
  
  // =====================================================
  // US/NATO BASES - PACIFIC
  // =====================================================
  { id: 'guam', name: 'Andersen AFB', lat: 13.5840, lon: 144.9305, type: 'us-nato', country: 'Guam' },
  { id: 'guam_naval', name: 'Naval Base Guam', lat: 13.4443, lon: 144.6536, type: 'us-nato', country: 'Guam' },
  { id: 'okinawa', name: 'Kadena AB', lat: 26.3516, lon: 127.7695, type: 'us-nato', country: 'Japan' },
  { id: 'futenma', name: 'MCAS Futenma', lat: 26.2742, lon: 127.7567, type: 'us-nato', country: 'Japan' },
  { id: 'yokosuka', name: 'Yokosuka Naval Base (7th Fleet)', lat: 35.2833, lon: 139.6667, type: 'us-nato', country: 'Japan' },
  { id: 'yokota', name: 'Yokota AB', lat: 35.7483, lon: 139.3486, type: 'us-nato', country: 'Japan' },
  { id: 'misawa', name: 'Misawa AB', lat: 40.7033, lon: 141.3686, type: 'us-nato', country: 'Japan' },
  { id: 'sasebo', name: 'Sasebo Naval Base', lat: 33.1597, lon: 129.7231, type: 'us-nato', country: 'Japan' },
  { id: 'iwakuni', name: 'MCAS Iwakuni', lat: 34.1464, lon: 132.2356, type: 'us-nato', country: 'Japan' },
  { id: 'atsugi', name: 'NAF Atsugi', lat: 35.4547, lon: 139.4497, type: 'us-nato', country: 'Japan' },
  { id: 'osan', name: 'Osan AB', lat: 37.0906, lon: 127.0294, type: 'us-nato', country: 'South Korea' },
  { id: 'kunsan', name: 'Kunsan AB', lat: 35.9039, lon: 126.6158, type: 'us-nato', country: 'South Korea' },
  { id: 'camp_humphreys', name: 'Camp Humphreys (USFK HQ)', lat: 36.9628, lon: 127.0311, type: 'us-nato', country: 'South Korea' },
  
  // =====================================================
  // US/NATO BASES - INDIAN OCEAN & AFRICA
  // =====================================================
  { id: 'diego_garcia', name: 'Diego Garcia', lat: -7.3195, lon: 72.4229, type: 'us-nato', country: 'BIOT' },
  { id: 'djibouti_us', name: 'Camp Lemonnier', lat: 11.5461, lon: 43.1456, type: 'us-nato', country: 'Djibouti' },
  
  // =====================================================
  // RUSSIAN MILITARY BASES (Comprehensive)
  // =====================================================
  
  // KALININGRAD OBLAST (Strategic Enclave in Europe)
  { id: 'kaliningrad', name: 'Kaliningrad (Baltic Fleet HQ)', lat: 54.7104, lon: 20.4522, type: 'russia', country: 'Russia' },
  { id: 'baltiysk', name: 'Baltiysk Naval Base', lat: 54.6525, lon: 19.9039, type: 'russia', country: 'Russia' },
  { id: 'chernyakhovsk', name: 'Chernyakhovsk AB (Iskander)', lat: 54.6036, lon: 21.8106, type: 'russia', country: 'Russia' },
  { id: 'donskoye', name: 'Donskoye AB', lat: 54.4597, lon: 20.1333, type: 'russia', country: 'Russia' },
  
  // CRIMEA (Occupied Ukrainian Territory)
  { id: 'sevastopol', name: 'Sevastopol (Black Sea Fleet HQ)', lat: 44.6166, lon: 33.5254, type: 'russia', country: 'Crimea' },
  { id: 'belbek', name: 'Belbek AB', lat: 44.6881, lon: 33.5775, type: 'russia', country: 'Crimea' },
  { id: 'saki', name: 'Saki AB', lat: 45.0931, lon: 33.5917, type: 'russia', country: 'Crimea' },
  { id: 'dzhankoy', name: 'Dzhankoy AB', lat: 45.7006, lon: 34.3931, type: 'russia', country: 'Crimea' },
  { id: 'kerch', name: 'Kerch Naval Base', lat: 45.3531, lon: 36.4753, type: 'russia', country: 'Crimea' },
  { id: 'feodosia', name: 'Feodosia (979th Naval Test)', lat: 45.0489, lon: 35.3792, type: 'russia', country: 'Crimea' },
  
  // WESTERN MILITARY DISTRICT
  { id: 'moscow_hq', name: 'Moscow (General Staff)', lat: 55.7558, lon: 37.6173, type: 'russia', country: 'Russia' },
  { id: 'saint_petersburg', name: 'St. Petersburg (Leningrad VO)', lat: 59.9311, lon: 30.3609, type: 'russia', country: 'Russia' },
  { id: 'pskov', name: 'Pskov (76th Guards VDV)', lat: 57.8136, lon: 28.3496, type: 'russia', country: 'Russia' },
  { id: 'kursk_ab', name: 'Kursk AB', lat: 51.7506, lon: 36.2956, type: 'russia', country: 'Russia' },
  { id: 'voronezh_ab', name: 'Voronezh AB', lat: 51.6722, lon: 39.1844, type: 'russia', country: 'Russia' },
  { id: 'smolensk', name: 'Smolensk (20th Guards Army)', lat: 54.7826, lon: 32.0453, type: 'russia', country: 'Russia' },
  { id: 'tver', name: 'Tver AB (Migalovo)', lat: 56.8244, lon: 35.7578, type: 'russia', country: 'Russia' },
  { id: 'kubinka', name: 'Kubinka AB', lat: 55.6000, lon: 36.6500, type: 'russia', country: 'Russia' },
  { id: 'chkalovsky', name: 'Chkalovsky AB', lat: 55.8783, lon: 38.0617, type: 'russia', country: 'Russia' },
  
  // SOUTHERN MILITARY DISTRICT
  { id: 'rostov', name: 'Rostov (Southern MD HQ)', lat: 47.2357, lon: 39.7015, type: 'russia', country: 'Russia' },
  { id: 'krasnodar', name: 'Krasnodar AB', lat: 45.0328, lon: 39.1703, type: 'russia', country: 'Russia' },
  { id: 'morozovsk', name: 'Morozovsk AB (Tu-22M3)', lat: 48.3539, lon: 41.7908, type: 'russia', country: 'Russia' },
  { id: 'novorossiysk', name: 'Novorossiysk Naval Base', lat: 44.7167, lon: 37.7667, type: 'russia', country: 'Russia' },
  { id: 'volgograd', name: 'Volgograd (Marinovka AB)', lat: 48.7000, lon: 44.5167, type: 'russia', country: 'Russia' },
  { id: 'astrakhan', name: 'Astrakhan (Caspian Flotilla)', lat: 46.3486, lon: 48.0336, type: 'russia', country: 'Russia' },
  { id: 'budyonnovsk', name: 'Budyonnovsk AB', lat: 44.7833, lon: 44.1667, type: 'russia', country: 'Russia' },
  
  // CENTRAL MILITARY DISTRICT
  { id: 'engels', name: 'Engels AB (Tu-160/Tu-95)', lat: 51.4833, lon: 46.2000, type: 'russia', country: 'Russia' },
  { id: 'saratov', name: 'Saratov AB', lat: 51.5650, lon: 45.9833, type: 'russia', country: 'Russia' },
  { id: 'orenburg', name: 'Orenburg (Dombarovsky ICBM)', lat: 51.0728, lon: 59.6253, type: 'russia', country: 'Russia' },
  { id: 'chelyabinsk', name: 'Chelyabinsk (Shagol AB)', lat: 55.2167, lon: 61.3000, type: 'russia', country: 'Russia' },
  { id: 'yekaterinburg', name: 'Yekaterinburg (Koltsovo AB)', lat: 56.7500, lon: 60.8000, type: 'russia', country: 'Russia' },
  
  // EASTERN MILITARY DISTRICT
  { id: 'vladivostok', name: 'Vladivostok (Pacific Fleet HQ)', lat: 43.1056, lon: 131.8735, type: 'russia', country: 'Russia' },
  { id: 'petropavlovsk', name: 'Petropavlovsk-Kamchatsky (SSBN)', lat: 52.9855, lon: 158.6508, type: 'russia', country: 'Russia' },
  { id: 'khabarovsk', name: 'Khabarovsk (Eastern MD HQ)', lat: 48.4800, lon: 135.0833, type: 'russia', country: 'Russia' },
  { id: 'chita', name: 'Chita AB', lat: 52.0211, lon: 113.5200, type: 'russia', country: 'Russia' },
  { id: 'belogorsk', name: 'Belogorsk (Ukrainka AB)', lat: 50.9333, lon: 128.6667, type: 'russia', country: 'Russia' },
  { id: 'yelizovo', name: 'Yelizovo AB', lat: 53.1667, lon: 158.4167, type: 'russia', country: 'Russia' },
  { id: 'fokino', name: 'Fokino (Pacific Fleet Base)', lat: 42.9667, lon: 132.4167, type: 'russia', country: 'Russia' },
  { id: 'vilyuchinsk', name: 'Vilyuchinsk (Rybachiy SSBN)', lat: 52.9333, lon: 158.4000, type: 'russia', country: 'Russia' },
  
  // NORTHERN FLEET / ARCTIC
  { id: 'murmansk', name: 'Murmansk (Northern Fleet HQ)', lat: 68.9585, lon: 33.0827, type: 'russia', country: 'Russia' },
  { id: 'severomorsk', name: 'Severomorsk Naval Base', lat: 69.0733, lon: 33.4164, type: 'russia', country: 'Russia' },
  { id: 'olenya', name: 'Olenya AB (Tu-22M3)', lat: 68.1519, lon: 33.4631, type: 'russia', country: 'Russia' },
  { id: 'gadzhiyevo', name: 'Gadzhiyevo (SSBN Base)', lat: 69.2500, lon: 33.3333, type: 'russia', country: 'Russia' },
  { id: 'vidyayevo', name: 'Vidyayevo (Attack Sub Base)', lat: 69.3167, lon: 32.9833, type: 'russia', country: 'Russia' },
  { id: 'polyarny', name: 'Polyarny (Submarine Base)', lat: 69.1981, lon: 33.4592, type: 'russia', country: 'Russia' },
  { id: 'nagurskoye', name: 'Nagurskoye (Arctic Trefoil)', lat: 80.8167, lon: 47.6500, type: 'russia', country: 'Russia' },
  { id: 'temp', name: 'Temp (Kotelny Island)', lat: 76.0000, lon: 137.8667, type: 'russia', country: 'Russia' },
  { id: 'tiksi', name: 'Tiksi AB', lat: 71.6978, lon: 128.9033, type: 'russia', country: 'Russia' },
  { id: 'rogachevo', name: 'Rogachevo AB (Novaya Zemlya)', lat: 71.6167, lon: 52.4500, type: 'russia', country: 'Russia' },
  { id: 'anadyr', name: 'Anadyr-Ugolny AB', lat: 64.7333, lon: 177.5000, type: 'russia', country: 'Russia' },
  
  // STRATEGIC ROCKET FORCES (ICBM)
  { id: 'kozelsk', name: 'Kozelsk (RS-24 Yars)', lat: 54.0333, lon: 35.7667, type: 'russia', country: 'Russia' },
  { id: 'tatishchevo', name: 'Tatishchevo (RS-24 Yars)', lat: 51.6667, lon: 45.4333, type: 'russia', country: 'Russia' },
  { id: 'dombarovsky', name: 'Dombarovsky (RS-28 Sarmat)', lat: 50.7500, lon: 59.5167, type: 'russia', country: 'Russia' },
  { id: 'uzhur', name: 'Uzhur (RS-24 Yars)', lat: 55.3167, lon: 89.8167, type: 'russia', country: 'Russia' },
  { id: 'novosibirsk_rvsn', name: 'Novosibirsk (RS-24 Yars)', lat: 55.0083, lon: 82.9357, type: 'russia', country: 'Russia' },
  { id: 'teykovo', name: 'Teykovo (Road-Mobile ICBM)', lat: 56.8583, lon: 40.5667, type: 'russia', country: 'Russia' },
  { id: 'yoshkar_ola', name: 'Yoshkar-Ola (Road-Mobile ICBM)', lat: 56.6317, lon: 47.8808, type: 'russia', country: 'Russia' },
  
  // RUSSIAN FOREIGN BASES
  { id: 'tartus', name: 'Tartus Naval Facility (Syria)', lat: 34.8959, lon: 35.8867, type: 'russia', country: 'Syria' },
  { id: 'hmeimim', name: 'Hmeimim AB (Syria)', lat: 35.4008, lon: 35.9486, type: 'russia', country: 'Syria' },
  { id: 'gyumri', name: 'Gyumri (102nd Base, Armenia)', lat: 40.7942, lon: 43.8475, type: 'russia', country: 'Armenia' },
  { id: 'erebuni', name: 'Erebuni AB (Armenia)', lat: 40.1167, lon: 44.4667, type: 'russia', country: 'Armenia' },
  { id: 'kant', name: 'Kant AB (Kyrgyzstan)', lat: 42.8531, lon: 74.8464, type: 'russia', country: 'Kyrgyzstan' },
  { id: 'dushanbe', name: 'Dushanbe (201st Base, Tajikistan)', lat: 38.5598, lon: 68.7740, type: 'russia', country: 'Tajikistan' },
  { id: 'ayni', name: 'Ayni AB (Tajikistan)', lat: 38.9833, lon: 68.9167, type: 'russia', country: 'Tajikistan' },
  { id: 'transnistria', name: 'Tiraspol (Transnistria)', lat: 46.8403, lon: 29.6433, type: 'russia', country: 'Moldova' },
  { id: 'minsk_joint', name: 'Baranovichi (Belarus)', lat: 53.1000, lon: 26.0333, type: 'russia', country: 'Belarus' },
  { id: 'lida', name: 'Lida AB (Belarus)', lat: 53.8833, lon: 25.3167, type: 'russia', country: 'Belarus' },
  { id: 'abkhazia', name: 'Gudauta (Abkhazia)', lat: 43.1167, lon: 40.5833, type: 'russia', country: 'Georgia' },
  { id: 'south_ossetia', name: 'Tskhinvali (S. Ossetia)', lat: 42.2258, lon: 43.9689, type: 'russia', country: 'Georgia' },
  
  // RUSSIAN BASES IN AFRICA (Wagner Group / Africa Corps)
  { id: 'sudan_port', name: 'Port Sudan (Naval Facility)', lat: 19.6158, lon: 37.2164, type: 'russia', country: 'Sudan' },
  { id: 'libya_jufra', name: 'Al Jufra AB (Libya)', lat: 29.2083, lon: 16.0000, type: 'russia', country: 'Libya' },
  { id: 'libya_brak', name: 'Brak Al-Shati AB (Libya)', lat: 27.6833, lon: 14.3333, type: 'russia', country: 'Libya' },
  { id: 'car_bangui', name: 'Bangui (CAR)', lat: 4.3947, lon: 18.5582, type: 'russia', country: 'CAR' },
  { id: 'mali_bamako', name: 'Bamako (Mali)', lat: 12.6392, lon: -8.0029, type: 'russia', country: 'Mali' },
  { id: 'burkina_ouaga', name: 'Ouagadougou (Burkina Faso)', lat: 12.3714, lon: -1.5197, type: 'russia', country: 'Burkina Faso' },
  { id: 'niger_niamey', name: 'Niamey (Niger)', lat: 13.5137, lon: 2.1098, type: 'russia', country: 'Niger' },
  { id: 'mozambique', name: 'Mozambique (Wagner)', lat: -12.9833, lon: 40.3667, type: 'russia', country: 'Mozambique' },
  
  // =====================================================
  // ADDITIONAL US MIDDLE EAST BASES
  // =====================================================
  { id: 'iraq_erbil', name: 'Erbil (Iraq)', lat: 36.1912, lon: 44.0097, type: 'us-nato', country: 'Iraq' },
  { id: 'iraq_ain_asad', name: 'Ain al-Asad AB (Iraq)', lat: 33.7756, lon: 42.4392, type: 'us-nato', country: 'Iraq' },
  { id: 'iraq_harir', name: 'Harir AB (Iraq)', lat: 36.5369, lon: 44.4656, type: 'us-nato', country: 'Iraq' },
  { id: 'syria_tanf', name: 'Al-Tanf Garrison (Syria)', lat: 33.4736, lon: 38.6575, type: 'us-nato', country: 'Syria' },
  { id: 'syria_koniko', name: 'Conoco Gas Field (Syria)', lat: 35.1000, lon: 40.2500, type: 'us-nato', country: 'Syria' },
  { id: 'syria_rumailan', name: 'Rumailan AB (Syria)', lat: 36.8500, lon: 41.8000, type: 'us-nato', country: 'Syria' },
  { id: 'oman_masirah', name: 'Masirah Island (Oman)', lat: 20.6753, lon: 58.8969, type: 'us-nato', country: 'Oman' },
  { id: 'oman_thumrait', name: 'Thumrait AB (Oman)', lat: 17.6600, lon: 53.9300, type: 'us-nato', country: 'Oman' },
  { id: 'israel_nevatim', name: 'Nevatim AB (Israel)', lat: 31.2081, lon: 35.0122, type: 'us-nato', country: 'Israel' },
  
  // =====================================================
  // CHINESE BASES
  // =====================================================
  { id: 'djibouti_cn', name: 'PLA Support Base Djibouti', lat: 11.5886, lon: 43.0500, type: 'china', country: 'Djibouti' },
  { id: 'woody_island', name: 'Woody Island (Paracel)', lat: 16.8333, lon: 112.3333, type: 'china', country: 'SCS' },
  { id: 'fiery_cross', name: 'Fiery Cross Reef (Spratly)', lat: 9.5500, lon: 112.8900, type: 'china', country: 'SCS' },
  { id: 'mischief_reef', name: 'Mischief Reef (Spratly)', lat: 9.9000, lon: 115.5300, type: 'china', country: 'SCS' },
  { id: 'subi_reef', name: 'Subi Reef (Spratly)', lat: 10.9233, lon: 114.0833, type: 'china', country: 'SCS' },
  { id: 'ream', name: 'Ream Naval Base (Cambodia)', lat: 10.5117, lon: 103.6453, type: 'china', country: 'Cambodia' }
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
