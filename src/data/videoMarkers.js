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
  },
  {
    id: 'caracas_hills',
    lat: 10.4806,
    lng: -66.9036,
    title: 'CARACAS // SKY NEWS INTEL',
    src: 'https://www.tiktok.com/@skynews/video/7591105461860977942'
  },
  {
    id: 'caracas_palace',
    lat: 10.5061,
    lng: -66.9147,
    title: 'CARACAS // MIRAFLORES PALACE',
    src: `${BASE}videos/caracas_edit1.mp4`
  }
];
