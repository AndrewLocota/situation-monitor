# Situation Monitor Gem - Enhancement Plan
**Production Platform Enhancement Strategy**
**Date:** January 10, 2026
**Goal:** Transform Gem into a best-in-class geopolitical intelligence platform, surpassing Claude version capabilities

---

## 🎯 Implementation Progress Tracker

### ✅ Completed (January 10, 2026)
- [x] **Phase 5.1:** Theatre Navigation Buttons - Added compact 3-letter codes (GLB, EUR, MDE, PAC, AFR, AME) in header
- [x] **Phase 6.1:** Map Layers Toggle Panel - Created hover-based accordion with slideDown animation
- [x] **Phase 6.2:** Layer Toggle Functionality - All existing layers dynamically control map markers
- [x] **Phase 6.3:** Day/Night Layer Infrastructure - Added to mapStore, ready for rendering implementation
- [x] **Phase 6.4:** Territorial Control Zones - Sudan/Myanmar/Syria faction control overlays (low-opacity polygons)
- [x] **Phase 6.5:** Live Control Zone Data - Created fetcher with ACLED API integration, 6hr cache, circuit breaker protection
- [x] **Phase 1.2:** Nuclear Facilities Layer - Added pulsing orange markers (Natanz, Fordow, Yongbyon, Dimona, Zaporizhzhia)
- [x] **Phase 1.2:** Cyber Threat Zones Layer - Added red pulsing markers for APT28/29, APT41, Lazarus, APT33/35
- [x] **Phase 1.2:** Frontlines Layer - Ukraine (live ISW), Sudan (SAF vs RSF), Myanmar (Tatmadaw vs PDF/EAO) with layer toggle
- [x] **Phase 1.2:** Undersea Cables Layer - 6 major transoceanic fiber optic cables (SEA-ME-WE 3, FLAG, TATA, Pacific Light, UNITY, MAREA)
- [x] **Phase 2.5:** Circuit Breaker Implementation - Exponential backoff prevents hammering failed API endpoints, improves console cleanliness and performance
- [x] **ASCIIBox Assessment:** Confirmed Gem already has superior ASCIIBox component (no migration needed)
- [x] **News Ticker:** Live scrolling headlines in footer-right, grey text, pause on hover, mobile-hidden
- [x] **Header Integration:** Fixed MusicPlayer positioning, integrated as prop
- [x] **UI Polish:** Removed emojis from all buttons (theatre nav, layers), professional compact design
- [x] **Accordion Animation:** Implemented smooth slideDown/fade animation for layers panel

### ✅ Completed (February 7, 2026)
- [x] **Phase 7.2:** Twitter Intel Multi-Source - Implemented 5 OSINT accounts (@WarMonitors, @OSINTdefender, @Conflicts, @IntelCrab, @sentaboringtweet) with 5 RSS proxy fallbacks and health tracking
- [x] **Phase 7.2:** Twitter Auto-Refresh - Enabled 5-minute refresh interval for Twitter intel with circuit breaker protection
- [x] **Phase 7.4:** Twitter Map Markers - Added geolocated tweets to map with 𝕏 icon and @username badge, popup with tweet content
- [x] **Phase 7.3:** Twitter Panel Lazy Loading - Initial 10 tweets, auto-expand to 25, scroll-to-load-more, compact styling (340px max height)
- [x] **Phase 1.2:** Ukraine Frontline Fallback - Added 9-segment static fallback when ISW API requires authentication (Kharkiv to Crimea border)
- [x] **Phase 4.1:** Conflict Zones Update - Updated to 10 conflicts with current Feb 2026 data:
  - Added: DRC Eastern Conflict (M23/Goma), Sahel Insurgency (JNIM/Wagner), Haiti Crisis (gang control), Lebanon/Israel Border
  - Updated: Ukraine, Gaza, Sudan, Myanmar, Taiwan Strait, Yemen with current figures
- [x] **Performance:** Theatre Polygon Optimization - Memoized positions with useMemo, added canvas renderer for smooth zooming
- [x] **Performance:** Code Splitting - Main bundle reduced from 513KB to 342KB (33% reduction) via manual chunks (vendor-map, vendor-react, vendor-viz, vendor-motion, vendor-media, vendor-ui)
- [x] **Performance:** Build Target ES2020 - Smaller bundle, disabled source maps in production

### 🔄 In Progress
- [ ] None currently

### ⚠️ Layer Implementation Notes
**Working Layers (with map data):**
- Military Bases (16 locations) ✅
- Nuclear Facilities (5 locations) ✅
- Cyber Threat Zones (4 APT groups) ✅
- Shipping Chokepoints (6 locations) ✅
- Conflict Zones (6 active conflicts) ✅
- Active Frontlines (Ukraine live ISW, Sudan 4 fronts, Myanmar 5 fronts) ✅
- Undersea Cables (6 major transoceanic routes) ✅
- **Territorial Control Zones (16 zones across 4 conflicts)** ✅
  - **Sudan** (3 zones): RSF Darfur, SAF East, Contested Kordofan
  - **Myanmar** (4 zones): Junta Central, AA Rakhine, 3BHA Shan, PDF Northwest
  - **Syria** (3 zones): HTS/Interim Gov (60%+), SDF/Kurdish AANES (27.8%), Turkey/SNA North
  - **Yemen** (3 zones): Houthis North (33%), Government South/East (52%+), Tareq Saleh West (5%)
  - **Live updates**: 6hr refresh cycle, ACLED/LiveUAMap/ISW integration framework ready
  - **Detail level**: More coordinate points, precise territorial percentages, recent events (STC dissolution Jan 9, Assad fall Dec 2024)

**Placeholder Layers (no data yet):**
- Earthquakes - needs data implementation
- Population Density - needs overlay implementation
- Sanctions - needs data implementation
- Day/Night Cycle - needs rendering implementation

### 📋 Upcoming (Critical Path)
- [ ] Add publisher logos to news markers (bottom-right corner, half height)
- [ ] Implement day/night cycle visualization (Phase 6.3 - rendering)
- [x] ~~Fix Twitter intel with multi-source fallback~~ ✅ Completed Feb 7
- [ ] Deploy backend RSS aggregation server
- [ ] Phase 10: AI Character Reactions (MGS Holo-Call System) - See below

### Supabase Backend Notes (For Later)
- [ ] ACLED integration should use Supabase Edge Function secrets (not frontend `VITE_*` env vars)
- [ ] Add secret: `ACLED_API_KEY`
- [ ] Add secret: `ACLED_EMAIL`
- [ ] Route control zone ACLED calls through Supabase so credentials never ship to the browser

### 🆕 Phase 10: AI Character Reactions (MGS Holo-Call System)
**Priority: HIGH | Status: Ready to Implement**

When users click on news items, an AI (Gemini) generates reactions from celebrities/politicians. Visual: MGS-style holo-call box in top right corner with stop-motion animation.

**Implementation Steps:**
1. Create character profiles data structure (`/data/characters.js`)
   - Start with Trump (bombastic, hyperbolic, "America First" worldview)
   - Speech patterns, vocabulary, recent context
   - Portrait frames for stop-motion animation

2. Build Gemini API integration (`/services/api/geminiService.js`)
   - Prompt engineering for character voice
   - Short responses (1 sentence max, off-hand comments)
   - Context injection (news headline + character profile)

3. Create HoloCallBox component (`/components/HoloCallBox.jsx`)
   - Fixed position top-right corner
   - MGS codec-style visual design (green/blue scanlines, static effect)
   - Stop-motion portrait animation (4-5 frames, 150ms intervals)
   - Audio: codec beep on open/close

4. Wire up news click → Gemini → HoloCallBox
   - Trigger on news item click
   - Loading state with "INCOMING TRANSMISSION" text
   - Display character reaction with portrait

5. Future enhancements:
   - Voice synthesis (ElevenLabs or similar)
   - Multiple characters (Putin, Zelensky, Xi, Biden, Musk)
   - Character selection dropdown

---

## Executive Summary

This plan outlines a comprehensive roadmap to enhance our production situation-monitorGem platform by:
1. Migrating missing features from the Claude test version
2. Implementing advanced Palantir-inspired UI capabilities
3. Optimizing news API performance for faster loading
4. Building a dynamic video intelligence system
5. Ensuring minimum content density across all theatres
6. Adding theatre navigation controls to header
7. Implementing comprehensive map mode layers
8. Fixing and enhancing Twitter intel integration

---

## Phase 1: Feature Parity - Claude → Gem Migration
**Priority: HIGH | Timeline: Immediate**

### 1.1 Enhanced UI Components ⭐⭐⭐
**Missing from Gem, Available in Claude:**

- **ASCIIBox Component System**
  - Standardized collapsible panel wrapper with ASCII bracket styling
  - Header customization slots for counts/badges
  - Status variants (normal, alert, warning, critical)
  - Consistent terminal aesthetic across all panels
  - **Benefit:** Unified design language, improved user experience

- **StatusBadge Component**
  - Color-coded threat level indicators
  - Size variants (small/large)
  - Levels: low, elevated, high, watch, critical
  - **Benefit:** Visual clarity for threat assessment

- **Footer Enhancement**
  - Cycling taglines with ASCII art
  - Better stats layout (news/events/quakes count)
  - Prominent LIVE indicator
  - **Benefit:** More engaging, informative interface

### 1.2 Advanced Map Features ⭐⭐⭐
**Missing from Gem:**

- **Theatre Navigation System**
  - 9 theatres vs Gem's 5 (add: Global, US Domestic, Arctic, Southeast Asia)
  - Emoji-based quick navigation buttons in header
  - Theatre history/breadcrumb trail
  - **Benefit:** Faster navigation, better global coverage

- **Nuclear Facilities Layer**
  - 11 nuclear facilities (plants, enrichment, weapons, reprocessing)
  - Status indicators (operational, construction, enrichment capacity)
  - **Benefit:** Strategic infrastructure visibility

- **Undersea Cable Layer (Enhanced)**
  - 6 major cable routes with thickness differentiation
  - Cable names and capacity data
  - Critical infrastructure monitoring
  - **Benefit:** Communications infrastructure awareness

- **Cyber Threat Regions**
  - APT group mapping (APT28/29, APT41, Lazarus, APT33/35)
  - Attribution and threat level indicators
  - **Benefit:** Digital threat landscape visibility

- **Frontline Visualization (Enhanced)**
  - Dynamic frontline rendering for all 6 conflict zones (not just Ukraine)
  - Line style differentiation (active vs stable fronts)
  - **Benefit:** Better conflict progression tracking

- **Flashback Time Control**
  - 0-24 hour historical view slider
  - Replay capability for events
  - **Benefit:** Temporal analysis of evolving situations

### 1.3 Data Panels & Integrations ⭐⭐
**Missing from Gem:**

- **MoneyPrinterPanel (Enhanced)**
  - "Printer On/Off" metaphor with visual indicator
  - Progress bar showing % of all-time max
  - Week-over-week change percentage
  - **Benefit:** Engaging financial policy visualization

- **Layoffs Panel**
  - Tech sector layoff tracking
  - Company, number affected, date, reason
  - **Benefit:** Economic sentiment indicator

- **Enhanced CongressPanel**
  - Party affiliation badges (D/R/I)
  - Trade type visual distinction (buy=green, sell=red)
  - District information
  - **Benefit:** Better insider trading transparency

- **Enhanced WhalePanel**
  - Transaction hash display
  - Blockchain scanning status
  - More detailed transaction metadata
  - **Benefit:** Crypto market intelligence depth

### 1.4 Data Architecture Improvements ⭐⭐
**Missing from Gem:**

- **TypeScript Migration**
  - Full TypeScript conversion from JavaScript
  - Type safety for stores, components, API responses
  - **Benefit:** Fewer runtime errors, better developer experience

- **Static Data Organization**
  - Separate files: conflictZones.ts, hotspots.ts, infrastructure.ts
  - Easier data maintenance
  - **Benefit:** Scalability and maintainability

- **Enhanced Conflict Data**
  - Detailed casualty counts, refugee numbers, timelines
  - Intensity levels (low, medium, high, watch)
  - Key developments tracking
  - **Benefit:** Richer contextual information

---

## Phase 2: Performance Optimization - News Loading
**Priority: HIGH | Timeline: Week 1-2**

### 2.1 Backend RSS Proxy Server ⭐⭐⭐
**Problem:** Client-side RSS fetching is slow, limited by CORS proxies, rate limits

**Solution: Deploy Dedicated RSS Aggregation Server**

**Architecture:**
- Node.js/Express backend deployed on Vercel/Railway/Fly.io (free tier)
- Server fetches RSS feeds server-side every 60 seconds
- Caches results in memory (or Redis for persistence)
- Client makes single API call to `/api/news` endpoint
- Returns pre-fetched, pre-processed JSON array

**Implementation:**
```javascript
// Backend: /api/news endpoint
app.get('/api/news', async (req, res) => {
  const category = req.query.category || 'all';
  const limit = parseInt(req.query.limit) || 200;

  // Return cached news from memory
  const news = newsCache[category] || [];
  res.json(news.slice(0, limit));
});

// Background job: Fetch feeds every 60s
setInterval(async () => {
  const feeds = await fetchAllRSSFeeds();
  newsCache = processAndCategorize(feeds);
}, 60000);
```

**Benefits:**
- **10x faster loading:** Single API call vs 17 RSS feeds
- **No CORS issues:** Server-side fetching
- **Better rate limit handling:** Server manages retries
- **Pre-processed data:** Geolocation, bias ratings calculated server-side
- **Lower client bandwidth:** JSON vs XML/RSS

**Cost:** $0/month (Vercel/Railway free tier handles this workload)

### 2.2 Parallel RSS Fetching (Client-Side Fallback) ⭐⭐
**If backend not implemented:**

**Current Issue:** Sequential feed fetching (await in loop)

**Solution:**
```javascript
// Fetch all feeds in parallel with Promise.allSettled
const feedPromises = RSS_FEEDS.map(feed =>
  fetchRSSFeed(feed.url).catch(err => ({ error: true, feed }))
);

const results = await Promise.allSettled(feedPromises);
const allNews = results
  .filter(r => r.status === 'fulfilled' && !r.value.error)
  .flatMap(r => r.value.items);
```

**Benefits:**
- 3-5x faster loading
- Graceful degradation (failed feeds don't block others)

### 2.3 News Caching Strategy ⭐⭐
**Problem:** Refetching all news every 60s wastes bandwidth

**Solution: Smart Incremental Updates**
```javascript
// Only fetch feeds with new content
const lastFetchTime = localStorage.getItem('lastNewsFetch');
const shouldFetch = !lastFetchTime || Date.now() - lastFetchTime > 60000;

if (shouldFetch) {
  // Fetch only feeds likely to have updates
  const priorityFeeds = feeds.filter(f => f.updateFrequency === 'high');
  // ...
}
```

**Benefits:**
- Reduced API calls
- Lower bandwidth usage
- Faster perceived performance

### 2.4 News Preloading & Service Worker ⭐
**Advanced optimization for future:**

- Service Worker caches news data
- Pre-fetch on page load (in background)
- Offline capability
- **Benefit:** Instant load times, works offline

---

## Phase 3: Dynamic Video Intelligence System
**Priority: HIGH | Timeline: Week 2-3**

### 3.1 Video News API Integration ⭐⭐⭐
**Goal:** Automatically pull video content from conflict zones and geopolitical hotspots

**Data Sources:**

1. **YouTube Data API v3**
   - Search for recent videos by location + keywords
   - Filter by upload date (last 24-48 hours)
   - Channels: BBC News, Al Jazeera, Reuters, CNN, Sky News, DW News
   - Keywords: "Iran protests", "Gaza", "Ukraine footage", "Breaking"
   - **Cost:** Free (10,000 quota/day = ~1,000 searches)

2. **TikTok Scraping (via RapidAPI)**
   - Keyword search: "Iran", "Tehran", "Gaza", "Ukraine"
   - Geolocation-based search
   - User feeds: @skynews, @bbcnews, @aljazeera
   - **Cost:** $20/month (RapidAPI TikTok scraper)

3. **Twitter/X Video Search**
   - Alternative to our current text-only intel feed
   - Use Nitter/XCancel to find video tweets
   - Filter @WarMonitors, @OSINTdefender, @RALee85 for video posts
   - **Cost:** Free (scraping-based)

4. **Telegram Channels (via API)**
   - OSINT channels: Intel Slava Z, Rybar, UAWarInformer
   - Video posts with geolocation metadata
   - **Cost:** Free (Telegram Bot API)

**Implementation Architecture:**
```javascript
// Backend: /api/videos endpoint
app.get('/api/videos', async (req, res) => {
  const theatre = req.query.theatre; // 'middle-east', 'eastern-europe', etc.

  const videos = await Promise.all([
    fetchYouTubeVideos(theatre),
    fetchTikTokVideos(theatre),
    fetchTwitterVideos(theatre),
    fetchTelegramVideos(theatre)
  ]);

  const processed = videos.flat().map(v => ({
    id: v.id,
    source: v.platform, // 'youtube', 'tiktok', 'twitter', 'telegram'
    title: v.title,
    location: geolocateFromContent(v),
    coordinates: v.coordinates || inferCoordinates(v.location),
    thumbnail: v.thumbnail,
    embedUrl: v.embedUrl,
    uploadDate: v.date,
    views: v.views,
    relevanceScore: calculateRelevance(v, theatre)
  }));

  // Return top 20 most relevant videos per theatre
  res.json(processed.slice(0, 20));
});
```

### 3.2 Dynamic Video Marker System ⭐⭐⭐
**Replace static videoMarkers.js with dynamic system:**

**Features:**
- Auto-refresh every 5 minutes
- Theatre-specific video filtering
- Minimum 3-5 videos per theatre (from video pool)
- Video relevance scoring (recency + views + keyword match)
- Fallback to curated videos if API fails

**UI Enhancements:**
- Video thumbnail preview on marker hover
- View count badge
- "New" indicator for videos <2 hours old
- Video source badge (YouTube/TikTok/Twitter/Telegram)

### 3.3 Video Geolocation Intelligence ⭐⭐
**Problem:** Videos often lack precise coordinates

**Solution: Multi-stage Geolocation**
1. **Metadata extraction:** GPS coordinates from video file (if available)
2. **NLP keyword matching:** Parse title/description for city/location names
3. **Visual geolocation:** Use AI vision models (future enhancement)
4. **Default coordinates:** Use theatre center if no match found

**Database:**
```javascript
const locationDatabase = {
  'Tehran': { lat: 35.6892, lng: 51.3890, country: 'Iran', theatre: 'middle-east' },
  'Gaza': { lat: 31.5, lng: 34.46, country: 'Palestine', theatre: 'middle-east' },
  'Kyiv': { lat: 50.4501, lng: 30.5234, country: 'Ukraine', theatre: 'eastern-europe' },
  // ... 200+ locations
};
```

### 3.4 Video Content Moderation ⭐
**Important for production:**

- Filter graphic content (flag with warning)
- Exclude propaganda/misinformation (manual curation list)
- Age-restrict certain videos
- "Viewer discretion advised" warnings

---

## Phase 4: Content Density - Minimum 10 Nodes Per Theatre
**Priority: MEDIUM | Timeline: Week 3-4**

### 4.1 Content Distribution Strategy ⭐⭐⭐
**Goal:** Ensure every theatre has minimum 10 interactive elements

**Content Types & Target Distribution:**
| Theatre | News | Videos | Hotspots | Conflicts | Bases | Total |
|---------|------|--------|----------|-----------|-------|-------|
| Eastern Europe | 15 | 5 | 3 (Kyiv, Warsaw, Bucharest) | 1 (Ukraine) | 2 | 26 |
| Middle East | 15 | 5 | 4 (Tehran, Tel Aviv, Baghdad, Riyadh) | 3 (Gaza, Yemen, Iran tensions) | 3 | 30 |
| Indo-Pacific | 12 | 4 | 4 (Beijing, Taipei, Seoul, Tokyo) | 2 (Taiwan Strait, South China Sea) | 4 | 26 |
| Africa | 10 | 3 | 2 (Cairo, Nairobi) | 2 (Sudan, Sahel) | 1 | 18 |
| Americas | 10 | 3 | 3 (DC, Caracas, Brasilia) | 1 (Venezuela) | 2 | 19 |
| Global | 30 | 10 | 14 (all major intel hubs) | 6 (all conflicts) | 16 | 76 |
| US Domestic | 20 | 5 | 16 (US cities) | 0 | 8 (US bases) | 49 |
| Arctic | 8 | 2 | 2 (Nuuk, Murmansk) | 0 | 2 | 14 |
| Southeast Asia | 8 | 3 | 2 (Bangkok, Singapore) | 1 (Myanmar) | 1 | 15 |

### 4.2 Smart Content Filtering ⭐⭐
**Implementation:**
```javascript
// In SituationMap.jsx
const getTheatreContent = (theatre) => {
  const bounds = THEATRES[theatre].bounds;

  // Filter news markers within bounds
  const theatreNews = newsMarkers.filter(m =>
    isWithinBounds(m.coordinates, bounds)
  );

  // If less than minimum, add nearby content
  if (theatreNews.length < 10) {
    const nearbyNews = findNearbyNews(bounds, 10 - theatreNews.length);
    theatreNews.push(...nearbyNews);
  }

  // Same for videos, hotspots, etc.
  return {
    news: theatreNews,
    videos: getTheatreVideos(theatre),
    hotspots: getTheatreHotspots(theatre),
    // ...
  };
};
```

### 4.3 Fallback Content Strategy ⭐⭐
**If real-time content is sparse:**

1. **Curated Content Pool:** Maintain hand-picked news/videos for each theatre
2. **Historical Events:** Show significant past events (e.g., "6 months since...")
3. **Static POIs:** Add permanent points of interest (capitals, major cities, key infrastructure)
4. **Aggregated Markers:** "5 articles about Iran" cluster marker

### 4.4 Content Freshness Indicators ⭐
**Visual differentiation:**
- Fresh content (<2 hours): Bright glow, pulsing animation
- Recent content (2-12 hours): Normal opacity
- Older content (12-24 hours): Reduced opacity (50%)
- Day-old content: Minimal opacity (30%)

**Benefits:**
- Users focus on latest developments
- Map doesn't feel empty even with sparse recent news

---

## Phase 5: Theatre Navigation Controls
**Priority: HIGH | Timeline: Week 1**

### 5.1 Header Theatre Buttons ⭐⭐⭐
**Problem:** Removed polygon zoom on click, need alternative navigation

**Solution: Add Theatre Quick-Select Buttons to Header**

**Design Option A: Emoji Buttons (Palantir-style)**
```
[SITUATION MONITOR] | 🌍 Global | 🇪🇺 Europe | 🇮🇱 Middle East | 🇨🇳 Asia-Pacific | 🌍 Africa | 🌎 Americas | 🇺🇸 US | ❄️ Arctic
```

**Design Option B: Compact Code Names**
```
[SITUATION MONITOR] | [GLB] [EUR] [MDE] [APAC] [AFR] [AMER] [CONUS] [ARC]
```

**Design Option C: Icon + Text (Mobile-Friendly)**
```
Theatres: [🌍 Global] [🔥 Europe] [⚡ Mideast] [🎯 Asia] [🛡️ Africa] [📡 Americas] [🏛️ US] [❄️ Arctic]
```

**Implementation:**
```jsx
// In Header.jsx
const TheatreNav = () => {
  const { currentTheatre, setTheatre } = useMapStore();

  const theatres = [
    { id: 'global', icon: '🌍', label: 'Global' },
    { id: 'eastern-europe', icon: '🇪🇺', label: 'Europe' },
    { id: 'middle-east', icon: '🇮🇱', label: 'Mideast' },
    { id: 'indo-pacific', icon: '🇨🇳', label: 'Asia-Pac' },
    { id: 'africa', icon: '🌍', label: 'Africa' },
    { id: 'americas', icon: '🌎', label: 'Americas' },
    { id: 'us-domestic', icon: '🇺🇸', label: 'US' },
    { id: 'arctic', icon: '❄️', label: 'Arctic' },
  ];

  return (
    <div className="theatre-nav">
      {theatres.map(t => (
        <button
          key={t.id}
          className={`theatre-btn ${currentTheatre === t.id ? 'active' : ''}`}
          onClick={() => setTheatre(t.id)}
        >
          <span className="icon">{t.icon}</span>
          <span className="label">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
```

**Styling:**
```css
.theatre-nav {
  display: flex;
  gap: 4px;
  border-left: 1px solid var(--accent);
  padding-left: 16px;
  margin-left: 16px;
}

.theatre-btn {
  background: rgba(77, 166, 255, 0.1);
  border: 1px solid rgba(77, 166, 255, 0.3);
  color: var(--accent);
  padding: 4px 12px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'SF Mono', monospace;
}

.theatre-btn:hover {
  background: rgba(77, 166, 255, 0.2);
  box-shadow: 0 0 10px rgba(77, 166, 255, 0.5);
}

.theatre-btn.active {
  background: var(--accent);
  color: #000;
  box-shadow: 0 0 15px rgba(77, 166, 255, 0.8);
}

/* Mobile: Compact mode */
@media (max-width: 1200px) {
  .theatre-btn .label { display: none; }
  .theatre-btn .icon { font-size: 16px; }
}
```

### 5.2 Breadcrumb Trail ⭐⭐
**Show navigation history:**
```
Home > Eastern Europe > Ukraine Conflict
```

**Benefits:**
- Users can backtrack
- Shows context hierarchy

### 5.3 Keyboard Shortcuts ⭐
**Add hotkeys for theatre switching:**
- `1-9`: Jump to theatre 1-9
- `G`: Go to global view
- `Tab`: Cycle through theatres
- `Shift+Tab`: Reverse cycle

---

## Phase 6: Map Mode Layers System
**Priority: HIGH | Timeline: Week 2-3**

### 6.1 Comprehensive Layer Toggle Panel ⭐⭐⭐
**Goal:** Show/hide infrastructure, bases, power blocs, undersea cables, earthquakes, day/night cycle, and more

**Layer Categories:**

#### **A. Infrastructure Layers**
- ✅ Military Bases (already exists)
- ✅ Nuclear Facilities (migrate from Claude)
- ✅ Undersea Cables (already exists, enhance with names)
- 🆕 Power Plants (coal, gas, hydro, solar farms)
- 🆕 Oil/Gas Pipelines (Nord Stream, Druzhba, Trans-Adriatic)
- 🆕 Major Airports (international hubs)
- 🆕 Seaports (container terminals, naval bases)
- 🆕 Data Centers (major cloud infrastructure)
- 🆕 Satellite Ground Stations

#### **B. Geopolitical Layers**
- 🆕 Power Blocs (NATO, BRICS, EU, ASEAN, AU, Arab League)
  - Color-coded country fills
  - Boundary highlighting
  - Member state labels
- 🆕 Military Alliances (5 Eyes, Quad, AUKUS)
- 🆕 Economic Unions (USMCA, Mercosur, RCEP)
- 🆕 Sanctions Regimes (countries under sanctions)
- 🆕 No-Fly Zones (Syria, Libya, Ukraine)
- 🆕 Exclusive Economic Zones (maritime boundaries)

#### **C. Military & Conflict Layers**
- ✅ Conflict Zones (already exists)
- ✅ Shipping Chokepoints (already exists)
- 🆕 Active Military Operations (ongoing deployments)
- 🆕 Weapons Systems Range Circles (missile defense, A2/AD bubbles)
- 🆕 Air Defense Networks (S-400, Patriot coverage)
- 🆕 Naval Task Forces (carrier strike groups)
- 🆕 Forward Operating Bases (temporary/expeditionary)

#### **D. Natural & Environmental Layers**
- ✅ Earthquakes (already exists)
- 🆕 Day/Night Cycle (solar terminator line)
- 🆕 Weather Overlays (storms, temperature)
- 🆕 Wildfire Hotspots (FIRMS satellite data)
- 🆕 Volcanic Activity (active volcanoes, eruption alerts)
- 🆕 Drought/Flood Zones (climate stress indicators)

#### **E. Economic & Trade Layers**
- 🆕 Major Trade Routes (shipping lanes)
- 🆕 Resource Deposits (oil fields, rare earth mines, lithium)
- 🆕 Manufacturing Hubs (semiconductor fabs, auto plants)
- 🆕 Financial Centers (stock exchanges, central banks)

#### **F. Cyber & Information Layers**
- 🆕 Internet Backbone Nodes (IXPs, peering points)
- 🆕 Cyber Attack Origins (live DDoS map integration)
- 🆕 Social Media Censorship (internet freedom scores)
- 🆕 Surveillance Infrastructure (known monitoring facilities)

### 6.2 Layer Control Panel UI ⭐⭐⭐
**Design: Collapsible Layer Menu**

**Position:** Top-right corner of map (or dedicated button in header)

**Layout:**
```
┌─[MAP LAYERS]─────────────────┐
│ INFRASTRUCTURE               │
│ ☑ Military Bases             │
│ ☑ Nuclear Facilities         │
│ ☑ Undersea Cables           │
│ ☐ Power Plants              │
│ ☐ Pipelines                 │
│ ☐ Airports                  │
│ ☐ Seaports                  │
│                              │
│ GEOPOLITICAL                 │
│ ☐ Power Blocs (NATO/BRICS)  │
│ ☐ Military Alliances         │
│ ☐ Economic Unions            │
│ ☐ Sanctions                  │
│                              │
│ MILITARY & CONFLICT          │
│ ☑ Conflict Zones             │
│ ☑ Chokepoints                │
│ ☐ Weapon Ranges              │
│ ☐ Air Defense                │
│                              │
│ NATURAL & ENVIRONMENT        │
│ ☑ Earthquakes                │
│ ☑ Day/Night Cycle            │
│ ☐ Weather                    │
│ ☐ Wildfires                  │
│                              │
│ CYBER & INFORMATION          │
│ ☐ Internet Backbone          │
│ ☐ Cyber Attacks              │
│                              │
│ [Select All] [Clear All]     │
│ [Save Preset]                │
└──────────────────────────────┘
```

**Implementation:**
```jsx
// LayerControlPanel.jsx
const LayerControlPanel = () => {
  const { layers, toggleLayer, setLayers } = useMapStore();

  const layerGroups = [
    {
      name: 'Infrastructure',
      layers: [
        { id: 'bases', label: 'Military Bases', icon: '🏛️' },
        { id: 'nuclear', label: 'Nuclear Facilities', icon: '☢️' },
        { id: 'cables', label: 'Undersea Cables', icon: '🔌' },
        { id: 'power', label: 'Power Plants', icon: '⚡' },
        { id: 'pipelines', label: 'Oil/Gas Pipelines', icon: '🛢️' },
        { id: 'airports', label: 'Major Airports', icon: '✈️' },
        { id: 'ports', label: 'Seaports', icon: '⚓' },
      ]
    },
    {
      name: 'Geopolitical',
      layers: [
        { id: 'blocs', label: 'Power Blocs', icon: '🌐' },
        { id: 'alliances', label: 'Military Alliances', icon: '🤝' },
        { id: 'unions', label: 'Economic Unions', icon: '💼' },
        { id: 'sanctions', label: 'Sanctions', icon: '🚫' },
      ]
    },
    {
      name: 'Military & Conflict',
      layers: [
        { id: 'conflicts', label: 'Conflict Zones', icon: '⚔️' },
        { id: 'chokepoints', label: 'Chokepoints', icon: '🚢' },
        { id: 'weapons', label: 'Weapon Ranges', icon: '🎯' },
        { id: 'airdefense', label: 'Air Defense', icon: '🛡️' },
      ]
    },
    {
      name: 'Natural & Environment',
      layers: [
        { id: 'earthquakes', label: 'Earthquakes', icon: '📊' },
        { id: 'daynight', label: 'Day/Night Cycle', icon: '🌓' },
        { id: 'weather', label: 'Weather', icon: '⛈️' },
        { id: 'wildfires', label: 'Wildfires', icon: '🔥' },
      ]
    },
    {
      name: 'Cyber & Information',
      layers: [
        { id: 'internet', label: 'Internet Backbone', icon: '🌐' },
        { id: 'cyberattacks', label: 'Cyber Attacks', icon: '💻' },
      ]
    },
  ];

  return (
    <div className="layer-control-panel">
      <div className="panel-header">MAP LAYERS</div>
      {layerGroups.map(group => (
        <div key={group.name} className="layer-group">
          <div className="group-header">{group.name}</div>
          {group.layers.map(layer => (
            <label key={layer.id} className="layer-toggle">
              <input
                type="checkbox"
                checked={layers[layer.id]}
                onChange={() => toggleLayer(layer.id)}
              />
              <span className="icon">{layer.icon}</span>
              <span className="label">{layer.label}</span>
            </label>
          ))}
        </div>
      ))}
      <div className="panel-actions">
        <button onClick={() => setLayers('all')}>Select All</button>
        <button onClick={() => setLayers('none')}>Clear All</button>
        <button onClick={savePreset}>Save Preset</button>
      </div>
    </div>
  );
};
```

### 6.3 Day/Night Cycle Implementation ⭐⭐⭐
**One of the most visually striking features**

**Concept:** Show real-time solar terminator line (boundary between day/night on Earth)

**Data Source:**
- **SunCalc.js** library (calculates sun position)
- Update every 5 minutes (sun position changes slowly)

**Implementation:**
```javascript
import SunCalc from 'suncalc';

const DayNightLayer = () => {
  const [terminator, setTerminator] = useState(null);

  useEffect(() => {
    const updateTerminator = () => {
      const now = new Date();
      const points = [];

      // Calculate terminator line (90° away from sun)
      for (let lat = -90; lat <= 90; lat += 2) {
        for (let lng = -180; lng <= 180; lng += 2) {
          const sunPos = SunCalc.getPosition(now, lat, lng);
          // Sun altitude < 0 = nighttime
          if (Math.abs(sunPos.altitude) < 0.1) { // Near horizon
            points.push([lat, lng]);
          }
        }
      }

      setTerminator(points);
    };

    updateTerminator();
    const interval = setInterval(updateTerminator, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <Polygon
      positions={terminator}
      pathOptions={{
        color: 'rgba(0, 0, 0, 0.5)',
        fillOpacity: 0.3,
      }}
    />
  );
};
```

**Visual Enhancements:**
- Night side: Dark blue/purple overlay (30% opacity)
- Day side: Normal map colors
- Terminator line: Gradient from blue to orange (twilight effect)
- Add sun/moon icons at their current positions

**Benefits:**
- Stunning visual effect
- Contextual awareness (e.g., "It's 2 AM in Tehran right now")
- Helps understand timing of events

### 6.4 Power Blocs Visualization ⭐⭐⭐
**Show geopolitical alignments**

**Data:**
```javascript
const powerBlocs = {
  nato: {
    name: 'NATO',
    color: '#4169E1', // Royal Blue
    countries: ['USA', 'CAN', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'POL', 'TUR', ...],
  },
  brics: {
    name: 'BRICS',
    color: '#FFD700', // Gold
    countries: ['BRA', 'RUS', 'IND', 'CHN', 'ZAF', 'EGY', 'ETH', 'IRN', 'ARE', ...],
  },
  eu: {
    name: 'European Union',
    color: '#003399', // EU Blue
    countries: ['FRA', 'DEU', 'ITA', 'ESP', 'NLD', 'BEL', 'AUT', ...],
  },
  // ... more blocs
};
```

**Rendering:**
- Use GeoJSON country boundaries
- Fill countries with bloc color (20% opacity)
- Border countries with bloc color (80% opacity, thicker)
- Label on hover: "France - NATO, EU"

**Overlay Mode:**
- Toggle to show bloc membership overlays
- Multiple memberships: gradient fill (e.g., France = NATO + EU)

### 6.5 Weapon Range Circles ⭐⭐
**Show strategic weapons capabilities**

**Examples:**
- Russia S-400 air defense (400km radius)
- China DF-21 anti-ship missile (1,500km)
- US Patriot systems (160km)
- Iran Shahab-3 missile range (2,000km)

**Implementation:**
```javascript
const weaponRanges = [
  {
    name: 'Kaliningrad S-400',
    location: [54.7104, 20.4522],
    range: 400, // km
    type: 'air-defense',
    color: '#FF0000',
    country: 'Russia',
  },
  // ...
];

// Render as circles
<Circle
  center={weapon.location}
  radius={weapon.range * 1000} // Convert km to meters
  pathOptions={{
    color: weapon.color,
    fillOpacity: 0.1,
    dashArray: '5, 10',
  }}
/>
```

**Visual:**
- Dashed circle boundaries
- Color-coded by type (red=offensive, blue=defensive, yellow=dual)
- Tooltip shows weapon system details

---

## Phase 7: Twitter Intel Enhancement
**Priority: HIGH | Timeline: Week 2**

### 7.1 Current System Analysis ⭐⭐⭐
**Existing Implementation:**
- Uses XCancel/Nitter/RSSHub as Twitter scrapers
- Fetches @WarMonitors feed via RSS
- Limited to 25 recent tweets
- No real-time updates (2-minute refresh)
- Scraping-based (fragile, depends on third-party services)

**Problems:**
1. **Unreliable:** XCancel/Nitter instances often go down
2. **Delayed:** RSS feeds lag 5-10 minutes behind live tweets
3. **Single source:** Only @WarMonitors
4. **Limited data:** No images, videos, or engagement metrics
5. **No filtering:** Can't filter by keyword, location, or priority

### 7.2 Improved Twitter Intel System ⭐⭐⭐
**Solution: Multi-Source OSINT Aggregation**

**Approach A: Use Multiple Scraping Sources (Free, Medium Reliability)**

**Data Sources:**
1. **Nitter Instances** (multiple fallback domains)
   - nitter.net, nitter.poast.org, nitter.privacydev.net
   - RSS feeds for user timelines
   - Rotate instances on failure

2. **ScoutAPI** (affordable Twitter scraper)
   - $20/month for 10,000 requests
   - User timeline endpoint
   - Search endpoint (keywords)
   - More reliable than free scrapers

3. **Apify Twitter Scraper**
   - $49/month for 50,000 results
   - Full tweet data (media, engagement, location)
   - Actor API integration

4. **RapidAPI Twitter Alternatives**
   - Twitter API v2 Alternative ($15/month)
   - Tweet Scraper API ($10/month)
   - Multiple fallback options

**Approach B: Official Twitter API (Expensive, Most Reliable)**
- **Twitter API Basic:** $100/month
  - 10,000 tweets/month read
  - User timeline access
  - Search recent (7 days)
- **Twitter API Pro:** $5,000/month (not feasible)

**Recommended: Approach A (ScoutAPI + Nitter Fallback)**

**Implementation:**
```javascript
// services/api/twitterIntel.js
const TWITTER_SOURCES = [
  {
    name: 'ScoutAPI',
    url: 'https://api.scoutapi.com/twitter/timeline',
    priority: 1,
    rateLimit: 10000, // per month
  },
  {
    name: 'Nitter (Primary)',
    url: 'https://nitter.poast.org',
    priority: 2,
    rateLimit: Infinity, // Free but unreliable
  },
  {
    name: 'Nitter (Fallback 1)',
    url: 'https://nitter.privacydev.net',
    priority: 3,
    rateLimit: Infinity,
  },
  // ...
];

export const fetchTwitterIntel = async (username = 'WarMonitors') => {
  for (const source of TWITTER_SOURCES) {
    try {
      const tweets = await fetchFromSource(source, username);
      if (tweets && tweets.length > 0) {
        console.log(`✓ Twitter intel from ${source.name}`);
        return processTweets(tweets);
      }
    } catch (err) {
      console.warn(`✗ ${source.name} failed, trying next...`);
      continue; // Try next source
    }
  }

  throw new Error('All Twitter sources failed');
};

const processTweets = (tweets) => {
  return tweets.map(t => ({
    id: t.id,
    text: t.text,
    author: t.author,
    timestamp: new Date(t.created_at),
    images: t.media?.filter(m => m.type === 'photo'),
    videos: t.media?.filter(m => m.type === 'video'),
    location: geolocateFromTweet(t),
    coordinates: extractCoordinates(t),
    engagement: {
      likes: t.favorite_count,
      retweets: t.retweet_count,
      replies: t.reply_count,
    },
    url: `https://twitter.com/${t.author}/status/${t.id}`,
  }));
};
```

### 7.3 Enhanced Twitter Intel Panel ⭐⭐⭐
**UI Improvements:**

**Current:**
```
[Twitter Intel]
• Tweet text
  2 hours ago
```

**Enhanced:**
```
┌─[TWITTER INTEL]─────────────────────────[●●○○] 25/100─┐
│                                                        │
│ 🔴 @WarMonitors · 12min ago · 🔥 High Priority        │
│ BREAKING: Multiple explosions reported in Tehran      │
│ near IRGC headquarters. Videos show smoke rising.     │
│ [📷 2 images] [🎥 1 video] [📍 Tehran, Iran]          │
│ ❤️ 1.2K  🔁 450  💬 120                                │
│ [View on Map] [Open Tweet]                            │
│                                                        │
│ 🟡 @OSINTdefender · 25min ago · Medium Priority       │
│ Ukrainian forces report gains near Bakhmut...         │
│ [📍 Bakhmut, Ukraine] ❤️ 850  🔁 320                   │
│                                                        │
│ 🟢 @RALee85 · 1hr ago · Analysis                      │
│ Thread on latest Russian force deployments...         │
│                                                        │
│ [Filter by Priority] [Show Media Only] [Refresh]      │
└────────────────────────────────────────────────────────┘
```

**Features:**
1. **Priority Indicators:**
   - 🔴 High: Breaking news, urgent events
   - 🟡 Medium: Significant updates
   - 🟢 Low: Analysis, commentary
   - Algorithm: keyword-based + engagement rate

2. **Media Previews:**
   - Thumbnail images in panel
   - Click to open in lightbox
   - Video play buttons

3. **Engagement Metrics:**
   - Likes, retweets, replies
   - Shows tweet importance/virality

4. **Location Badges:**
   - Geolocated tweets show location
   - Click to focus map on location

5. **Multi-Source Feed:**
   - @WarMonitors (primary)
   - @OSINTdefender (conflict updates)
   - @RALee85 (Russia/Ukraine analyst)
   - @IntelCrab (OSINT aggregator)
   - @Conflicts (global conflicts)

### 7.4 Twitter-to-Map Integration ⭐⭐
**Enhance existing geolocation:**

**Current:** Text-based keyword matching
**Enhanced:** Multi-stage geolocation

**Stage 1: Coordinates from Tweet Metadata**
```javascript
const extractCoordinates = (tweet) => {
  if (tweet.coordinates) return tweet.coordinates;
  if (tweet.place) return tweet.place.bounding_box.center;
  return null;
};
```

**Stage 2: NLP Location Extraction**
```javascript
const geolocateFromTweet = (tweet) => {
  const text = tweet.text.toLowerCase();

  // Match location database (200+ entries)
  for (const [location, coords] of Object.entries(LOCATION_DB)) {
    if (text.includes(location.toLowerCase())) {
      return coords;
    }
  }

  return null;
};
```

**Stage 3: Image/Video Geolocation (Future)**
- Use AI vision models to identify landmarks
- Reverse image search for known locations

**Visualization:**
- Geolocated tweets show as markers on map
- Marker icon: 🐦 (Twitter bird)
- Click marker → show tweet in popup
- Cluster multiple tweets in same area

### 7.5 Real-Time Streaming (Advanced) ⭐
**Future enhancement: WebSocket streaming**

**If we implement backend server:**
```javascript
// Backend: WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Stream tweets in real-time
setInterval(async () => {
  const newTweets = await fetchLatestTweets();
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'tweets', data: newTweets }));
  });
}, 30000); // 30 seconds
```

**Frontend:**
```javascript
// Connect to WebSocket
const ws = new WebSocket('wss://your-backend.com');
ws.onmessage = (event) => {
  const { type, data } = JSON.parse(event.data);
  if (type === 'tweets') {
    updateTwitterIntel(data);
  }
};
```

**Benefits:**
- Near-instant updates (30s delay vs 2-5 min)
- Lower bandwidth (only new tweets sent)
- Better user experience

---

## Phase 8: Palantir-Inspired Advanced Features
**Priority: MEDIUM | Timeline: Week 4-6**

### 8.1 Timeline Scrubber ⭐⭐⭐
**Inspired by: Palantir Gotham's temporal analysis**

**Feature:** Horizontal timeline at bottom of screen, scrub through last 24 hours

**UI:**
```
[00:00]────●────────────────────────────[NOW 14:32]
       ↑
   12 hours ago
```

**Functionality:**
- Drag slider to go back in time
- News, earthquakes, tweets update to show historical state
- Play button: auto-advance through timeline
- Speed controls: 1x, 2x, 5x, 10x
- Bookmarks: Save key moments

**Data Requirements:**
- Store historical data (24h rolling window)
- Timestamp all events
- Filter data by time range

**Use Cases:**
- Replay major events (e.g., earthquake sequence)
- Understand how situation evolved
- Correlation analysis (did news spike after earthquake?)

### 8.2 Link Analysis Graph ⭐⭐
**Inspired by: Palantir's network visualization**

**Feature:** Show relationships between entities (countries, leaders, organizations, events)

**Example Graph:**
```
     [Putin] ──── leads ───→ [Russia]
        │                       │
     allied                  conflict
        │                       │
        ↓                       ↓
    [Iran] ────── supports → [Syria]
        │                       │
     enemy                   supports
        │                       │
        ↓                       ↓
   [Israel] ←─── attacks ── [Hezbollah]
```

**Implementation:**
- D3.js force-directed graph
- Entity extraction from news articles
- Relationship inference from keywords
- Interactive: click entity → filter map/news

**Data Sources:**
- GDELT Global Knowledge Graph
- Manual curation of key relationships

### 8.3 Sentiment Analysis Heatmap ⭐⭐
**Feature:** Visualize media sentiment by region

**Example:**
- Russia: 80% negative sentiment (Western media)
- China: 60% negative
- Ukraine: 90% positive
- Israel: Mixed (50/50)

**Visualization:**
- Country fill colors: Red (negative) → Yellow (neutral) → Green (positive)
- Based on aggregated news sentiment scores

**Data:**
- Use sentiment analysis API (AWS Comprehend, Google NLP)
- Or rule-based keyword scoring

### 8.4 Predictive Analytics Panel ⭐
**Inspired by: Intelligence forecasting tools**

**Feature:** Show probability forecasts for key events

**Examples:**
```
┌─[FORECASTS]──────────────────────────────┐
│ Ukraine Offensive Success (30 days)      │
│ █████████░░░░░░░░░░░░░░░░░░░░ 32%        │
│                                           │
│ Iran Nuclear Breakout (90 days)          │
│ ██████████████████████░░░░░░░░ 68%       │
│                                           │
│ Taiwan Crisis Escalation (1 year)        │
│ ████████████░░░░░░░░░░░░░░░░░ 45%        │
└───────────────────────────────────────────┘
```

**Data Sources:**
- Polymarket (already integrated)
- Metaculus forecasting platform
- Good Judgment Open
- Manual expert estimates

### 8.5 Alert System & Notifications ⭐⭐⭐
**Feature:** Proactive alerts for significant events

**Trigger Conditions:**
1. Breaking news with "BREAKING" keyword
2. Earthquake >5.0 magnitude
3. Multiple news articles about same location (spike detection)
4. Large whale transactions (>$10M)
5. Congressional trades in defense stocks before conflict
6. Nuclear facility incidents

**UI:**
```
┌─[ALERT]──────────────────────────────────┐
│ 🚨 HIGH PRIORITY                          │
│ Multiple explosions reported in Tehran    │
│ • 5 news sources (last 10 min)            │
│ • @WarMonitors confirmation                │
│ • USGS detected seismic activity          │
│                                            │
│ [View on Map] [Dismiss] [Follow]          │
└────────────────────────────────────────────┘
```

**Implementation:**
- Browser notifications (if permitted)
- Audio alert option
- Alert log panel (history of all alerts)
- Customizable thresholds

### 8.6 Multi-Monitor Support ⭐
**Feature:** Optimized layouts for 2-3 monitor setups

**Layout Options:**
- Monitor 1: Full map
- Monitor 2: News feeds + panels
- Monitor 3: Video wall (all intel videos)

**Implementation:**
- Pop-out windows for panels
- Remember window positions
- Synchronized state across windows

---

## Phase 9: Data Source Expansion
**Priority: MEDIUM | Timeline: Ongoing**

### 9.1 Premium Data Integrations ⭐⭐
**Potential paid subscriptions (ROI analysis needed):**

1. **ACLED (Armed Conflict Location & Event Data)**
   - $1,200/year academic, $5,000/year commercial
   - 200,000+ conflict events globally
   - Daily updates with coordinates
   - **Value:** Best-in-class conflict data

2. **Stratfor Worldview**
   - $349/year individual
   - Geopolitical analysis, forecasts
   - **Value:** Expert insights

3. **Jane's Defence**
   - $3,000+/year
   - Military equipment database, bases, capabilities
   - **Value:** Authoritative military intelligence

4. **Bloomberg Terminal** (if budget allows)
   - $24,000/year
   - Real-time markets, news, analytics
   - **Value:** Professional-grade financial data

5. **Recorded Future**
   - Custom pricing (~$50K+/year)
   - Threat intelligence, cyber risk
   - **Value:** Enterprise-grade threat data

**Decision:** Start with free/low-cost options, add premium as user base grows

### 9.2 Free Data Sources to Add ⭐⭐⭐

1. **NASA FIRMS (Fire Information)**
   - Real-time wildfire and thermal anomaly data
   - Free API, no auth required
   - **Use:** Show wildfires, industrial fires, explosions

2. **Windy API (Weather)**
   - Free tier: wind, temperature, precipitation overlays
   - **Use:** Weather context for conflicts, natural disasters

3. **Marine Traffic (Ship Tracking)**
   - Free API for ship positions
   - **Use:** Monitor shipping chokepoints, naval movements

4. **Flight Radar 24 API** (if available)
   - Aircraft tracking
   - **Use:** Monitor military aircraft, suspicious flights

5. **Global Forest Watch**
   - Deforestation data
   - **Use:** Environmental destruction in conflict zones

6. **Our World in Data**
   - Demographics, economics, health
   - **Use:** Country statistics for context

### 9.3 Telegram OSINT Channels ⭐⭐
**High-value, free data sources:**

**Channels to integrate:**
- Rybar (Russian military analysis)
- Intel Slava Z (pro-Russian war updates)
- UAWarInformer (Ukrainian updates)
- Middle East Spectator (ME conflicts)
- Intell Fusion (global OSINT)

**Implementation:**
- Telegram Bot API (free)
- Fetch channel posts every 60s
- Geolocation extraction
- Show as intel markers on map

**Benefits:**
- Faster than RSS (near real-time)
- Often first to report events
- Includes photos/videos

---

## Phase 10: Mobile & Accessibility
**Priority: LOW | Timeline: Week 6+**

### 10.1 Mobile-First Optimizations ⭐⭐
**Current state:** Desktop-optimized, mobile is usable but not ideal

**Improvements:**
1. **Bottom Sheet Panels:** Swipe-up news/data panels (like Google Maps)
2. **Simplified Map Controls:** Larger touch targets
3. **Gesture Support:** Pinch-zoom, two-finger rotate
4. **Offline Mode:** Cache data for offline viewing
5. **Progressive Web App (PWA):** Installable, app-like experience

### 10.2 Accessibility (WCAG 2.1 AA) ⭐
**Features:**
1. **Keyboard Navigation:** All functions accessible via keyboard
2. **Screen Reader Support:** ARIA labels, semantic HTML
3. **High Contrast Mode:** Toggle for visually impaired
4. **Text Scaling:** Support browser zoom up to 200%
5. **Color Blind Mode:** Alternative color palettes

---

## Implementation Priority Matrix

### CRITICAL PATH (Week 1-2) - Must Have
1. **Theatre Navigation Buttons** (Phase 5) - Essential UX after removing polygon zoom
2. **Map Layers System** (Phase 6) - Core feature, high user value
3. **News API Backend** (Phase 2.1) - Performance critical
4. **Twitter Intel Fix** (Phase 7.2) - Currently broken/unreliable

### HIGH PRIORITY (Week 2-4) - Should Have
5. **Day/Night Cycle** (Phase 6.3) - High visual impact, differentiator
6. **Dynamic Video System** (Phase 3) - Key intelligence feature
7. **Claude Feature Migration** (Phase 1) - Feature parity
8. **Content Density Assurance** (Phase 4) - User satisfaction

### MEDIUM PRIORITY (Week 4-8) - Nice to Have
9. **Palantir Advanced Features** (Phase 8) - Competitive edge
10. **Power Blocs Visualization** (Phase 6.4) - Educational value
11. **Weapon Range Circles** (Phase 6.5) - Military analysis

### LOW PRIORITY (Week 8+) - Future Enhancements
12. **Premium Data Sources** (Phase 9.1) - Cost/benefit analysis needed
13. **Mobile Optimizations** (Phase 10.1) - Polish
14. **Link Analysis Graph** (Phase 8.2) - Complex, niche use case

---

## Success Metrics

### User Engagement
- **Session Duration:** Target 10+ minutes (currently ~5 min)
- **Return Visits:** 40% weekly return rate
- **Features Used:** Average 5+ panels opened per session

### Performance
- **Initial Load Time:** <3 seconds (currently ~8 sec due to RSS fetching)
- **News Load Time:** <1 second with backend (currently ~10-15 sec)
- **Map Interactions:** 60 FPS, no jank

### Content Quality
- **News Freshness:** 90% of news <2 hours old
- **Geolocation Accuracy:** 80% of news accurately geolocated
- **Video Relevance:** 70% of videos clicked by users
- **Theatre Content:** 100% of theatres have 10+ interactive elements

### Reliability
- **Uptime:** 99.5%+ (monitor with UptimeRobot)
- **API Success Rate:** 95%+ (all data sources)
- **Error Rate:** <1% of requests

---

## Technical Stack Recommendations

### Backend Services (for API aggregation)
**Option 1: Vercel (Recommended)**
- Free tier: Sufficient for our needs
- Serverless functions: /api/news, /api/videos, /api/twitter
- Edge caching: Fast global delivery
- Easy GitHub integration

**Option 2: Railway**
- Free tier: $5 credit/month
- Always-on server (better for WebSockets)
- PostgreSQL database included

**Option 3: Fly.io**
- Free tier: 3 small VMs
- Global deployment
- Good for low-latency APIs

### Database (if needed)
**Option 1: Vercel KV (Redis)**
- Free tier: 256MB
- Perfect for caching news/tweets

**Option 2: Supabase (PostgreSQL)**
- Free tier: 500MB
- If we need relational data (user accounts, saved views, etc.)

### Video Hosting
- **Current:** GitHub repo (limited to small files)
- **Recommended:** Cloudflare R2 (free tier: 10GB storage, 10M requests/month)
- **Alternative:** Bunny.net CDN ($1/month for 500GB bandwidth)

---

## Cost Estimate

### Minimum Viable (Free Tier)
- Vercel backend: $0
- Cloudflare R2: $0 (within free tier)
- YouTube Data API: $0 (10K quota)
- USGS, CoinGecko, etc: $0 (free APIs)
- **Total:** $0/month

### Recommended (Better Reliability)
- Vercel Pro: $20/month (if we exceed free tier)
- ScoutAPI (Twitter): $20/month
- RapidAPI TikTok scraper: $20/month
- Cloudflare R2: $1/month (storage)
- **Total:** $61/month

### Premium (Professional Grade)
- Railway Pro: $5/month (backend server)
- Twitter API Basic: $100/month (official API)
- ScoutAPI Pro: $50/month (higher limits)
- ACLED subscription: $416/month ($5K/year)
- Cloudflare R2: $5/month
- **Total:** $576/month

**Recommendation:** Start with Minimum Viable, upgrade to Recommended tier once user base justifies it

---

## Risk Mitigation

### Technical Risks
1. **API Rate Limits:** Use multiple fallback sources, caching, backend aggregation
2. **CORS Issues:** Backend proxy server eliminates CORS problems
3. **Data Source Downtime:** Graceful degradation, show cached data
4. **Performance:** Lazy loading, code splitting, memoization

### Legal Risks
1. **News Scraping:** Using RSS feeds is generally acceptable (public data)
2. **Twitter Scraping:** Use terms-compliant services (ScoutAPI, Apify)
3. **Video Embedding:** Only embed from official sources (YouTube, TikTok) with proper attribution
4. **Maps:** OpenStreetMap data is free to use (ODbL license)

### Operational Risks
1. **Misinformation:** Label unverified reports, show multiple sources
2. **Bias:** Display bias ratings, include diverse sources
3. **Graphic Content:** Content warnings, age restrictions, moderation queue

---

## Next Steps

### Week 1
1. ✅ **Create this plan** (Done!)
2. Add theatre navigation buttons to header
3. Implement map layers toggle panel
4. Deploy backend RSS aggregation server (Vercel)

### Week 2
5. Migrate ASCIIBox component system from Claude version
6. Implement day/night cycle overlay
7. Fix Twitter intel with ScoutAPI integration
8. Add nuclear facilities and cyber threat layers

### Week 3
9. Build dynamic video marker system (YouTube API)
10. Ensure 10+ nodes per theatre
11. Add power blocs visualization
12. Implement weapon range circles

### Week 4
13. Timeline scrubber feature
14. Alert system and notifications
15. Performance optimizations
16. User testing and feedback collection

---

## References & Inspiration

### Palantir Products
- [Palantir Gotham](https://www.palantir.com/platforms/gotham/) - Government intelligence platform
- [Palantir Foundry](https://www.palantir.com/platforms/foundry/) - Enterprise data platform
- [Palantir Cross-App Interactivity](https://www.palantir.com/docs/foundry/cross-app-interactivity/enrichment-reference)

### Geopolitical Intelligence Platforms
- [Recorded Future Geopolitical Intelligence](https://www.recordedfuture.com/products/geopolitical-intelligence) - AI threat monitoring
- [Stratfor Worldview](https://worldview.stratfor.com/) - Leading geopolitical intelligence platform
- [Debales AI Geopolitical Risk Monitoring](https://debales.ai/blog/geopolitical-risk-ai-monitoring-real-time-logistics-threat-tracking-2025)
- [BlackRock Geopolitical Risk Dashboard](https://www.blackrock.com/corporate/insights/blackrock-investment-institute/interactive-charts/geopolitical-risk-dashboard)
- [Silobreaker Geopolitical Intelligence](https://www.silobreaker.com/solutions/geopolitics/)

### Twitter API Alternatives
- [TwitterAPI.io](https://twitterapi.io/blog/twitter-api-alternatives-comprehensive-guide-2025) - Affordable real-time Twitter data
- [Deliberate Directions - 7 Affordable Twitter API Alternatives](https://deliberatedirections.com/twitter-api-pricing-alternatives/)
- [Data365 Twitter APIs Comparison](https://data365.co/blog/twitter-apis-vs-private-api)
- [G2 Twitter API Alternatives](https://www.g2.com/products/twitter-api/competitors/alternatives)

---

## Conclusion

This plan transforms **situation-monitorGem** from a functional prototype into a **world-class geopolitical intelligence platform**. By systematically implementing these phases, we'll:

1. **Surpass the Claude test version** with all its features plus enhancements
2. **Match Palantir's UI sophistication** with terminal aesthetics and advanced visualizations
3. **Achieve 10x faster news loading** through backend aggregation
4. **Provide dynamic video intelligence** from conflict zones
5. **Ensure rich content** across all theatres
6. **Offer intuitive navigation** with header theatre buttons
7. **Enable comprehensive analysis** through map layer toggles
8. **Deliver reliable Twitter intel** via multi-source scraping

The platform will serve as a **comprehensive situational awareness tool** for analysts, journalists, researchers, and enthusiasts tracking global events in real-time.

**Ready to build the future of open-source geopolitical intelligence monitoring. 🌍📡**

---

*Plan created: January 10, 2026*
*Target completion: Q1 2026*
*Status: Ready for implementation*
