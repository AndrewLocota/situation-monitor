# Supabase Edge Setup

This project uses Supabase Edge Functions to provide a small backend for a GitHub Pages (static) frontend.

## 1) Frontend env (safe to expose)

Create `.env.local` from `.env.example`:

```bash
VITE_SUPABASE_URL=https://ybadbizzbplylliqxxeu.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
```

Do not put server secrets in `VITE_*`.

## 2) Install and authenticate Supabase CLI

```bash
supabase login
supabase link --project-ref ybadbizzbplylliqxxeu
```

## 3) Set server-side secrets

```bash
supabase secrets set GEMINI_API_KEY=your_rotated_gemini_key --project-ref ybadbizzbplylliqxxeu
supabase secrets set ALLOWED_ORIGINS=https://andrewlocota.github.io,http://localhost:5173 --project-ref ybadbizzbplylliqxxeu
```

Optional for later:

```bash
supabase secrets set ACLED_API_KEY=your_acled_key --project-ref ybadbizzbplylliqxxeu
supabase secrets set ACLED_EMAIL=your_acled_email --project-ref ybadbizzbplylliqxxeu
```

## 4) Deploy functions

Deploy with JWT verification disabled (current app has no user auth session):

```bash
supabase functions deploy holocall-reaction --project-ref ybadbizzbplylliqxxeu --no-verify-jwt
supabase functions deploy twitter-intel --project-ref ybadbizzbplylliqxxeu --no-verify-jwt
supabase functions deploy market-data --project-ref ybadbizzbplylliqxxeu --no-verify-jwt
```

## 5) Verify health endpoint

```bash
curl -i https://ybadbizzbplylliqxxeu.supabase.co/functions/v1/holocall-reaction
curl -i "https://ybadbizzbplylliqxxeu.supabase.co/functions/v1/twitter-intel?limit=5"
curl -i "https://ybadbizzbplylliqxxeu.supabase.co/functions/v1/market-data?kind=indices"
```
