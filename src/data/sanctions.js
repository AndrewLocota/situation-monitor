// Sanctions monitoring hotspots (publicly known sanctions concentration points)
// Used for visualization only; not a legal/compliance feed.

export const SANCTION_HOTSPOTS = [
  {
    id: 'russia-finance',
    name: 'Russia - Financial Core',
    lat: 55.7558,
    lon: 37.6173,
    target: 'Banking, defense, energy',
    regimes: ['US', 'EU', 'UK', 'G7'],
    note: 'Broad sectoral sanctions and export controls.',
    estimatedEntities: 2500
  },
  {
    id: 'russia-crimea',
    name: 'Crimea / Sevastopol',
    lat: 44.6166,
    lon: 33.5254,
    target: 'Territorial/port restrictions',
    regimes: ['US', 'EU', 'UK'],
    note: 'Maritime and territorial sanctions focus.',
    estimatedEntities: 300
  },
  {
    id: 'iran-tehran',
    name: 'Iran - Tehran',
    lat: 35.6892,
    lon: 51.3890,
    target: 'Missile, drones, finance',
    regimes: ['US', 'EU', 'UK', 'UN'],
    note: 'Designations tied to military and procurement networks.',
    estimatedEntities: 900
  },
  {
    id: 'iran-bandar',
    name: 'Iran - Bandar Abbas',
    lat: 27.1832,
    lon: 56.2667,
    target: 'Shipping/procurement',
    regimes: ['US', 'UK'],
    note: 'Maritime sanctions and interdiction focus.',
    estimatedEntities: 120
  },
  {
    id: 'dprk-pyongyang',
    name: 'DPRK - Pyongyang',
    lat: 39.0392,
    lon: 125.7625,
    target: 'Weapons, dual-use, finance',
    regimes: ['UN', 'US', 'EU', 'UK'],
    note: 'Long-running UN sanctions architecture.',
    estimatedEntities: 450
  },
  {
    id: 'syria-damascus',
    name: 'Syria - Damascus',
    lat: 33.5138,
    lon: 36.2765,
    target: 'State/security-linked entities',
    regimes: ['US', 'EU', 'UK'],
    note: 'Civil-war related sanctions programs.',
    estimatedEntities: 350
  },
  {
    id: 'belarus-minsk',
    name: 'Belarus - Minsk',
    lat: 53.9006,
    lon: 27.5590,
    target: 'State enterprises, logistics',
    regimes: ['US', 'EU', 'UK', 'Canada'],
    note: 'Expanded after 2020 and 2022 measures.',
    estimatedEntities: 300
  },
  {
    id: 'myanmar-naypyidaw',
    name: 'Myanmar - Naypyidaw',
    lat: 19.7633,
    lon: 96.0785,
    target: 'Military junta-linked entities',
    regimes: ['US', 'EU', 'UK', 'Canada'],
    note: 'Post-coup sanctions and arms restrictions.',
    estimatedEntities: 220
  },
  {
    id: 'venezuela-caracas',
    name: 'Venezuela - Caracas',
    lat: 10.4806,
    lon: -66.9036,
    target: 'Oil, state officials, finance',
    regimes: ['US', 'UK', 'Canada'],
    note: 'Sanctions scope fluctuates with policy waivers.',
    estimatedEntities: 180
  },
  {
    id: 'cuba-havana',
    name: 'Cuba - Havana',
    lat: 23.1136,
    lon: -82.3666,
    target: 'State-linked enterprises',
    regimes: ['US'],
    note: 'Country-level restrictions and entity lists.',
    estimatedEntities: 120
  }
];

export default SANCTION_HOTSPOTS;
