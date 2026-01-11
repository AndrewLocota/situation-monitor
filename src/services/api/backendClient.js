/**
 * Backend API Client
 * Fetches news from our Vercel serverless backend
 * Replaces direct RSS fetching for 10x performance improvement
 */

// API URL - will be set via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Fetch news from backend API
 * @param {number} limit - Maximum number of articles to return
 * @returns {Promise<Array>} - Array of news articles
 */
export async function fetchNewsFromBackend(limit = 200) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/news?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't set a timeout - let the backend handle caching
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Backend API returned error');
    }

    console.log(`[Backend API] Fetched ${data.count} articles (cached: ${data.cached}, age: ${data.cacheAge || 0}s)`);

    // Convert ISO date strings back to Date objects
    const news = data.news.map(item => ({
      ...item,
      pubDate: new Date(item.pubDate),
    }));

    return news;
  } catch (error) {
    console.error('[Backend API] Failed to fetch news:', error);
    throw error;
  }
}

/**
 * Check if backend API is available
 * @returns {Promise<boolean>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    return response.ok;
  } catch (error) {
    console.warn('[Backend API] Health check failed:', error);
    return false;
  }
}

/**
 * Get backend API status
 * @returns {Promise<Object>} - Status information
 */
export async function getBackendStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return { available: false };

    const data = await response.json();
    return {
      available: true,
      ...data,
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}
