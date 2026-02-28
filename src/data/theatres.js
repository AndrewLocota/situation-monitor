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
    id: 'iran',
    name: 'Iran',
    description: 'Iran / IRGC / Nuclear Program',
    center: [53, 32],
    bounds: { west: 44, east: 64, north: 40, south: 25 },
    scale: 5,
    polygon: [
      [39.8, 44.0], [39.4, 48.0], [38.5, 49.0], [37.5, 54.0], [37.3, 55.5],
      [37.0, 57.5], [35.5, 61.0], [33.5, 62.0], [31.5, 61.5], [29.0, 61.5],
      [27.0, 63.5], [25.5, 61.5], [26.0, 57.0], [26.5, 54.5], [27.5, 52.0],
      [29.5, 50.5], [30.0, 48.5], [31.0, 47.5], [32.0, 47.0], [33.5, 46.0],
      [35.0, 46.0], [36.0, 45.0], [37.5, 44.5], [38.5, 44.0]
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

// Conflict zones - Updated Feb 2026 with current data from public sources
// Intensity: high (active major combat), medium (ongoing conflict), watch (tensions/risk)
// Coords: [lon, lat] format — converted to [lat, lon] for Leaflet at render time
export const CONFLICT_ZONES = [
  {
    id: 'ukraine',
    name: 'Ukraine War',
    intensity: 'high',
    coords: [
      // Occupied oblasts + Crimea — detailed frontline + coastline trace (clockwise from NW)
      [36.0, 49.9],    // NW — Kupyansk frontline
      [36.6, 49.7],    // Kupyansk E outskirts
      [37.2, 49.5],    // Kreminna sector
      [37.8, 49.35],   // Svatove – Kreminna line
      [38.3, 49.15],   // Starobilsk
      [39.0, 49.05],   // NE Luhansk approaches
      [39.6, 49.0],    // Luhansk – Russian border
      [40.2, 48.6],    // E border (Milove)
      [40.0, 48.0],    // Dovzhansk
      [39.5, 47.6],    // S Luhansk – Shakhtarsk
      [38.8, 47.25],   // Volnovakha
      [38.2, 47.0],    // S Donetsk
      [37.55, 46.82],  // Mariupol
      [36.8, 46.6],    // Berdyansk
      [36.0, 46.35],   // W of Berdyansk coast
      [35.5, 46.15],   // Melitopol
      [34.95, 45.85],  // Chonhar crossing
      [35.3, 45.45],   // Arabat spit base
      [35.8, 45.35],   // Mid-Arabat
      [36.55, 45.38],  // Kerch approaches
      [36.65, 45.18],  // Kerch tip (Yenikale)
      [36.4, 44.88],   // Cape Takil
      [35.85, 44.62],  // Feodosia
      [35.1, 44.48],   // Sudak
      [34.35, 44.42],  // Alushta
      [33.85, 44.39],  // Yalta
      [33.5, 44.47],   // Balaklava
      [33.3, 44.58],   // Sevastopol (S bay)
      [32.72, 44.82],  // Cape Khersones
      [32.48, 45.05],  // Yevpatoria coast
      [32.7, 45.32],   // Saki area
      [33.05, 45.52],  // NW Crimea (Razdolnoe)
      [33.35, 45.72],  // Krasnoperekopsk
      [33.2, 46.02],   // Perekop isthmus – mainland
      [32.88, 46.32],  // Chaplynka
      [32.9, 46.62],   // W bank Dnipro (Oleshky)
      [33.3, 46.9],    // Kherson city area
      [33.65, 47.2],   // N Kherson oblast
      [34.2, 47.6],    // Zaporizhzhia NPP approaches
      [34.6, 48.0],    // Enerhodar sector
      [35.0, 48.4],    // N Zaporizhzhia
      [35.5, 49.0],    // approaching Dnipro city
      [35.8, 49.5],    // NW – back to frontline
    ],
    labelPos: { lat: 47.8, lon: 36.5 },
    startDate: 'Feb 24, 2022',
    parties: ['Russian Federation', 'Ukraine', 'NATO (materiel support)'],
    casualties: '700,000+ combined (est.)',
    displaced: '6.5M+ refugees, 4M+ IDP',
    description: 'Full-scale Russian invasion. Attritional warfare along 1,000km front. Russian advances in Donetsk, Ukrainian cross-border operations in Kursk. FPV drone warfare dominates.',
    keyEvents: ['Pokrovsk offensive', 'Kursk incursion', 'Crimea strikes', 'Energy infrastructure attacks', 'North Korean troops deployment'],
    keywords: ['ukraine', 'russia', 'zelensky', 'putin', 'donbas', 'crimea', 'bakhmut', 'kursk', 'kherson', 'zaporizhzhia', 'pokrovsk'],
    theatre: 'EASTERN_EUROPE'
  },
  {
    id: 'gaza',
    name: 'Gaza War',
    intensity: 'high',
    coords: [
      // Gaza Strip — precise coastal enclave outline
      [34.48, 31.60],   // N coast (Beit Lahia)
      [34.55, 31.58],   // NE coast
      [34.56, 31.55],   // Erez crossing
      [34.55, 31.50],   // E border – N Gaza
      [34.54, 31.45],   // E border – Bureij
      [34.52, 31.40],   // E border – Nuseirat
      [34.48, 31.34],   // E border – Deir el-Balah
      [34.42, 31.28],   // E border – Khan Younis
      [34.37, 31.23],   // SE – Rafah crossing
      [34.24, 31.22],   // S – Egypt border coast
      [34.22, 31.27],   // SW coast – Rafah beach
      [34.24, 31.33],   // W coast – S Khan Younis
      [34.28, 31.40],   // W coast – Deir el-Balah
      [34.32, 31.46],   // W coast – Wadi Gaza
      [34.36, 31.50],   // W coast – Gaza City S
      [34.42, 31.56],   // NW coast – Gaza City N
    ],
    labelPos: { lat: 31.4, lon: 34.38 },
    startDate: 'Oct 7, 2023',
    parties: ['Israel (IDF)', 'Hamas', 'Palestinian Islamic Jihad', 'Hezbollah (Lebanon front)'],
    casualties: '50,000+ Gaza, 1,500+ Israel',
    displaced: '2.3M displaced (90% of population)',
    description: 'Israeli military operation following Oct 7 attacks. Extensive urban destruction, severe humanitarian crisis. Regional escalation with Hezbollah, Houthis.',
    keyEvents: ['Oct 7 attacks', 'Ground invasion', 'Rafah operation', 'Lebanon front', 'Ceasefire negotiations', 'ICJ proceedings'],
    keywords: ['gaza', 'israel', 'hamas', 'idf', 'netanyahu', 'hostage', 'rafah', 'hezbollah', 'palestinian', 'khan younis'],
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'westbank',
    name: 'West Bank',
    intensity: 'medium',
    coords: [
      // West Bank territory — Green Line + Jordan River
      [35.15, 32.55],   // NW – Tulkarm / Green Line
      [35.30, 32.47],   // N – Jenin area
      [35.45, 32.38],   // NE – Bisan valley
      [35.55, 32.15],   // E – Jordan valley (N)
      [35.55, 31.85],   // E – Jordan valley (central)
      [35.52, 31.55],   // E – Jericho
      [35.48, 31.40],   // SE – Dead Sea N shore
      [35.40, 31.32],   // S – Bethlehem approaches
      [35.10, 31.38],   // SW – Hebron
      [34.95, 31.55],   // W – Green Line (S)
      [34.90, 31.80],   // W – Green Line (central)
      [34.92, 32.05],   // W – Modi'in area
      [34.95, 32.20],   // W – Green Line (Ramallah lat)
      [35.02, 32.40],   // NW – Qalqilya
    ],
    labelPos: { lat: 31.9, lon: 35.2 },
    startDate: '1967 (occupation); 2023 (escalation)',
    parties: ['Israel (IDF / settlers)', 'Palestinian Authority', 'Hamas / PIJ cells', 'Israeli settlers'],
    casualties: '1,000+ Palestinians killed (2023-present)',
    displaced: '250,000+ displaced by settler violence',
    description: 'Intensified Israeli military raids across West Bank since Oct 2023. Settler violence surging. Palestinian Authority losing control. Jenin, Tulkarm, Nablus major flashpoints.',
    keyEvents: ['Jenin camp raids', 'Tulkarm operations', 'Settler pogroms', 'PA governance crisis', 'Settlement expansion'],
    keywords: ['west bank', 'jenin', 'nablus', 'ramallah', 'hebron', 'settler', 'occupation', 'palestinian', 'idf raids'],
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'sudan',
    name: 'Sudan Civil War',
    intensity: 'high',
    coords: [
      // Darfur + Kordofan + Khartoum + Gezira — detailed warzone belt
      [22.5, 13.0],    // W Darfur – Chad border (El Geneina)
      [22.8, 14.5],    // W Darfur – Beida
      [23.5, 15.5],    // NW Darfur – Kulbus
      [25.3, 16.2],    // N Darfur – El Fasher
      [27.0, 16.5],    // N Darfur – Kutum approaches
      [28.5, 16.8],    // N Kordofan – Bara
      [30.0, 17.0],    // Nile bend – Merowe
      [31.5, 16.5],    // N of Khartoum – Shendi
      [32.6, 15.6],    // Khartoum / Omdurman
      [33.5, 15.5],    // E of Khartoum – Wad Medani
      [34.5, 15.2],    // Gezira – irrigation zone
      [35.5, 14.0],    // Gedaref
      [35.0, 12.5],    // Blue Nile – Damazin
      [34.0, 11.8],    // S Blue Nile
      [32.5, 11.2],    // S Kordofan – Kadugli
      [30.5, 10.5],    // S Kordofan – Abyei approaches
      [28.5, 10.0],    // S Darfur – Radom
      [26.0, 10.5],    // S Darfur – Nyala S
      [24.5, 11.5],    // W Darfur – CAR border
      [23.0, 12.5],    // W Darfur – Zalingei
    ],
    labelPos: { lat: 13.5, lon: 29.0 },
    startDate: 'Apr 15, 2023',
    parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)', 'Various militias'],
    casualties: '25,000+ killed (est.)',
    displaced: '12M+ displaced (world\'s largest displacement crisis)',
    description: 'Catastrophic civil war between SAF and RSF. Ethnic cleansing in Darfur. Famine conditions affecting millions. Both sides accused of war crimes.',
    keyEvents: ['Khartoum destruction', 'Darfur massacres', 'El Fasher siege', 'Famine declared', 'Port Sudan relocation'],
    keywords: ['sudan', 'khartoum', 'rsf', 'darfur', 'burhan', 'hemedti', 'sudanese', 'el fasher', 'famine'],
    theatre: 'AFRICA'
  },
  {
    id: 'myanmar',
    name: 'Myanmar Civil War',
    intensity: 'high',
    coords: [
      // Multi-front conflict — follows Myanmar borders more closely
      [92.18, 20.7],   // W — Sittwe (Rakhine capital)
      [92.6, 22.0],    // W — Rakhine N coast (Kyaukpyu)
      [93.2, 23.5],    // NW — Chin Hills (Paletwa)
      [93.8, 24.5],    // N — Chin / Sagaing
      [94.5, 25.8],    // N — Sagaing (Monywa approaches)
      [95.5, 26.8],    // N — Kachin S (Mogaung)
      [96.5, 27.5],    // NE — Myitkyina area
      [97.5, 26.5],    // NE — Kachin / China border
      [98.5, 25.0],    // E — N Shan (Lashio)
      [99.5, 23.5],    // E — E Shan (Kengtung)
      [99.0, 21.5],    // SE — Shan / Kayah border
      [98.6, 19.5],    // SE — Kayin (Myawaddy approaches)
      [98.5, 18.0],    // SE — Myawaddy / Thai border
      [97.8, 16.5],    // S — Kayin / Mon
      [97.2, 15.5],    // S — Tanintharyi N
      [96.2, 16.0],    // SW — Irrawaddy delta approaches
      [95.0, 16.2],    // SW — Bago / Irrawaddy
      [94.2, 17.0],    // W — Rakhine S coast (Gwa)
      [93.0, 18.5],    // W — Rakhine coast (Thandwe)
      [92.4, 19.5],    // W — Rakhine (Taungup)
    ],
    labelPos: { lat: 21.0, lon: 96.0 },
    startDate: 'Feb 1, 2021',
    parties: ['Military Junta (SAC/Tatmadaw)', 'Three Brotherhood Alliance', 'PDF/NUG', 'Ethnic Armed Organizations'],
    casualties: '60,000+ (est.)',
    displaced: '3.5M+ internally displaced',
    description: 'Junta losing control of border regions. Resistance forces control ~60% of territory. Economic collapse, conscription crisis. Multiple ethnic armies coordinating.',
    keyEvents: ['Operation 1027', 'Lashio capture', 'Myawaddy seizure', 'Rakhine offensive', 'Conscription law', 'Capital threats'],
    keywords: ['myanmar', 'burma', 'junta', 'arakan', 'karen', 'kachin', 'rohingya', 'shan', 'pdf', 'operation 1027'],
    theatre: 'SOUTHEAST_ASIA'
  },
  {
    id: 'drc',
    name: 'DRC Eastern Conflict',
    intensity: 'high',
    coords: [
      // Ituri + North Kivu + South Kivu — detailed lake-shore + border trace
      [27.2, 2.8],     // NW Ituri (Mambasa)
      [28.0, 3.0],     // N Ituri (Djugu)
      [29.0, 2.6],     // N — Bunia
      [30.2, 2.2],     // NE — Lake Albert NW shore
      [30.8, 1.7],     // NE — Lake Albert SE / Mahagi
      [30.5, 1.0],     // E — Rwenzori foothills
      [30.0, 0.3],     // E — Lake Edward N shore
      [29.6, -0.2],    // E — Virunga NP / Rutshuru
      [29.35, -1.1],   // E — Goma / Lake Kivu N
      [29.05, -1.7],   // E — Lake Kivu W shore (Kalehe)
      [28.85, -2.3],   // E — Bukavu / Lake Kivu S
      [29.0, -3.0],    // SE — Uvira
      [29.15, -3.5],   // SE — Fizi / L. Tanganyika shore
      [29.0, -4.2],    // S — Baraka
      [28.5, -4.8],    // S — S Kivu / Katanga border
      [27.5, -4.3],    // SW — Maniema / Katanga
      [26.5, -3.0],    // W — Maniema (Kasongo)
      [26.5, -1.5],    // W — Maniema (Lubutu)
      [27.0, 0.0],     // W — Ituri W border
      [27.2, 1.5],     // NW — N Ituri
    ],
    labelPos: { lat: -0.8, lon: 28.5 },
    startDate: '2022 (M23 resurgence)',
    parties: ['DRC Army (FARDC)', 'M23 (Rwanda-backed)', 'ADF', '100+ armed groups'],
    casualties: '10,000+ (recent), 6M+ (1996-present)',
    displaced: '7M+ internally displaced',
    description: 'M23 rebel advance in North Kivu with Rwandan military support. Goma under threat. Regional tensions with Rwanda. Deadliest ongoing conflict globally.',
    keyEvents: ['M23 resurgence', 'Goma siege', 'EAC force deployment', 'Rwanda tensions', 'Mass displacement'],
    keywords: ['drc', 'congo', 'm23', 'goma', 'rwanda', 'kivu', 'tshisekedi', 'kagame'],
    theatre: 'AFRICA'
  },
  {
    id: 'sahel',
    name: 'Sahel Insurgency',
    intensity: 'medium',
    coords: [
      // Mali + Burkina Faso + Niger insurgency belt — refined borders
      [-5.5, 14.5],    // W — Mali (Ségou)
      [-5.0, 16.0],    // NW — Mopti region
      [-4.0, 17.0],    // N — Timbuktu
      [-1.5, 18.0],    // N — Kidal approaches
      [1.0, 17.5],     // N — Niger / Algeria border
      [3.5, 17.0],     // N — Agadez S
      [5.5, 16.5],     // NE — Tahoua region
      [8.0, 15.5],     // E — Zinder approaches
      [10.5, 14.0],    // E — Diffa / Lake Chad basin
      [13.0, 13.5],    // E — Lake Chad (Boko Haram overlap)
      [10.0, 12.0],    // SE — N Nigeria border
      [6.5, 11.0],     // S — N Benin / Togo
      [3.0, 10.5],     // S — N Ghana / Ivory Coast border
      [0.0, 11.0],     // S — Ghana N tip
      [-2.5, 11.5],    // SW — Ivory Coast / Burkina border
      [-5.0, 12.5],    // W — SW Mali (Sikasso)
    ],
    labelPos: { lat: 14.5, lon: 2.0 },
    startDate: '2012 (escalated)',
    parties: ['JNIM (al-Qaeda)', 'ISGS (ISIS)', 'Military juntas', 'Wagner/Africa Corps'],
    casualties: '20,000+ (2023-present)',
    displaced: '4M+ displaced',
    description: 'Jihadist insurgency expanding despite military coups. Wagner/Russia presence. French forces expelled. Humanitarian crisis deepening.',
    keyEvents: ['Mali coup', 'Burkina coup', 'Niger coup', 'French withdrawal', 'Wagner deployment', 'Junta alliance'],
    keywords: ['sahel', 'mali', 'burkina', 'niger', 'jnim', 'isis', 'wagner', 'bamako', 'ouagadougou'],
    theatre: 'AFRICA'
  },
  {
    id: 'somalia',
    name: 'Somalia Insurgency',
    intensity: 'medium',
    coords: [
      // Al-Shabaab areas — central/southern Somalia
      [42.0, 5.0],     // NW — Beledweyne area
      [44.0, 5.5],     // N — Galgudud (Dhusamareb)
      [46.5, 5.0],     // NE — Mudug / Hobyo coast
      [48.0, 4.0],     // E — Puntland border
      [49.0, 2.5],     // E coast — Kismayo approaches
      [47.5, 1.0],     // SE — Kismayo
      [44.5, -0.5],    // S — Kenya border coast
      [41.5, 0.5],     // SW — Kenya border (Mandera)
      [41.0, 2.0],     // W — Gedo region
      [42.0, 3.5],     // W — Bay / Bakool
      [43.5, 4.5],     // W — Hiraan
    ],
    labelPos: { lat: 3.0, lon: 45.0 },
    startDate: '2006 (Al-Shabaab)',
    parties: ['Somali Federal Government', 'Al-Shabaab (al-Qaeda)', 'ATMIS/AU Forces', 'Clan militias'],
    casualties: '5,000+ killed per year',
    displaced: '4M+ displaced',
    description: 'Al-Shabaab controls vast rural areas of southern/central Somalia. Government and African Union forces hold major cities. Famine conditions recurring.',
    keyEvents: ['Military offensives', 'Drone strikes', 'ATMIS drawdown', 'Mogadishu bombings', 'Famine emergencies'],
    keywords: ['somalia', 'al-shabaab', 'mogadishu', 'kismayo', 'puntland', 'amisom', 'horn of africa'],
    theatre: 'AFRICA'
  },
  {
    id: 'syria',
    name: 'Syria Conflict',
    intensity: 'medium',
    coords: [
      // Multi-faction conflict — HTS northwest, SDF northeast, Turkish zones
      [35.8, 36.8],    // NW — Turkish border (Hatay)
      [36.2, 36.9],    // N — Afrin area
      [37.0, 37.0],    // N — Azaz / Jarablus (Turkish zone)
      [38.5, 37.0],    // NE — Kobani / Euphrates
      [40.0, 37.2],    // NE — Qamishli / Hasakah
      [42.3, 37.0],    // Far NE — Iraq border (Derik)
      [41.5, 35.5],    // E — Deir ez-Zor
      [40.5, 34.5],    // SE — Bukamal / Iraq border
      [38.5, 34.0],    // S — Palmyra area
      [36.5, 33.5],    // S — Damascus approaches
      [36.0, 33.2],    // SW — Daraa / Golan
      [35.8, 34.5],    // W — Homs
      [35.7, 35.5],    // W — Tartus coast
      [35.8, 36.0],    // NW — Latakia
    ],
    labelPos: { lat: 35.5, lon: 38.5 },
    startDate: '2011 (civil war)',
    parties: ['HTS / Interim Gov', 'SDF / Kurdish AANES', 'Turkish-backed SNA', 'Iranian proxies', 'ISIS remnants'],
    casualties: '600,000+ total',
    displaced: '6.8M refugees, 6.9M IDP',
    description: 'Multi-faction conflict with HTS controlling northwest, SDF holding northeast. Turkish military operations in north. ISIS cells active in desert. Reconstruction stalled.',
    keyEvents: ['HTS consolidation', 'Turkish operations', 'ISIS resurgence', 'SDF-Turkey clashes', 'Refugee crisis'],
    keywords: ['syria', 'damascus', 'hts', 'sdf', 'kurdish', 'idlib', 'aleppo', 'turkey', 'isis', 'assad'],
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'haiti',
    name: 'Haiti Crisis',
    intensity: 'medium',
    coords: [
      // Haiti — detailed coastline following major geographic features
      [-72.7, 19.95],   // N coast — Cap-Haïtien
      [-72.3, 19.95],   // N coast — Ouanaminthe
      [-72.0, 19.85],   // NE — Dominican border N
      [-71.65, 19.55],  // E border — central plateau
      [-71.7, 19.2],    // E border — Artibonite upper valley
      [-71.65, 18.7],   // E border — Étang Saumâtre
      [-71.75, 18.45],  // SE — Pedernales approaches
      [-72.3, 18.20],   // S — Les Cayes
      [-73.0, 18.05],   // S coast — Tiburon peninsula E
      [-73.8, 18.05],   // S coast — Tiburon peninsula W
      [-74.48, 18.10],  // SW tip — Dame Marie
      [-74.45, 18.45],  // W — Jérémie
      [-73.5, 18.55],   // W — Gonâve Bay (S shore)
      [-73.0, 18.8],    // W — Gonâve Bay (E)
      [-73.4, 18.95],   // NW — Gonâve island S
      [-73.7, 19.3],    // NW — Saint-Marc
      [-73.35, 19.45],  // N — Gonaïves
      [-73.0, 19.7],    // N — Tortuga channel
      [-72.8, 19.85],   // N coast — Port-de-Paix approaches
    ],
    labelPos: { lat: 19.0, lon: -72.8 },
    startDate: '2021 (state collapse)',
    parties: ['Gang coalitions (G9, Viv Ansanm)', 'Haitian National Police', 'MSS Kenya force'],
    casualties: '10,000+ (2023-present)',
    displaced: '700,000+ displaced',
    description: 'State collapse with gangs controlling 80% of Port-au-Prince. Kidnappings, sexual violence endemic. International intervention force struggling.',
    keyEvents: ['Presidential assassination', 'Gang alliance', 'Prison breaks', 'Kenya deployment', 'Cannibalism reports'],
    keywords: ['haiti', 'port-au-prince', 'gang', 'barbecue', 'kenya', 'caribbean', 'humanitarian'],
    theatre: 'AMERICAS'
  },
  {
    id: 'taiwan_strait',
    name: 'Taiwan Strait',
    intensity: 'watch',
    coords: [
      // Contested waters — follows strait and Taiwan W coast more closely
      [117.4, 25.6],   // NW — Fujian coast (Fuqing)
      [118.5, 26.1],   // N — Pingtan island area
      [119.8, 26.3],   // N — N strait entrance
      [121.5, 25.7],   // NE — Keelung approaches
      [122.0, 25.1],   // E — Taiwan NW coast (Hsinchu)
      [121.6, 24.2],   // E — Taichung area
      [120.8, 23.0],   // E — Chiayi / Tainan
      [120.3, 22.3],   // SE — Kaohsiung
      [119.5, 21.8],   // S — Bashi Channel approaches
      [118.0, 22.2],   // S — Dongsha Atoll area
      [116.5, 23.0],   // SW — Guangdong coast (Shantou)
      [117.0, 24.3],   // W — Fujian S coast (Zhangzhou)
    ],
    labelPos: { lat: 24.2, lon: 119.5 },
    startDate: 'Ongoing tensions',
    parties: ['China (PLA)', 'Taiwan (ROC)', 'United States'],
    casualties: 'N/A - no active combat',
    displaced: 'N/A',
    description: 'Escalating tensions with near-daily PLA incursions. Military exercises increasing in scale. US deterrence posture strengthening. Key global flashpoint.',
    keyEvents: ['Record ADIZ incursions', 'Joint Sword exercises', 'US arms sales', 'Blockade drills', 'Semiconductor concerns'],
    keywords: ['taiwan', 'china', 'strait', 'pla', 'taipei', 'tsmc', 'invasion', 'blockade'],
    theatre: 'EAST_ASIA'
  },
  {
    id: 'yemen',
    name: 'Yemen / Red Sea',
    intensity: 'medium',
    coords: [
      // Yemen — refined coastline and border trace
      [42.4, 16.5],    // NW — Midi (Red Sea coast)
      [42.6, 17.0],    // N — Red Sea coast N
      [43.3, 17.4],    // N — Sa'dah province
      [44.2, 17.8],    // N — Saudi border W
      [45.5, 18.2],    // N — Saudi border central (Sanaa N)
      [46.5, 18.5],    // N — Ma'rib N
      [48.0, 18.2],    // NE — Shabwah N
      [49.5, 18.0],    // NE — Hadramawt
      [51.0, 17.5],    // E — Al Mahra approaches
      [52.5, 17.0],    // E — Al Mahra
      [53.1, 16.6],    // Far E — Oman border coast
      [52.5, 15.5],    // SE coast — Nishtun
      [51.0, 14.5],    // SE coast — Sayhut
      [49.5, 13.8],    // S coast — Mukalla
      [47.5, 13.2],    // S coast — Ahwar
      [45.8, 13.0],    // S coast — Zinjibar
      [44.8, 12.65],   // S — Aden
      [43.8, 12.7],    // SW — Lahij
      [43.3, 12.55],   // SW — Bab el-Mandeb approach
      [43.0, 13.2],    // W — Mocha coast
      [43.1, 14.0],    // W — Taiz approaches
      [42.95, 14.8],   // W — Hodeidah
      [42.6, 15.6],    // W — Red Sea coast (Luhayyah)
    ],
    labelPos: { lat: 15.5, lon: 47.0 },
    startDate: '2014 (Houthi); 2023 (Red Sea)',
    parties: ['Houthis (Ansar Allah)', 'Saudi-led Coalition', 'US/UK Naval Forces', 'Presidential Leadership Council'],
    casualties: '150,000+ (civil war total)',
    displaced: '4.5M+ displaced',
    description: 'Civil war in stalemate. Houthi Red Sea attacks disrupting 15% of global trade. US/UK conducting strikes. Major shipping rerouting via Cape of Good Hope.',
    keyEvents: ['Red Sea attacks', 'US/UK airstrikes', 'Shipping crisis', 'Suez traffic collapse', 'Iran support'],
    keywords: ['yemen', 'houthi', 'red sea', 'shipping', 'saudi', 'aden', 'sanaa', 'bab el mandeb'],
    theatre: 'MIDDLE_EAST'
  },
  {
    id: 'lebanon',
    name: 'Lebanon/Israel Border',
    intensity: 'medium',
    coords: [
      // Southern Lebanon — Blue Line to Litani River (refined)
      [35.10, 33.47],  // NW coast — Litani mouth / Qasmiyeh
      [35.25, 33.50],  // N — Jezzine approaches
      [35.40, 33.52],  // N — Nabatiye
      [35.55, 33.48],  // NE — Marjayoun
      [35.72, 33.40],  // NE — Hasbaya
      [35.87, 33.30],  // E — Shebaa Farms
      [35.85, 33.15],  // SE — Golan Heights edge
      [35.68, 33.07],  // S — Metulla area
      [35.50, 33.05],  // S — Bint Jbeil
      [35.35, 33.05],  // S — Ayta ash-Shab
      [35.18, 33.06],  // SW — Naqoura / UNIFIL
      [35.10, 33.12],  // W coast — Tyre S
      [35.10, 33.28],  // W coast — Tyre N
    ],
    labelPos: { lat: 33.27, lon: 35.48 },
    startDate: 'Oct 8, 2023',
    parties: ['Israel (IDF)', 'Hezbollah', 'Lebanese civilians'],
    casualties: '3,000+ (mostly Lebanese)',
    displaced: '1.2M+ displaced',
    description: 'Daily cross-border exchanges since Oct 8. Israeli ground incursion in south Lebanon. Hezbollah rocket attacks on northern Israel. Ceasefire fragile.',
    keyEvents: ['Pager attacks', 'Nasrallah assassination', 'Ground incursion', 'Beirut strikes', 'Ceasefire attempts'],
    keywords: ['lebanon', 'hezbollah', 'israel', 'beirut', 'nasrallah', 'south lebanon', 'unifil'],
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
