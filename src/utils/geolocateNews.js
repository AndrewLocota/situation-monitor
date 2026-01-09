/**
 * Geolocate news articles by extracting location mentions from titles
 * Returns coordinates for the first matching location found
 */

// Dictionary of common locations mentioned in news with their coordinates
const LOCATION_DATABASE = {
  // Countries
  'ukraine': { lat: 48.3794, lng: 31.1656, label: 'Ukraine' },
  'russia': { lat: 55.7558, lng: 37.6173, label: 'Russia' },
  'china': { lat: 39.9042, lng: 116.4074, label: 'China' },
  'taiwan': { lat: 25.0330, lng: 121.5654, label: 'Taiwan' },
  'israel': { lat: 31.7683, lng: 35.2137, label: 'Israel' },
  'gaza': { lat: 31.3547, lng: 34.3088, label: 'Gaza' },
  'palestine': { lat: 31.9522, lng: 35.2332, label: 'Palestine' },
  'iran': { lat: 35.6892, lng: 51.389, label: 'Iran' },
  'north korea': { lat: 39.0392, lng: 125.7625, label: 'North Korea' },
  'south korea': { lat: 37.5665, lng: 126.978, label: 'South Korea' },
  'japan': { lat: 35.6762, lng: 139.6503, label: 'Japan' },
  'india': { lat: 28.6139, lng: 77.209, label: 'India' },
  'pakistan': { lat: 33.6844, lng: 73.0479, label: 'Pakistan' },
  'afghanistan': { lat: 34.5553, lng: 69.2075, label: 'Afghanistan' },
  'syria': { lat: 33.5138, lng: 36.2765, label: 'Syria' },
  'iraq': { lat: 33.3152, lng: 44.3661, label: 'Iraq' },
  'yemen': { lat: 15.3694, lng: 44.191, label: 'Yemen' },
  'sudan': { lat: 15.5007, lng: 32.5599, label: 'Sudan' },
  'ethiopia': { lat: 9.145, lng: 40.4897, label: 'Ethiopia' },
  'somalia': { lat: 2.0469, lng: 45.3182, label: 'Somalia' },
  'libya': { lat: 32.8872, lng: 13.1913, label: 'Libya' },
  'egypt': { lat: 30.0444, lng: 31.2357, label: 'Egypt' },
  'saudi arabia': { lat: 24.7136, lng: 46.6753, label: 'Saudi Arabia' },
  'turkey': { lat: 41.0082, lng: 28.9784, label: 'Turkey' },
  'germany': { lat: 52.52, lng: 13.405, label: 'Germany' },
  'france': { lat: 48.8566, lng: 2.3522, label: 'France' },
  'uk': { lat: 51.5074, lng: -0.1278, label: 'UK' },
  'britain': { lat: 51.5074, lng: -0.1278, label: 'Britain' },
  'england': { lat: 51.5074, lng: -0.1278, label: 'England' },
  'mexico': { lat: 19.4326, lng: -99.1332, label: 'Mexico' },
  'canada': { lat: 45.4215, lng: -75.6972, label: 'Canada' },
  'brazil': { lat: -15.7975, lng: -47.8919, label: 'Brazil' },
  'argentina': { lat: -34.6037, lng: -58.3816, label: 'Argentina' },
  'venezuela': { lat: 10.4806, lng: -66.9036, label: 'Venezuela' },
  'colombia': { lat: 4.711, lng: -74.0721, label: 'Colombia' },
  'australia': { lat: -35.2809, lng: 149.13, label: 'Australia' },
  'philippines': { lat: 14.5995, lng: 120.9842, label: 'Philippines' },
  'indonesia': { lat: -6.2088, lng: 106.8456, label: 'Indonesia' },
  'vietnam': { lat: 21.0278, lng: 105.8342, label: 'Vietnam' },
  'myanmar': { lat: 19.7633, lng: 96.0785, label: 'Myanmar' },
  'thailand': { lat: 13.7563, lng: 100.5018, label: 'Thailand' },
  'poland': { lat: 52.2297, lng: 21.0122, label: 'Poland' },
  'romania': { lat: 44.4268, lng: 26.1025, label: 'Romania' },
  'hungary': { lat: 47.4979, lng: 19.0402, label: 'Hungary' },
  'greece': { lat: 37.9838, lng: 23.7275, label: 'Greece' },
  'italy': { lat: 41.9028, lng: 12.4964, label: 'Italy' },
  'spain': { lat: 40.4168, lng: -3.7038, label: 'Spain' },
  'netherlands': { lat: 52.3676, lng: 4.9041, label: 'Netherlands' },
  'belgium': { lat: 50.8503, lng: 4.3517, label: 'Belgium' },
  'sweden': { lat: 59.3293, lng: 18.0686, label: 'Sweden' },
  'norway': { lat: 59.9139, lng: 10.7522, label: 'Norway' },
  'finland': { lat: 60.1699, lng: 24.9384, label: 'Finland' },
  'greenland': { lat: 64.1836, lng: -51.7214, label: 'Greenland' },
  
  // Major Cities
  'washington': { lat: 38.9072, lng: -77.0369, label: 'Washington DC' },
  'new york': { lat: 40.7128, lng: -74.006, label: 'New York' },
  'los angeles': { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },
  'chicago': { lat: 41.8781, lng: -87.6298, label: 'Chicago' },
  'miami': { lat: 25.7617, lng: -80.1918, label: 'Miami' },
  'houston': { lat: 29.7604, lng: -95.3698, label: 'Houston' },
  'san francisco': { lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
  'seattle': { lat: 47.6062, lng: -122.3321, label: 'Seattle' },
  'london': { lat: 51.5074, lng: -0.1278, label: 'London' },
  'paris': { lat: 48.8566, lng: 2.3522, label: 'Paris' },
  'berlin': { lat: 52.52, lng: 13.405, label: 'Berlin' },
  'moscow': { lat: 55.7558, lng: 37.6173, label: 'Moscow' },
  'beijing': { lat: 39.9042, lng: 116.4074, label: 'Beijing' },
  'shanghai': { lat: 31.2304, lng: 121.4737, label: 'Shanghai' },
  'hong kong': { lat: 22.3193, lng: 114.1694, label: 'Hong Kong' },
  'tokyo': { lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  'seoul': { lat: 37.5665, lng: 126.978, label: 'Seoul' },
  'taipei': { lat: 25.033, lng: 121.5654, label: 'Taipei' },
  'singapore': { lat: 1.3521, lng: 103.8198, label: 'Singapore' },
  'dubai': { lat: 25.2048, lng: 55.2708, label: 'Dubai' },
  'tel aviv': { lat: 32.0853, lng: 34.7818, label: 'Tel Aviv' },
  'jerusalem': { lat: 31.7683, lng: 35.2137, label: 'Jerusalem' },
  'tehran': { lat: 35.6892, lng: 51.389, label: 'Tehran' },
  'riyadh': { lat: 24.7136, lng: 46.6753, label: 'Riyadh' },
  'cairo': { lat: 30.0444, lng: 31.2357, label: 'Cairo' },
  'kyiv': { lat: 50.4501, lng: 30.5234, label: 'Kyiv' },
  'kiev': { lat: 50.4501, lng: 30.5234, label: 'Kiev' },
  'brussels': { lat: 50.8503, lng: 4.3517, label: 'Brussels' },
  'ottawa': { lat: 45.4215, lng: -75.6972, label: 'Ottawa' },
  'toronto': { lat: 43.6532, lng: -79.3832, label: 'Toronto' },
  'sydney': { lat: -33.8688, lng: 151.2093, label: 'Sydney' },
  'mumbai': { lat: 19.076, lng: 72.8777, label: 'Mumbai' },
  'delhi': { lat: 28.6139, lng: 77.209, label: 'Delhi' },
  
  // Conflict zones / regions
  'donbas': { lat: 48.0159, lng: 37.8028, label: 'Donbas' },
  'crimea': { lat: 44.9521, lng: 34.1024, label: 'Crimea' },
  'bakhmut': { lat: 48.5953, lng: 38.0003, label: 'Bakhmut' },
  'kherson': { lat: 46.6354, lng: 32.6169, label: 'Kherson' },
  'zaporizhzhia': { lat: 47.8388, lng: 35.1396, label: 'Zaporizhzhia' },
  'mariupol': { lat: 47.0951, lng: 37.5535, label: 'Mariupol' },
  'rafah': { lat: 31.2867, lng: 34.2508, label: 'Rafah' },
  'west bank': { lat: 31.9466, lng: 35.3027, label: 'West Bank' },
  'golan': { lat: 33.0, lng: 35.75, label: 'Golan Heights' },
  'red sea': { lat: 20.0, lng: 38.0, label: 'Red Sea' },
  'south china sea': { lat: 12.0, lng: 113.0, label: 'South China Sea' },
  'taiwan strait': { lat: 24.5, lng: 119.5, label: 'Taiwan Strait' },
  'persian gulf': { lat: 26.0, lng: 52.0, label: 'Persian Gulf' },
  'strait of hormuz': { lat: 26.55, lng: 56.25, label: 'Strait of Hormuz' },
  'suez': { lat: 30.45, lng: 32.35, label: 'Suez Canal' },
  'arctic': { lat: 71.0, lng: -8.0, label: 'Arctic' },
  'antarctica': { lat: -82.8628, lng: 135.0, label: 'Antarctica' },
  
  // Key figures (map to their capital/base)
  'trump': { lat: 26.6771, lng: -80.037, label: 'Mar-a-Lago (Trump)' },
  'biden': { lat: 38.8977, lng: -77.0365, label: 'White House (Biden)' },
  'vance': { lat: 38.8899, lng: -77.009, label: 'Capitol Hill (Vance)' },
  'musk': { lat: 30.2672, lng: -97.7431, label: 'Austin, TX (Musk)' },
  'putin': { lat: 55.7558, lng: 37.6173, label: 'Kremlin (Putin)' },
  'xi': { lat: 39.9042, lng: 116.4074, label: 'Beijing (Xi)' },
  'zelensky': { lat: 50.4501, lng: 30.5234, label: 'Kyiv (Zelensky)' },
  'netanyahu': { lat: 31.7683, lng: 35.2137, label: 'Jerusalem (Netanyahu)' },
  
  // US Cities
  'minneapolis': { lat: 44.9778, lng: -93.2650, label: 'Minneapolis' },
  'detroit': { lat: 42.3314, lng: -83.0458, label: 'Detroit' },
  'atlanta': { lat: 33.7490, lng: -84.3880, label: 'Atlanta' },
  'boston': { lat: 42.3601, lng: -71.0589, label: 'Boston' },
  'phoenix': { lat: 33.4484, lng: -112.0740, label: 'Phoenix' },
  'denver': { lat: 39.7392, lng: -104.9903, label: 'Denver' },
  'las vegas': { lat: 36.1699, lng: -115.1398, label: 'Las Vegas' },
  'austin': { lat: 30.2672, lng: -97.7431, label: 'Austin' },
  'dallas': { lat: 32.7767, lng: -96.7970, label: 'Dallas' },
  
  // Organizations
  'nato': { lat: 50.8503, lng: 4.3517, label: 'NATO HQ' },
  'pentagon': { lat: 38.8719, lng: -77.0563, label: 'Pentagon' },
  'kremlin': { lat: 55.7539, lng: 37.6208, label: 'Kremlin' },
  'white house': { lat: 38.8977, lng: -77.0365, label: 'White House' },
  'congress': { lat: 38.8899, lng: -77.009, label: 'US Congress' },
  'house': { lat: 38.8899, lng: -77.009, label: 'House of Representatives' },
  'senate': { lat: 38.8899, lng: -77.009, label: 'US Senate' },
  'un': { lat: 40.7489, lng: -73.968, label: 'United Nations' },
  'united nations': { lat: 40.7489, lng: -73.968, label: 'United Nations' },
  'eu': { lat: 50.8503, lng: 4.3517, label: 'European Union' },
  'european union': { lat: 50.8503, lng: 4.3517, label: 'European Union' },
  'fed': { lat: 38.8928, lng: -77.0452, label: 'Federal Reserve' },
  'federal reserve': { lat: 38.8928, lng: -77.0452, label: 'Federal Reserve' },
};

/**
 * Extract location from news item title/description
 * Returns { lat, lng, label } or null if no location found
 */
// Terms to exclude/ignore to prevent false positives
const EXCLUSIONS = [
  'new york times', 'nyt', 'yorkshire', 'new york post', 'nyp',
  'washington post', 'washington times',
  'south china morning post',
  'london stock exchange'
];

/**
 * Extract location from news item title/description
 * Returns { lat, lng, label } or null if no location found
 */
export function geolocateNews(newsItem) {
  let text = `${newsItem.title || ''} ${newsItem.description || ''}`.toLowerCase();
  
  // Remove exclusions first
  for (const exclusion of EXCLUSIONS) {
    if (text.includes(exclusion)) {
      text = text.replace(exclusion, ' '.repeat(exclusion.length)); // Replace with spaces to preserve indices/boundaries if needed, or just remove
    }
  }
  
  // Sort keys by length (longest first) to match more specific locations first
  // e.g., "South Korea" before "Korea"
  const sortedLocations = Object.keys(LOCATION_DATABASE).sort((a, b) => b.length - a.length);
  
  for (const locationKey of sortedLocations) {
    // strict word boundary check to avoid substrings (e.g. "sus" matching "us")
    // Escape special regex chars in locationKey just in case
    const safeKey = locationKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${safeKey}\\b`, 'i');
    
    if (regex.test(text)) {
      const location = LOCATION_DATABASE[locationKey];
      return {
        lat: location.lat,
        lng: location.lng,
        label: location.label,
        matchedTerm: locationKey
      };
    }
  }
  
  return null;
}

/**
 * Geolocate multiple news items
 * Returns array of { newsItem, location } objects for items that could be geolocated
 */
export function geolocateNewsItems(newsItems, limit = 10) {
  const geolocated = [];
  
  for (const item of newsItems.slice(0, limit)) {
    const location = geolocateNews(item);
    if (location) {
      geolocated.push({
        newsItem: item,
        location
      });
    }
  }
  
  return geolocated;
}

export default geolocateNews;
