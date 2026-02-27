# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

Situation Monitor is a real-time geopolitical intelligence dashboard built with **Vite 7 + React 19 + Tailwind CSS 4**. It renders an interactive Leaflet map with conflict zones, military bases, live news feeds, market data, and more. The frontend is the only required service; Supabase Edge Functions are optional (the app degrades gracefully without them).

### Common Commands

See `package.json` scripts:
- `npm run dev` — starts Vite dev server at `http://localhost:5173`
- `npm run build` — production build to `dist/`
- `npm run lint` — runs ESLint (note: the codebase has pre-existing lint errors)
- `npm run preview` — serves the production build locally

### Case-Sensitivity Symlink

The codebase was developed on macOS (case-insensitive FS). On Linux, `src/components/UIOverlay.jsx` imports from `./panels` but the directory is `Panels` (uppercase). A symlink `src/components/panels -> Panels` is committed to resolve this. If the symlink is missing, both `npm run build` and `npm run dev` will fail with a module resolution error.

### Environment Variables

Optional. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable Supabase-dependent features (HoloCall AI reactions, server-side Twitter intel, server-side market data). The app works without these — features degrade gracefully to CORS proxies, static data, and hardcoded quotes.

### No External Services Required

No database, Docker, or external services are needed to run the frontend dev server. All data is fetched live from public APIs (RSS feeds, USGS, CoinGecko, etc.) via CORS proxies when Supabase is not configured.
