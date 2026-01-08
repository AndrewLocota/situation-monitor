const BASE = import.meta.env.BASE_URL;

export const VIDEO_MARKERS = [
  {
    id: 'mar_a_lago',
    lat: 26.6771,
    lng: -80.0370,
    title: 'MAR-A-LAGO // INTEL',
    src: `${BASE}videos/marco_rubio_fireball.mp4`
  },
  {
    id: 'white_house',
    lat: 38.8977,
    lng: -77.0365,
    title: 'WHITE HOUSE // THE FIRE RISES',
    src: `${BASE}videos/THE_FIRE_RISES_HOI4_TRAILER_parody_480P.mp4`,
    startTime: 24
  }
];
