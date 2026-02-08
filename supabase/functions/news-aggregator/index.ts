/**
 * News Aggregator Edge Function
 * Fetches and caches news from multiple RSS feeds
 * Returns aggregated, deduplicated, sorted news items
 */

type NewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category?: string;
  imageUrl?: string;
  bias: number;
  biasLabel: string;
  reliability: string;
};

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://andrewlocota.github.io',
];

function getAllowedOrigins(): string[] {
  const configured = (Deno.env.get('ALLOWED_ORIGINS') || '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = getAllowedOrigins();
  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=30',
  };
}

// RSS feeds with bias ratings (GroundNews scale: -3 to +3)
const NEWS_FEEDS: Record<string, { url: string; bias: number; biasLabel: string; reliability: string }> = {
  reuters: { url: 'https://feeds.reuters.com/reuters/topNews', bias: 0, biasLabel: 'Center', reliability: 'High' },
  ap: { url: 'https://rsshub.app/apnews/topics/apf-topnews', bias: -1, biasLabel: 'Lean Left', reliability: 'High' },
  bbc: { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', bias: 0, biasLabel: 'Center', reliability: 'High' },
  aljazeera: { url: 'https://www.aljazeera.com/xml/rss/all.xml', bias: -2, biasLabel: 'Left', reliability: 'Mixed' },
  guardian: { url: 'https://www.theguardian.com/world/rss', bias: -2, biasLabel: 'Left', reliability: 'High' },
  kyivIndependent: { url: 'https://kyivindependent.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'Mixed' },
  defenseOne: { url: 'https://www.defenseone.com/rss/all/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  marketWatch: { url: 'https://feeds.marketwatch.com/marketwatch/topstories/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  cnbc: { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114', bias: 0, biasLabel: 'Center', reliability: 'High' },
  techCrunch: { url: 'https://techcrunch.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'High' },
  wired: { url: 'https://www.wired.com/feed/rss', bias: -1, biasLabel: 'Lean Left', reliability: 'High' },
  foreignPolicy: { url: 'https://foreignpolicy.com/feed/', bias: 0, biasLabel: 'Center', reliability: 'High' },
};

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[CDATA\[|\]\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImage(content: string): string | undefined {
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<enclosure[^>]+url=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)["']/i,
    /src=["']([^"']+\.(jpg|jpeg|png|gif|webp)[^"']*)["']/i,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1];
  }
  return undefined;
}

async function fetchFeedWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'situation-monitor/1.0 (supabase-edge)',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseRssFeed(xml: string, sourceName: string, feedInfo: { bias: number; biasLabel: string; reliability: string }): NewsItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items: NewsItem[] = [];

  // Handle RSS format
  const rssItems = doc.querySelectorAll('item');
  // Handle Atom format
  const atomEntries = doc.querySelectorAll('entry');
  const entries = rssItems.length > 0 ? Array.from(rssItems) : Array.from(atomEntries);

  const isAtom = rssItems.length === 0;

  for (let i = 0; i < Math.min(entries.length, 15); i++) {
    const entry = entries[i];

    const title = stripHtml(entry.querySelector('title')?.textContent || '');
    if (!title) continue;

    let link = '';
    if (isAtom) {
      link = entry.querySelector('link')?.getAttribute('href') ||
             entry.querySelector('link')?.textContent || '';
    } else {
      link = entry.querySelector('link')?.textContent || '';
    }

    const rawDescription = entry.querySelector('description')?.textContent ||
                          entry.querySelector('content')?.textContent ||
                          entry.querySelector('summary')?.textContent || '';
    const description = stripHtml(rawDescription).slice(0, 500);

    const pubDateRaw = entry.querySelector('pubDate')?.textContent ||
                       entry.querySelector('published')?.textContent ||
                       entry.querySelector('updated')?.textContent || '';
    const pubDate = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();

    const category = entry.querySelector('category')?.textContent || undefined;

    // Extract image from various sources
    let imageUrl: string | undefined;
    const enclosure = entry.querySelector('enclosure[type^="image"]');
    if (enclosure) {
      imageUrl = enclosure.getAttribute('url') || undefined;
    }
    if (!imageUrl) {
      const mediaContent = entry.querySelector('media\\:content, content[type^="image"]');
      if (mediaContent) {
        imageUrl = mediaContent.getAttribute('url') || undefined;
      }
    }
    if (!imageUrl) {
      const mediaThumbnail = entry.querySelector('media\\:thumbnail');
      if (mediaThumbnail) {
        imageUrl = mediaThumbnail.getAttribute('url') || undefined;
      }
    }
    if (!imageUrl) {
      imageUrl = extractImage(rawDescription);
    }

    items.push({
      id: `${sourceName}-${i}-${Date.now()}`,
      title,
      description,
      link,
      pubDate,
      source: sourceName,
      category,
      imageUrl,
      bias: feedInfo.bias,
      biasLabel: feedInfo.biasLabel,
      reliability: feedInfo.reliability,
    });
  }

  return items;
}

// In-memory cache
let cache: { ts: number; data: NewsItem[] } | null = null;
const CACHE_TTL_MS = 45_000; // 45 seconds

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  const now = Date.now();

  // Return cached data if fresh
  if (cache && now - cache.ts < CACHE_TTL_MS) {
    return new Response(JSON.stringify(cache.data), { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(200, Number(url.searchParams.get('limit') || '100') || 100));

  try {
    const allItems: NewsItem[] = [];

    // Fetch all feeds in parallel with timeout
    const feedResults = await Promise.allSettled(
      Object.entries(NEWS_FEEDS).map(async ([name, feedInfo]) => {
        try {
          const xml = await fetchFeedWithTimeout(feedInfo.url, 8000);
          return parseRssFeed(xml, name, feedInfo);
        } catch {
          return [];
        }
      })
    );

    feedResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    });

    // Sort by date (newest first) and deduplicate by title
    const seen = new Set<string>();
    const uniqueItems = allItems
      .filter((item) => item.title && item.pubDate)
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .filter((item) => {
        const normalized = item.title.toLowerCase().slice(0, 60);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      })
      .slice(0, limit);

    // Update cache
    cache = { ts: now, data: uniqueItems };

    return new Response(JSON.stringify(uniqueItems), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
