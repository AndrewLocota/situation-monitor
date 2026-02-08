type TweetItem = {
  id: string;
  tweetId: string | null;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  username: string;
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
    'Cache-Control': 'no-store',
  };
}

const TWITTER_ACCOUNTS = [
  'WarMonitors',
  'OSINTdefender',
  'Conflicts',
  'IntelCrab',
  'sentaboringtweet',
];

const FEED_SOURCES = [
  // RSSHub (often best quality)
  (username: string) => `https://rsshub.app/twitter/user/${encodeURIComponent(username)}`,
  // Nitter / xcancel fallbacks
  (username: string) => `https://nitter.poast.org/${encodeURIComponent(username)}/rss`,
  (username: string) => `https://nitter.privacydev.net/${encodeURIComponent(username)}/rss`,
  (username: string) => `https://xcancel.com/${encodeURIComponent(username)}/rss`,
];

function parseTextContent(doc: Document, el: Element | null): string {
  if (!el) return '';
  return (el.textContent || '').trim();
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function tryGetLinkFromItem(item: Element): string {
  const linkText = parseTextContent(item.ownerDocument, item.querySelector('link'));
  if (linkText) return linkText;

  const linkEl = item.querySelector('link[href]');
  if (linkEl) {
    const href = linkEl.getAttribute('href');
    if (href) return href;
  }

  return '';
}

function parseRssXml(xmlText: string, username: string): TweetItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');

  const rssItems = Array.from(doc.querySelectorAll('item'));
  const atomItems = Array.from(doc.querySelectorAll('entry'));
  const entries = rssItems.length > 0 ? rssItems : atomItems;

  const tweets: TweetItem[] = [];

  for (const entry of entries) {
    const title = stripHtml(parseTextContent(doc, entry.querySelector('title'))).slice(0, 240);
    const description = stripHtml(
      parseTextContent(doc, entry.querySelector('description')) ||
        parseTextContent(doc, entry.querySelector('content')) ||
        parseTextContent(doc, entry.querySelector('summary'))
    ).slice(0, 700);

    const rawLink = tryGetLinkFromItem(entry);
    const tweetIdMatch = rawLink.match(/status\/(\d+)/);
    const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;
    if (!tweetId) continue;

    const pubDateRaw =
      parseTextContent(doc, entry.querySelector('pubDate')) ||
      parseTextContent(doc, entry.querySelector('published')) ||
      parseTextContent(doc, entry.querySelector('updated'));
    const pubDateIso = pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString();

    const link = `https://twitter.com/i/status/${tweetId}`;
    const safeTitle = title || description.slice(0, 240);

    tweets.push({
      id: `twitter-${username}-${tweetId}`,
      tweetId,
      title: safeTitle,
      description,
      link,
      pubDate: pubDateIso,
      source: username,
      username,
    });
  }

  return tweets;
}

async function fetchTextWithTimeout(url: string, timeoutMs: number): Promise<string> {
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
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

let cache: { ts: number; data: TweetItem[] } | null = null;
const CACHE_TTL_MS = 25_000;

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
  if (cache && now - cache.ts < CACHE_TTL_MS) {
    return new Response(JSON.stringify(cache.data), { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get('limit') || '30') || 30));

  try {
    const allTweets: TweetItem[] = [];

    // Fetch accounts in parallel, but keep per-account fanout small.
    const perAccount = await Promise.all(
      TWITTER_ACCOUNTS.map(async (username) => {
        for (const buildUrl of FEED_SOURCES) {
          const feedUrl = buildUrl(username);
          try {
            const xml = await fetchTextWithTimeout(feedUrl, 8000);
            const tweets = parseRssXml(xml, username);
            if (tweets.length > 0) return tweets;
          } catch {
            // Try next source
          }
        }
        return [];
      })
    );

    perAccount.forEach((tweets) => allTweets.push(...tweets));

    const seen = new Set<string>();
    const unique = allTweets
      .sort((a, b) => (Date.parse(b.pubDate) || 0) - (Date.parse(a.pubDate) || 0))
      .filter((t) => {
        if (!t.tweetId) return false;
        if (seen.has(t.tweetId)) return false;
        seen.add(t.tweetId);
        return true;
      })
      .slice(0, limit);

    cache = { ts: now, data: unique };
    return new Response(JSON.stringify(unique), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

