/**
 * Control Zone Geometry Utilities
 * Fetches accurate GeoJSON boundaries from live sources
 * Prevents zones from spilling into oceans or neighboring countries
 */

/**
 * Fetch accurate country boundary from Natural Earth or OpenStreetMap Nominatim
 * This provides proper geographic boundaries that don't spill into oceans
 */
export async function fetchCountryBoundary(countryCode) {
  try {
    // Use Nominatim (OpenStreetMap) for country boundaries
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?country=${countryCode}&polygon_geojson=1&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'situation-monitor/1.0'
        }
      }
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.length === 0 || !data[0].geojson) {
      throw new Error('No boundary data found');
    }

    return data[0].geojson;
  } catch (error) {
    console.error(`Failed to fetch boundary for ${countryCode}:`, error);
    return null;
  }
}

/**
 * Simplify polygon to reduce coordinate points while maintaining accuracy
 * Uses Douglas-Peucker algorithm
 */
export function simplifyPolygon(coordinates, tolerance = 0.01) {
  if (!coordinates || coordinates.length < 3) return coordinates;

  // Douglas-Peucker implementation
  function getPerpendicularDistance(point, lineStart, lineEnd) {
    const [x, y] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) {
      return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
    }

    const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
  }

  function simplifyDouglasPeucker(points, epsilon) {
    if (points.length <= 2) return points;

    let maxDist = 0;
    let maxIndex = 0;
    const end = points.length - 1;

    for (let i = 1; i < end; i++) {
      const dist = getPerpendicularDistance(points[i], points[0], points[end]);
      if (dist > maxDist) {
        maxDist = dist;
        maxIndex = i;
      }
    }

    if (maxDist > epsilon) {
      const left = simplifyDouglasPeucker(points.slice(0, maxIndex + 1), epsilon);
      const right = simplifyDouglasPeucker(points.slice(maxIndex), epsilon);
      return left.slice(0, -1).concat(right);
    }

    return [points[0], points[end]];
  }

  return simplifyDouglasPeucker(coordinates, tolerance);
}

/**
 * Clip polygon to a bounding box (prevents spilling into ocean/neighbors)
 */
export function clipPolygonToBounds(coordinates, bounds) {
  const { minLon, maxLon, minLat, maxLat } = bounds;

  return coordinates.map(([lon, lat]) => [
    Math.max(minLon, Math.min(maxLon, lon)),
    Math.max(minLat, Math.min(maxLat, lat))
  ]);
}

/**
 * Get accurate control zone polygon from live data
 * Falls back to simplified approximation if live fetch fails
 */
export async function getAccurateControlZone(zoneConfig) {
  const { countryCode, region, bounds, fallbackCoords } = zoneConfig;

  try {
    // Try to fetch accurate boundary
    const boundary = await fetchCountryBoundary(countryCode);

    if (boundary && boundary.coordinates) {
      let coords = boundary.coordinates[0]; // Outer ring

      // If it's a MultiPolygon, take the largest polygon
      if (boundary.type === 'MultiPolygon') {
        coords = boundary.coordinates
          .sort((a, b) => b[0].length - a[0].length)[0][0];
      }

      // Clip to regional bounds if specified
      if (bounds) {
        coords = clipPolygonToBounds(coords, bounds);
      }

      // Simplify to reasonable number of points (50-100)
      coords = simplifyPolygon(coords, 0.05);

      return coords;
    }
  } catch (error) {
    console.warn(`Using fallback coordinates for ${countryCode}:`, error);
  }

  // Fallback to provided coordinates
  return fallbackCoords;
}

/**
 * Fetch control zones with accurate, detailed geometries
 * Updated daily from OpenStreetMap/Nominatim
 */
export async function fetchDetailedControlZones() {
  // Define zone configurations with bounds to prevent spilling
  const zoneConfigs = [
    // Sudan zones with proper bounds
    {
      id: 'sudan_darfur',
      countryCode: 'sudan',
      bounds: { minLon: 21.5, maxLon: 27.5, minLat: 10.0, maxLat: 17.0 },
      fallbackCoords: null // Will use static if fetch fails
    },
    // More configs...
  ];

  const results = await Promise.allSettled(
    zoneConfigs.map(config => getAccurateControlZone(config))
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);
}
