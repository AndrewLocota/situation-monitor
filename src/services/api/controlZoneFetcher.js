/**
 * Control Zone Data Fetcher
 * Fetches live territorial control data from conflict monitoring sources
 *
 * Data Sources:
 * 1. ACLED API - Conflict event data (free tier: 2500 requests/month)
 * 2. Wikipedia/Wikidata - Territorial control map templates (scraped)
 * 3. LiveUAMap - Real-time conflict updates
 * 4. GDELT - Global event database
 *
 * Fallback: Use static control zones from controlZones.js
 */

import { CONTROL_ZONES } from '../../data/controlZones';
import { fetchWithCircuitBreaker } from '../../utils/circuitBreaker';

// ACLED API configuration
const ACLED_API_KEY = import.meta.env.VITE_ACLED_API_KEY || '';  // User needs to add their key
const ACLED_EMAIL = import.meta.env.VITE_ACLED_EMAIL || '';
const ACLED_BASE_URL = 'https://api.acleddata.com/acled/read';

// Wikipedia conflict map template URLs
const WIKI_CONTROL_MAPS = {
  syria: 'https://en.wikipedia.org/wiki/Template:Syrian_Civil_War_detailed_map',
  myanmar: 'https://en.wikipedia.org/wiki/Template:Myanmar_Civil_War_detailed_map',
  yemen: 'https://en.wikipedia.org/wiki/Template:Yemeni_Civil_War_detailed_map'
};

/**
 * Fetch Syria control zones from LiveUAMap or Wikipedia
 * Priority: LiveUAMap API > Wikipedia SVG parsing > Static fallback
 */
async function fetchSyriaControlZones() {
  try {
    // TODO: Implement LiveUAMap scraping or ISW API integration
    // For now, use static data updated based on ISW/LiveUAMap reports (Jan 2026)

    const zones = CONTROL_ZONES.filter(zone => zone.conflict === 'Syrian Civil War');
    console.log(`[ControlZones] Syria: Loaded ${zones.length} zones (static, based on ISW/LiveUAMap Jan 2026)`);
    return zones;
  } catch (error) {
    console.warn('[ControlZones] Failed to fetch Syria data:', error);
    return CONTROL_ZONES.filter(zone => zone.conflict === 'Syrian Civil War');
  }
}

/**
 * Fetch Myanmar control zones from IISS/Wikipedia
 * Priority: IISS scraping > Wikipedia template > Static fallback
 */
async function fetchMyanmarControlZones() {
  try {
    // TODO: Implement Wikipedia template parsing or IISS data extraction
    // Static data based on IISS Myanmar Conflict Map + recent reports (Jan 2026)

    const zones = CONTROL_ZONES.filter(zone => zone.conflict === 'Myanmar Civil War');
    console.log(`[ControlZones] Myanmar: Loaded ${zones.length} zones (static, based on IISS/Wikipedia Jan 2026)`);
    return zones;
  } catch (error) {
    console.warn('[ControlZones] Failed to fetch Myanmar data:', error);
    return CONTROL_ZONES.filter(zone => zone.conflict === 'Myanmar Civil War');
  }
}

/**
 * Fetch Yemen control zones from LiveUAMap Yemen or ACLED
 * Priority: LiveUAMap > ACLED events clustering > Static fallback
 */
async function fetchYemenControlZones() {
  try {
    // TODO: Implement LiveUAMap Yemen scraping or ACLED event clustering
    // Static data reflects Jan 2026 situation (STC dissolution, gov offensive)

    const zones = CONTROL_ZONES.filter(zone => zone.conflict === 'Yemeni Civil War');
    console.log(`[ControlZones] Yemen: Loaded ${zones.length} zones (static, based on Political Geography Now Jan 2026)`);
    return zones;
  } catch (error) {
    console.warn('[ControlZones] Failed to fetch Yemen data:', error);
    return CONTROL_ZONES.filter(zone => zone.conflict === 'Yemeni Civil War');
  }
}

/**
 * Fetch Sudan control zones from ACLED API
 * ACLED provides event data we can use to infer control zones
 */
async function fetchSudanControlZones() {
  try {
    if (!ACLED_API_KEY || !ACLED_EMAIL) {
      console.log('[ControlZones] Sudan: No ACLED API key, using static data');
      return CONTROL_ZONES.filter(zone => zone.conflict === 'Sudan Civil War');
    }

    // Fetch recent Sudan conflict events from ACLED
    const params = new URLSearchParams({
      key: ACLED_API_KEY,
      email: ACLED_EMAIL,
      country: 'Sudan',
      event_date: `${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}|${new Date().toISOString().split('T')[0]}`,
      event_date_where: 'BETWEEN',
      limit: '500'
    });

    const data = await fetchWithCircuitBreaker(
      'acled-sudan',
      async () => {
        const response = await fetch(`${ACLED_BASE_URL}?${params}`);
        if (!response.ok) throw new Error(`ACLED API error: ${response.status}`);
        return response.json();
      },
      {
        failureThreshold: 2,
        timeout: 300000, // 5 minutes
        maxTimeout: 1800000 // 30 minutes
      }
    );

    // Analyze event locations to update control zones
    // (Simplified: just use static data for now, full implementation would cluster events by actor)
    console.log(`[ControlZones] Sudan: Fetched ${data.count} events from ACLED`);
    return CONTROL_ZONES.filter(zone => zone.conflict === 'Sudan Civil War');

  } catch (error) {
    console.warn('[ControlZones] Failed to fetch Sudan ACLED data:', error);
    return CONTROL_ZONES.filter(zone => zone.conflict === 'Sudan Civil War');
  }
}

/**
 * Fetch Ukraine control zones (already have live ISW frontlines)
 * ISW provides daily maps, we just need to preserve that integration
 */
async function fetchUkraineControlZones() {
  // Ukraine already uses ISW live frontline data from liveFeeds.js
  // No additional control zones needed (frontlines show the division)
  return [];
}

/**
 * Fetch all control zones from live sources
 * Falls back to static data if APIs are unavailable
 * Fetches: Syria, Myanmar, Sudan, Yemen, Ukraine (in parallel)
 */
export async function fetchAllControlZones() {
  try {
    const [syria, myanmar, sudan, yemen, ukraine] = await Promise.allSettled([
      fetchSyriaControlZones(),
      fetchMyanmarControlZones(),
      fetchSudanControlZones(),
      fetchYemenControlZones(),
      fetchUkraineControlZones()
    ]);

    const allZones = [];

    if (syria.status === 'fulfilled') allZones.push(...syria.value);
    if (myanmar.status === 'fulfilled') allZones.push(...myanmar.value);
    if (sudan.status === 'fulfilled') allZones.push(...sudan.value);
    if (yemen.status === 'fulfilled') allZones.push(...yemen.value);
    if (ukraine.status === 'fulfilled') allZones.push(...ukraine.value);

    console.log(`[ControlZones] Loaded ${allZones.length} territorial control zones across 4 conflicts`);
    return allZones;

  } catch (error) {
    console.error('[ControlZones] Failed to fetch control zones:', error);
    // Fallback to all static zones
    return CONTROL_ZONES;
  }
}

/**
 * Get control zones with caching (refresh every 6 hours)
 */
let cachedZones = null;
let lastFetch = 0;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export async function getControlZones() {
  const now = Date.now();

  if (cachedZones && (now - lastFetch) < CACHE_DURATION) {
    return cachedZones;
  }

  cachedZones = await fetchAllControlZones();
  lastFetch = now;
  return cachedZones;
}

/**
 * Force refresh control zones
 */
export async function refreshControlZones() {
  cachedZones = null;
  lastFetch = 0;
  return await getControlZones();
}
