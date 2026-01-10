// CORS Proxy utilities

export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
];

export async function fetchWithCorsProxy(url, { signal } = {}) {
  // Try direct fetch first (for APIs that don't need proxy)
  try {
    const directResponse = await fetch(url, {
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, application/json, */*' },
      signal
    });
    if (directResponse.ok) {
      return directResponse;
    }
  } catch (e) {
    // If aborted, throw immediately
    if (e.name === 'AbortError') throw e;
    // Continue to proxy attempts
  }

  // Try each proxy
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, application/json, */*' },
        signal
      });
      if (response.ok) {
        return response;
      }
    } catch (e) {
      // If aborted, throw immediately
      if (e.name === 'AbortError') throw e;
      console.log(`Proxy ${proxy} failed, trying next...`);
    }
  }

  // Silent fail or warning to avoid console flooding during rapid polling
  // frequent CORS errors are expected on public proxies
  // console.warn(`All fetches failed for ${url}`);
  return null;
}

// Legacy function for backward compatibility
export async function fetchWithProxy(url) {
  const response = await fetchWithCorsProxy(url);
  if (response) {
    return await response.text();
  }
  throw new Error(`All fetches failed for ${url}`);
}

export async function fetchJSON(url) {
  const text = await fetchWithProxy(url);
  return JSON.parse(text);
}

export default fetchWithCorsProxy;
