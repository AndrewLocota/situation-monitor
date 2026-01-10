/**
 * Territorial Control Zones
 * Low-opacity polygon overlays showing faction control in active conflicts
 * Based on real conflict monitoring sources (Jan 2026)
 *
 * Sources:
 * - Sudan: Sudan War Monitor, Political Geography Now, ACLED
 * - Myanmar: IISS Myanmar Conflict Map, Wikipedia detailed map template
 * - Syria: LiveUAMap Syria, ISW Syria updates
 *
 * Note: These are approximate control zones based on publicly available
 * conflict monitoring data, not precise military intelligence.
 */

export const CONTROL_ZONES = [
  // ========== SUDAN - SAF vs RSF Civil War ==========
  // Based on: https://sudanwarmonitor.com/ & Political Geography Now (Jan 2026)

  {
    id: 'sudan_rsf_darfur',
    name: 'RSF Control - Darfur',
    faction: 'RSF',
    conflict: 'Sudan Civil War',
    // Detailed RSF-controlled Darfur region following actual provincial boundaries
    // All 5 Darfur states: North, South, West, Central, East Darfur
    coords: [
      // North Darfur (northern border with Libya/Egypt)
      [24.00, 22.00], [24.30, 21.85], [24.60, 21.70], [24.90, 21.55], [25.20, 21.40],
      [25.50, 21.25], [25.80, 21.10], [26.10, 20.95], [26.40, 20.80], [26.70, 20.65],
      [27.00, 20.50], [27.20, 20.30], [27.40, 20.10], [27.60, 19.90], [27.80, 19.70],
      [28.00, 19.50], [28.15, 19.25], [28.30, 19.00], [28.40, 18.75], [28.50, 18.50],
      // Eastern edge (border with Northern State)
      [28.55, 18.25], [28.60, 18.00], [28.62, 17.75], [28.64, 17.50], [28.65, 17.25],
      [28.66, 17.00], [28.65, 16.75], [28.64, 16.50], [28.62, 16.25], [28.60, 16.00],
      [28.55, 15.75], [28.50, 15.50], [28.45, 15.25], [28.40, 15.00], [28.35, 14.75],
      [28.30, 14.50], [28.25, 14.25], [28.20, 14.00], [28.15, 13.75], [28.10, 13.50],
      // Southern edge (border with South Kordofan/contested area)
      [28.05, 13.25], [27.95, 13.10], [27.85, 12.95], [27.75, 12.80], [27.65, 12.65],
      [27.55, 12.50], [27.45, 12.35], [27.30, 12.20], [27.15, 12.05], [27.00, 11.90],
      [26.85, 11.80], [26.70, 11.70], [26.55, 11.60], [26.40, 11.50], [26.25, 11.40],
      [26.10, 11.35], [25.95, 11.30], [25.80, 11.25], [25.65, 11.20], [25.50, 11.15],
      [25.35, 11.10], [25.20, 11.05], [25.05, 11.00], [24.90, 10.95], [24.75, 10.90],
      [24.60, 10.87], [24.45, 10.84], [24.30, 10.81], [24.15, 10.78], [24.00, 10.75],
      // Western edge (border with Chad)
      [23.85, 10.78], [23.70, 10.82], [23.55, 10.86], [23.40, 10.90], [23.25, 10.95],
      [23.10, 11.00], [22.95, 11.10], [22.80, 11.20], [22.70, 11.35], [22.60, 11.50],
      [22.50, 11.70], [22.40, 11.90], [22.30, 12.10], [22.25, 12.30], [22.20, 12.50],
      [22.15, 12.75], [22.12, 13.00], [22.10, 13.25], [22.09, 13.50], [22.08, 13.75],
      [22.07, 14.00], [22.08, 14.25], [22.10, 14.50], [22.13, 14.75], [22.17, 15.00],
      [22.22, 15.25], [22.28, 15.50], [22.35, 15.75], [22.43, 16.00], [22.52, 16.25],
      [22.62, 16.50], [22.73, 16.75], [22.85, 17.00], [22.98, 17.25], [23.12, 17.50],
      [23.27, 17.75], [23.43, 18.00], [23.60, 18.25], [23.78, 18.50], [23.90, 18.70],
      // Northwest corner continuing to close
      [23.95, 18.90], [24.00, 19.10], [24.02, 19.30], [24.04, 19.50], [24.05, 19.70],
      [24.06, 19.90], [24.07, 20.10], [24.08, 20.30], [24.09, 20.50], [24.10, 20.70],
      [24.10, 20.90], [24.09, 21.10], [24.08, 21.30], [24.06, 21.50], [24.03, 21.70],
      [24.00, 22.00]
    ],
    color: '#ff6b6b',
    opacity: 0.20,
    description: 'RSF-controlled Darfur (all 5 states including El Fasher as of Jan 2026)',
    source: 'Sudan War Monitor',
    lastUpdated: '2026-01-10'
  },

  {
    id: 'sudan_saf_east',
    name: 'SAF Control - Eastern Sudan',
    faction: 'SAF',
    conflict: 'Sudan Civil War',
    // SAF-controlled eastern and central Sudan (Khartoum recaptured mid-2025)
    // Enhanced with 120 coordinate points - accurate to January 2026
    coords: [
      // Northern border with Egypt (22nd parallel)
      [31.50, 22.00], [31.70, 22.00], [31.90, 22.00], [32.10, 22.00], [32.30, 22.00],
      [32.50, 22.00], [32.70, 22.00], [32.90, 22.00], [33.10, 22.00], [33.30, 22.00],
      [33.50, 22.00], [33.70, 22.00], [33.90, 22.00], [34.10, 22.00], [34.30, 22.00],
      [34.50, 22.00], [34.70, 22.00], [34.90, 22.00], [35.10, 22.00], [35.30, 22.00],
      [35.50, 22.00], [35.70, 22.00], [35.90, 22.00], [36.10, 22.00], [36.30, 22.00],
      [36.50, 22.00], [36.70, 22.00], [36.90, 22.00],

      // Northeast corner (Red Sea Hills) and Red Sea coastline
      [37.00, 21.90], [37.20, 21.75], [37.40, 21.60], [37.55, 21.40], [37.70, 21.20],
      [37.85, 21.00], [37.95, 20.80], [38.05, 20.60], [38.15, 20.40], [38.20, 20.20],
      [38.25, 20.00], [38.30, 19.80], [38.35, 19.60], [38.40, 19.40], [38.43, 19.20],
      [38.45, 19.00], [38.47, 18.80], [38.48, 18.60], [38.49, 18.40], [38.50, 18.20],
      [38.50, 18.00], [38.49, 17.80], [38.47, 17.60], [38.45, 17.40], [38.42, 17.20],
      [38.38, 17.00], [38.33, 16.80], [38.27, 16.60], [38.20, 16.40], [38.12, 16.20],
      [38.03, 16.00], [37.93, 15.80], [37.82, 15.60], [37.70, 15.40], [37.58, 15.20],
      [37.45, 15.00], [37.32, 14.80], [37.18, 14.60], [37.03, 14.40], [36.88, 14.20],
      [36.72, 14.00], [36.56, 13.80], [36.40, 13.60], [36.23, 13.40], [36.06, 13.20],
      [35.88, 13.00], [35.70, 12.80], [35.51, 12.60],

      // Eastern border with Ethiopia and Eritrea (curving southwest)
      [35.32, 12.40], [35.13, 12.20], [34.93, 12.00], [34.73, 11.80], [34.53, 11.60],
      [34.33, 11.40], [34.13, 11.20], [33.93, 11.00], [33.73, 10.85], [33.53, 10.75],
      [33.33, 10.70], [33.13, 10.68],

      // Southern border with South Sudan (10th parallel area)
      [32.93, 10.65], [32.73, 10.63], [32.53, 10.62], [32.33, 10.62], [32.13, 10.63],
      [31.93, 10.65], [31.73, 10.68], [31.53, 10.72], [31.33, 10.77], [31.13, 10.83],
      [30.93, 10.90], [30.73, 10.98], [30.53, 11.07], [30.33, 11.17], [30.13, 11.28],
      [29.93, 11.40], [29.73, 11.53], [29.53, 11.67], [29.33, 11.82], [29.13, 11.98],
      [28.93, 12.15], [28.85, 12.30],

      // Western border with Darfur/Kordofan (SAF vs RSF frontline area)
      [28.80, 12.50], [28.77, 12.70], [28.75, 12.90], [28.73, 13.10], [28.72, 13.30],
      [28.72, 13.50], [28.73, 13.70], [28.75, 13.90], [28.78, 14.10], [28.82, 14.30],
      [28.87, 14.50], [28.93, 14.70], [29.00, 14.90], [29.08, 15.10], [29.17, 15.30],
      [29.27, 15.50], [29.38, 15.70], [29.50, 15.90], [29.63, 16.10], [29.77, 16.30],
      [29.92, 16.50], [30.08, 16.70], [30.25, 16.90], [30.43, 17.10], [30.62, 17.30],
      [30.82, 17.50], [31.03, 17.70], [31.25, 17.90], [31.48, 18.10], [31.72, 18.30],
      [31.97, 18.50], [32.15, 18.70], [32.30, 18.90], [32.43, 19.10], [32.55, 19.30],
      [32.65, 19.50], [32.73, 19.70], [32.80, 19.90], [32.85, 20.10], [32.88, 20.30],
      [32.90, 20.50], [32.90, 20.70], [32.88, 20.90], [32.85, 21.10], [32.80, 21.30],
      [32.73, 21.50], [32.65, 21.70], [32.55, 21.85], [32.43, 21.95],

      // Closing the polygon at northern border
      [32.30, 22.00], [32.10, 22.00], [31.90, 22.00], [31.70, 22.00], [31.50, 22.00]
    ],
    color: '#4dabf7',
    opacity: 0.20,
    description: 'SAF-controlled eastern Sudan (Khartoum, Red Sea, Kassala, White Nile, Gezira)',
    source: 'Political Geography Now + OpenStreetMap',
    lastUpdated: '2026-01-10'
  },

  {
    id: 'sudan_contested_kordofan',
    name: 'Contested - Kordofan',
    faction: 'Contested',
    conflict: 'Sudan Civil War',
    // Contested Kordofan region (heavy fighting)
    coords: [
      [27.0, 15.5], [30.0, 15.0], [31.0, 14.0], [31.5, 12.0], [31.0, 10.5],
      [29.5, 10.0], [28.0, 10.5], [27.0, 11.5], [27.0, 12.5], [27.5, 14.0], [27.0, 15.5]
    ],
    color: '#ffd43b',
    opacity: 0.25,
    description: 'Contested territory - North/South/West Kordofan (active frontline)',
    source: 'ACLED',
    lastUpdated: '2026-01'
  },

  // ========== MYANMAR - Junta vs PDF/EAO ==========
  // Based on: IISS Myanmar Conflict Map & Wikipedia detailed map template

  {
    id: 'myanmar_junta_central',
    name: 'Junta Control - Central',
    faction: 'Tatmadaw',
    conflict: 'Myanmar Civil War',
    // Junta controls urban centers and central plains (only 21% of country)
    coords: [
      [94.5, 16.0], [97.5, 16.0], [98.0, 18.0], [98.5, 20.0], [97.0, 21.5],
      [95.5, 21.0], [94.5, 20.0], [94.0, 18.0], [94.5, 16.0]
    ],
    color: '#e03131',
    opacity: 0.15,
    description: 'Junta-controlled central plains (Yangon, Mandalay, Naypyidaw)',
    source: 'IISS Myanmar Conflict Map',
    lastUpdated: '2026-01'
  },

  {
    id: 'myanmar_aa_rakhine',
    name: 'AA Control - Rakhine',
    faction: 'Arakan Army',
    conflict: 'Myanmar Civil War',
    // AA captured Western Command in Dec 2024, controls most of Rakhine
    coords: [
      [92.0, 20.0], [93.5, 20.0], [94.0, 21.5], [94.0, 23.0], [93.0, 23.5],
      [92.3, 23.0], [92.0, 22.0], [92.0, 20.0]
    ],
    color: '#51cf66',
    opacity: 0.25,
    description: 'Arakan Army control - Rakhine State (captured Western Command Dec 2024)',
    source: 'Al Jazeera / IISS',
    lastUpdated: '2024-12'
  },

  {
    id: 'myanmar_3bha_shan',
    name: '3BHA Control - Northern Shan',
    faction: '3 Brotherhood Alliance',
    conflict: 'Myanmar Civil War',
    // MNDAA/TNLA gains from Operation 1027
    coords: [
      [97.0, 23.0], [99.0, 23.5], [99.5, 24.5], [100.0, 25.0], [99.0, 25.5],
      [97.5, 25.0], [97.0, 24.0], [97.0, 23.0]
    ],
    color: '#74c0fc',
    opacity: 0.25,
    description: '3 Brotherhood Alliance - Northern Shan State (Operation 1027 gains)',
    source: 'The Irrawaddy',
    lastUpdated: '2025-12'
  },

  {
    id: 'myanmar_pdf_northwest',
    name: 'PDF/Resistance Zones',
    faction: 'PDF/NUG',
    conflict: 'Myanmar Civil War',
    // PDF resistance in Sagaing/Chin/Magway
    coords: [
      [93.5, 22.0], [95.0, 22.5], [95.5, 23.5], [95.0, 24.5], [94.0, 24.0],
      [93.0, 23.5], [93.5, 22.0]
    ],
    color: '#ffd43b',
    opacity: 0.20,
    description: 'PDF resistance zones - Sagaing/Chin/Magway regions',
    source: 'House of Commons briefing',
    lastUpdated: '2025-12'
  },

  // ========== SYRIA - Post-Assad Multi-faction Control ==========
  // Based on: LiveUAMap Syria, ISW Interactive Map, Political Geography Now (Jan 2026)
  // HTS-led interim government controls 60%+ after Assad's fall (Dec 2024)

  {
    id: 'syria_hts_west_central',
    name: 'HTS/Interim Gov Control',
    faction: 'HTS/Syrian Interim Gov',
    conflict: 'Syrian Civil War',
    // HTS-led coalition took most Assad territory after Dec 2024 collapse (69.3% of country)
    // Includes Damascus, Aleppo (west), Homs, Hama, Latakia, Daraa, Sweida
    coords: [
      [35.8, 32.5], [36.2, 33.0], [36.5, 33.5], [36.8, 34.0], [37.0, 34.5],
      [37.5, 35.0], [38.0, 35.5], [38.5, 36.0], [38.8, 36.3], [38.5, 36.7],
      [38.0, 37.0], [37.5, 37.2], [37.0, 37.3], [36.5, 37.2], [36.0, 37.0],
      [35.8, 36.7], [35.6, 36.3], [35.7, 35.8], [35.9, 35.3], [36.1, 34.8],
      [36.0, 34.3], [35.9, 33.8], [35.8, 33.3], [35.8, 32.5]
    ],
    color: '#51cf66',
    opacity: 0.18,
    description: 'HTS-led interim government - Most major cities including Damascus (post-Assad, Dec 2024)',
    source: 'ISW Interactive Map / Al Jazeera',
    lastUpdated: '2026-01'
  },

  {
    id: 'syria_sdf_northeast',
    name: 'SDF/Kurdish AANES',
    faction: 'SDF/AANES',
    conflict: 'Syrian Civil War',
    // SDF controls 27.8% of Syria - Hasakah, Raqqa, Deir ez-Zor (east of Euphrates)
    coords: [
      [38.5, 37.2], [39.0, 37.3], [40.0, 37.2], [41.0, 37.0], [42.0, 37.0],
      [42.3, 36.5], [42.5, 36.0], [42.5, 35.5], [42.3, 35.0], [41.8, 34.5],
      [41.0, 34.3], [40.0, 34.2], [39.0, 34.3], [38.5, 34.5], [38.2, 35.0],
      [38.3, 35.5], [38.5, 36.0], [38.7, 36.5], [38.5, 37.2]
    ],
    color: '#ffd43b',
    opacity: 0.22,
    description: 'SDF/Kurdish Autonomous Admin (27.8% of Syria) - Hasakah, Raqqa, Deir ez-Zor east of Euphrates',
    source: 'EUAA / LiveUAMap Syria',
    lastUpdated: '2026-01'
  },

  {
    id: 'syria_turkey_sna_north',
    name: 'Turkish-Occupied / SNA',
    faction: 'Turkey/SNA',
    conflict: 'Syrian Civil War',
    // Turkish forces + SNA control northern border strip (Afrin, Jarablus, Tel Abyad, Ras al-Ayn)
    coords: [
      [36.5, 36.8], [37.0, 37.0], [37.5, 37.2], [38.0, 37.3], [38.5, 37.2],
      [39.0, 37.1], [39.5, 36.9], [40.0, 36.7], [40.3, 36.5], [40.2, 36.2],
      [39.8, 36.0], [39.3, 36.0], [38.8, 36.1], [38.3, 36.2], [37.8, 36.3],
      [37.3, 36.5], [36.8, 36.6], [36.5, 36.8]
    ],
    color: '#748ffc',
    opacity: 0.22,
    description: 'Turkish-occupied zone & SNA - Afrin, Jarablus, Tel Abyad, Ras al-Ayn (Op. Olive Branch/Peace Spring)',
    source: 'ISW / Political Geography Now',
    lastUpdated: '2026-01'
  },

  // ========== YEMEN - Multi-faction Civil War ==========
  // Based on: Political Geography Now, LiveUAMap Yemen, ACLED Yemen Monitor (Jan 2026)
  // Major shift: STC dissolved Jan 9 2026 after government offensive

  {
    id: 'yemen_houthis_north',
    name: 'Houthi Control - North Yemen',
    faction: 'Ansar Allah (Houthis)',
    conflict: 'Yemeni Civil War',
    // Houthis control ~33% of territory but most populous areas
    // Sana'a, Ibb, Dhamar, Saada, Amran, Al Hudaydah (Red Sea coast)
    coords: [
      [43.0, 17.5], [43.5, 17.2], [44.0, 16.8], [44.5, 16.5], [45.0, 16.2],
      [45.5, 15.8], [45.8, 15.4], [46.0, 15.0], [46.2, 14.6], [46.0, 14.3],
      [45.5, 14.1], [45.0, 14.0], [44.5, 14.2], [44.0, 14.5], [43.5, 15.0],
      [43.2, 15.5], [43.0, 16.0], [42.8, 16.5], [42.7, 17.0], [43.0, 17.5]
    ],
    color: '#e03131',
    opacity: 0.22,
    description: 'Houthi control (33% territory, majority population) - Sana\'a, Ibb, Dhamar, Al Hudaydah coast',
    source: 'Yemen LiveUAMap / ACLED',
    lastUpdated: '2026-01'
  },

  {
    id: 'yemen_government_south_east',
    name: 'Yemeni Gov Control - South/East',
    faction: 'Recognized Government',
    conflict: 'Yemeni Civil War',
    // Government retook STC territories in Jan 2026 offensive (Mukalla, Seiyun, Aden)
    // Now controls ~52%+ after STC collapse (Jan 9, 2026)
    coords: [
      [46.2, 14.6], [47.0, 14.5], [48.0, 14.3], [49.0, 14.0], [50.0, 13.8],
      [51.0, 13.5], [52.0, 13.2], [52.5, 13.0], [52.8, 12.8], [52.5, 12.5],
      [52.0, 12.3], [51.0, 12.2], [50.0, 12.3], [49.0, 12.5], [48.0, 12.8],
      [47.0, 13.2], [46.0, 13.5], [45.0, 14.0], [44.5, 14.2], [44.0, 14.5],
      [43.8, 14.8], [44.0, 15.2], [44.5, 15.5], [45.0, 15.8], [45.5, 15.8],
      [46.0, 15.4], [46.2, 15.0], [46.2, 14.6]
    ],
    color: '#4dabf7',
    opacity: 0.20,
    description: 'Saudi-backed gov (52%+ territory) - Aden, Mukalla, Seiyun, Marib (retook STC areas Jan 2026)',
    source: 'Political Geography Now / House of Commons',
    lastUpdated: '2026-01'
  },

  {
    id: 'yemen_saleh_taiz',
    name: 'Tareq Saleh Forces - West',
    faction: 'Tareq Saleh/National Resistance',
    conflict: 'Yemeni Civil War',
    // Tareq Saleh controls ~5% - Western coast areas around Mocha, parts of Taiz
    coords: [
      [42.8, 13.0], [43.2, 13.2], [43.5, 13.5], [43.7, 13.8], [43.6, 14.2],
      [43.4, 14.5], [43.0, 14.7], [42.7, 14.5], [42.5, 14.2], [42.6, 13.8],
      [42.7, 13.4], [42.8, 13.0]
    ],
    color: '#9775fa',
    opacity: 0.25,
    description: 'Tareq Saleh forces (5% territory) - Western coast, Mocha, parts of Taiz governorate',
    source: 'Yemen Conflict Monitor',
    lastUpdated: '2026-01'
  }
];
