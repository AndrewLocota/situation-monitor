type MarketItem = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline?: number[];
};

type SectorItem = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

type CommodityItem = {
  symbol: string;
  name: string;
  price: number;
  change: number;
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

const INDEX_SYMBOLS = ['SPY', 'QQQ', '^VIX', 'IWM'];
const SECTOR_SYMBOLS = [
  { symbol: 'XLK', name: 'Tech' },
  { symbol: 'XLF', name: 'Finance' },
  { symbol: 'XLE', name: 'Energy' },
  { symbol: 'XLV', name: 'Health' },
  { symbol: 'XLY', name: 'Consumer' },
  { symbol: 'XLI', name: 'Industrial' },
  { symbol: 'XLB', name: 'Materials' },
  { symbol: 'XLU', name: 'Utilities' },
  { symbol: 'XLP', name: 'Staples' },
  { symbol: 'XLRE', name: 'Real Est' },
  { symbol: 'XLC', name: 'Comms' },
  { symbol: 'SMH', name: 'Semis' },
];
const COMMODITY_SYMBOLS = [
  { symbol: 'GC=F', name: 'Gold', display: 'GOLD' },
  { symbol: 'SI=F', name: 'Silver', display: 'SILVER' },
  { symbol: 'CL=F', name: 'Crude Oil', display: 'OIL' },
  { symbol: 'NG=F', name: 'Natural Gas', display: 'NATGAS' },
  { symbol: 'HG=F', name: 'Copper', display: 'COPPER' },
];

async function fetchJsonWithTimeout(url: string, timeoutMs: number): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json, */*',
        'User-Agent': 'situation-monitor/1.0 (supabase-edge)',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getChartUrl(symbol: string, interval = '5m', range = '1d'): string {
  const encoded = encodeURIComponent(symbol);
  return `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=${encodeURIComponent(interval)}&range=${encodeURIComponent(range)}`;
}

async function fetchIndex(symbol: string): Promise<MarketItem | null> {
  const data = await fetchJsonWithTimeout(getChartUrl(symbol, '5m', '1d'), 9000);
  const quote = data?.chart?.result?.[0];
  const meta = quote?.meta;
  if (!meta) return null;

  const price = toFiniteNumber(meta.regularMarketPrice, 0);
  const reference = toFiniteNumber(meta.previousClose ?? meta.chartPreviousClose ?? meta.regularMarketOpen ?? price, price);
  const change = price - reference;
  const changePercent = reference > 0 ? (change / reference) * 100 : 0;

  const closes: number[] = (quote?.indicators?.quote?.[0]?.close || [])
    .map((v: unknown) => toFiniteNumber(v, NaN))
    .filter((v: number) => Number.isFinite(v));

  const sparkline = closes.length > 0 ? closes.slice(Math.max(0, closes.length - 32)) : undefined;

  return {
    symbol: symbol === '^VIX' ? 'VIX' : symbol,
    name: String(meta.shortName || symbol),
    price,
    change,
    changePercent,
    sparkline,
  };
}

async function fetchSimpleQuote(symbol: string, interval = '1d', range = '1d'): Promise<{ meta: any } | null> {
  const data = await fetchJsonWithTimeout(getChartUrl(symbol, interval, range), 9000);
  const quote = data?.chart?.result?.[0];
  if (!quote?.meta) return null;
  return { meta: quote.meta };
}

let cache: { ts: number; indices?: MarketItem[]; sectors?: SectorItem[]; commodities?: CommodityItem[] } | null = null;
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
  if (!cache) cache = { ts: 0 };

  const url = new URL(req.url);
  const kind = (url.searchParams.get('kind') || 'indices').toLowerCase();

  try {
    if (now - cache.ts > CACHE_TTL_MS) {
      cache.ts = now;
      cache.indices = undefined;
      cache.sectors = undefined;
      cache.commodities = undefined;
    }

    if (kind === 'indices') {
      if (!cache.indices) {
        const items = await Promise.allSettled(INDEX_SYMBOLS.map((s) => fetchIndex(s)));
        cache.indices = items
          .filter((r): r is PromiseFulfilledResult<MarketItem | null> => r.status === 'fulfilled')
          .map((r) => r.value)
          .filter((v): v is MarketItem => v !== null);
      }
      return new Response(JSON.stringify(cache.indices), { status: 200, headers: corsHeaders });
    }

    if (kind === 'sectors') {
      if (!cache.sectors) {
        const items = await Promise.allSettled(
          SECTOR_SYMBOLS.map(async (s) => {
            const quote = await fetchSimpleQuote(s.symbol, '1d', '1d');
            if (!quote) return null;
            const meta = quote.meta;
            const price = toFiniteNumber(meta.regularMarketPrice, 0);
            const prev = toFiniteNumber(meta.previousClose ?? meta.chartPreviousClose ?? price, price);
            const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
            return {
              symbol: s.symbol,
              name: s.name,
              price,
              change,
            };
          })
        );

        cache.sectors = items
          .filter((r): r is PromiseFulfilledResult<SectorItem | null> => r.status === 'fulfilled')
          .map((r) => r.value)
          .filter((v): v is SectorItem => v !== null);
      }
      return new Response(JSON.stringify(cache.sectors), { status: 200, headers: corsHeaders });
    }

    if (kind === 'commodities') {
      if (!cache.commodities) {
        const items = await Promise.allSettled(
          COMMODITY_SYMBOLS.map(async (c) => {
            const quote = await fetchSimpleQuote(c.symbol, '1d', '1d');
            if (!quote) return null;
            const meta = quote.meta;
            const price = toFiniteNumber(meta.regularMarketPrice, 0);
            const prev = toFiniteNumber(meta.previousClose ?? meta.chartPreviousClose ?? price, price);
            const change = prev > 0 ? ((price - prev) / prev) * 100 : 0;
            return {
              symbol: c.display,
              name: c.name,
              price,
              change,
            };
          })
        );

        cache.commodities = items
          .filter((r): r is PromiseFulfilledResult<CommodityItem | null> => r.status === 'fulfilled')
          .map((r) => r.value)
          .filter((v): v is CommodityItem => v !== null);
      }
      return new Response(JSON.stringify(cache.commodities), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'Invalid kind. Use kind=indices|sectors|commodities' }), {
      status: 400,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});

