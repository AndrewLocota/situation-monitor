// CORS Proxy utilities

export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
];

export async function fetchWithCorsProxy(url) {
  // Try direct fetch first (for APIs that don't need proxy)
  try {
    const directResponse = await fetch(url, {
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, application/json, */*' }
    });
    if (directResponse.ok) {
      return directResponse;
    }
  } catch {
    // Continue to proxy attempts
  }

  // Try each proxy
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, application/json, */*' }
      });
      if (response.ok) {
        return response;
      }
    } catch (e) {
      console.log(`Proxy ${proxy} failed, trying next...`);
    }
  }

  console.error(`All fetches failed for ${url}`);
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
