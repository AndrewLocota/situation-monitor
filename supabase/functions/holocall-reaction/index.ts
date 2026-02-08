type ReactionRequest = {
  characterId?: string;
  characterName?: string;
  prompt?: string;
  newsTitle?: string;
  newsSource?: string;
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function buildPrompt(payload: ReactionRequest): string {
  const characterName = (payload.characterName || 'Analyst').trim().slice(0, 80);
  const newsTitle = (payload.newsTitle || '').trim().slice(0, 300);
  const newsSource = (payload.newsSource || '').trim().slice(0, 120);

  const providedPrompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';
  const context = providedPrompt
    ? `Context:\n${providedPrompt.slice(0, 5200)}`
    : [
      `Headline: ${newsTitle}`,
      `Source: ${newsSource}`,
    ].join('\n');

  return [
    `You are ${characterName}.`,
    'Write in subtitle style: concise, punchy, and readable at a glance.',
    'Respond in 1-2 short sentences (max 160 characters total).',
    'Keep it grounded in the headline and avoid role-breaking text.',
    'Do not use emojis.',
    context,
  ].join('\n');
}

function stripEmojis(value: string): string {
  return value
    .replace(/[\p{Extended_Pictographic}]/gu, '')
    .replace(/[\u200D\uFE0F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clampMessage(value: string, maxChars: number): string {
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxChars) return clean;
  const sliced = clean.slice(0, maxChars);
  const lastStop = Math.max(sliced.lastIndexOf('.'), sliced.lastIndexOf('!'), sliced.lastIndexOf('?'));
  if (lastStop >= Math.floor(maxChars * 0.6)) return sliced.slice(0, lastStop + 1).trim();
  return sliced.trim();
}

async function generateWithGemini(prompt: string): Promise<{ message: string; model: string }> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('Missing GEMINI_API_KEY secret');
  }

  const model = (Deno.env.get('GEMINI_MODEL') || 'gemini-2.0-flash').trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 110,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data?.error?.message || `Gemini request failed: HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  const rawText = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part?.text || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!rawText) {
    throw new Error('Gemini returned an empty response');
  }

  const cleaned = clampMessage(stripEmojis(rawText), 160);

  return {
    message: cleaned,
    model,
  };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({
        ok: true,
        service: 'holocall-reaction',
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const payload = (await req.json()) as ReactionRequest;
    const prompt = buildPrompt(payload);
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt or headline context' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await generateWithGemini(prompt);
    return new Response(
      JSON.stringify({
        message: result.message,
        model: result.model,
        provider: 'gemini',
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown server error',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
