/**
 * Iran Instagram Video Feed - @iranintlenglish
 *
 * IMPORTANT: Direct Instagram API integration requires:
 * - Facebook/Meta developer account and app review
 * - Business Instagram account with OAuth
 * - Backend service for API calls (can't be done client-side)
 *
 * CURRENT APPROACH: Manual curation of Instagram video posts
 * - Manually add new videos from @iranintlenglish
 * - Extract location from video description/hashtags
 * - Videos will appear as markers on the map in Middle East theater
 *
 * To add new videos:
 * 1. Visit instagram.com/iranintlenglish
 * 2. Copy video post URL (e.g., https://www.instagram.com/p/ABC123/)
 * 3. Determine location from caption/tags
 * 4. Add entry below with coordinates
 *
 * FUTURE: Could implement a backend scraper service or use Instagram embed API
 */

export const IRAN_INSTAGRAM_VIDEOS = [
  // Real videos from @iranintlenglish - spread across Iran to avoid stacking
  // Using major Iranian cities for better decluttering
  {
    id: 'iran_video_1',
    lat: 35.6892,  // Tehran
    lng: 51.3890,
    title: 'TEHRAN // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTVzl-NDcsn/',
    embedUrl: 'https://www.instagram.com/p/DTVzl-NDcsn/embed',
    date: '2026-01-11',
    tags: ['iran', 'tehran', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_2',
    lat: 36.2974,  // Mashhad (NE Iran)
    lng: 59.6067,
    title: 'MASHHAD // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTOgs_djOdb/',
    embedUrl: 'https://www.instagram.com/p/DTOgs_djOdb/embed',
    date: '2026-01-11',
    tags: ['iran', 'mashhad', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_3',
    lat: 32.6546,  // Isfahan (Central Iran)
    lng: 51.6680,
    title: 'ISFAHAN // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTWZccBDb98/',
    embedUrl: 'https://www.instagram.com/p/DTWZccBDb98/embed',
    date: '2026-01-11',
    tags: ['iran', 'isfahan', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_4',
    lat: 29.5918,  // Shiraz (SW Iran)
    lng: 52.5836,
    title: 'SHIRAZ // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DS-RRVxjJAw/',
    embedUrl: 'https://www.instagram.com/p/DS-RRVxjJAw/embed',
    date: '2026-01-11',
    tags: ['iran', 'shiraz', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_5',
    lat: 38.0800,  // Tabriz (NW Iran)
    lng: 46.2919,
    title: 'TABRIZ // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTWfRs8CJ5L/',
    embedUrl: 'https://www.instagram.com/p/DTWfRs8CJ5L/embed',
    date: '2026-01-11',
    tags: ['iran', 'tabriz', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'israel_video_1',
    lat: 31.5,  // Israel (as specified by user)
    lng: 34.8,
    title: 'ISRAEL // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish - Israel location',
    instagramUrl: 'https://www.instagram.com/p/DTU8wBEE7DR/',
    embedUrl: 'https://www.instagram.com/p/DTU8wBEE7DR/embed',
    date: '2026-01-11',
    tags: ['israel', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_6',
    lat: 34.6416,  // Qom (Central Iran, holy city)
    lng: 50.8764,
    title: 'QOM // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTSHhHaghQn/',
    embedUrl: 'https://www.instagram.com/p/DTSHhHaghQn/embed',
    date: '2026-01-11',
    tags: ['iran', 'qom', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_7',
    lat: 31.3183,  // Ahvaz (SW Iran)
    lng: 48.6706,
    title: 'AHVAZ // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTWJJFEiWeO/',
    embedUrl: 'https://www.instagram.com/p/DTWJJFEiWeO/embed',
    date: '2026-01-11',
    tags: ['iran', 'ahvaz', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_8',
    lat: 35.8355,  // Karaj (near Tehran)
    lng: 50.9866,
    title: 'KARAJ // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTVmxF1k6og/',
    embedUrl: 'https://www.instagram.com/p/DTVmxF1k6og/embed',
    date: '2026-01-11',
    tags: ['iran', 'karaj', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_9',
    lat: 37.2808,  // Rasht (N Iran, Caspian coast)
    lng: 49.5832,
    title: 'RASHT // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTPw627iDFi/',
    embedUrl: 'https://www.instagram.com/p/DTPw627iDFi/embed',
    date: '2026-01-11',
    tags: ['iran', 'rasht', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_10',
    lat: 34.3142,  // Kermanshah (W Iran)
    lng: 47.0650,
    title: 'KERMANSHAH // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTWmiENjMOv/',
    embedUrl: 'https://www.instagram.com/p/DTWmiENjMOv/embed',
    date: '2026-01-11',
    tags: ['iran', 'kermanshah', 'intel'],
    theatre: 'middle_east',
    active: true
  },
  {
    id: 'iran_video_11',
    lat: 31.8974,  // Yazd (Central Iran)
    lng: 54.3569,
    title: 'YAZD // INTEL VIDEO',
    description: 'Instagram video from @iranintlenglish',
    instagramUrl: 'https://www.instagram.com/p/DTTNpy2k0KL/',
    embedUrl: 'https://www.instagram.com/p/DTTNpy2k0KL/embed',
    date: '2026-01-11',
    tags: ['iran', 'yazd', 'intel'],
    theatre: 'middle_east',
    active: true
  }
];

/**
 * Filter to get only active Instagram videos
 */
export function getActiveIranVideos() {
  return IRAN_INSTAGRAM_VIDEOS.filter(v => v.active);
}

/**
 * Get videos for a specific city/location
 */
export function getVideosByLocation(locationKeyword) {
  return IRAN_INSTAGRAM_VIDEOS.filter(v =>
    v.active && (
      v.title.toLowerCase().includes(locationKeyword.toLowerCase()) ||
      v.description.toLowerCase().includes(locationKeyword.toLowerCase()) ||
      v.tags.some(tag => tag.toLowerCase().includes(locationKeyword.toLowerCase()))
    )
  );
}
