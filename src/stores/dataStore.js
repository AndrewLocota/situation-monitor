import { create } from 'zustand';

export const useDataStore = create((set) => ({
  // News feeds
  news: {
    politics: [],
    tech: [],
    finance: [],
    gov: [],
    intel: [],
    ai: []
  },
  allNews: [],

  // Conflict events (from LiveUAMap, etc.)
  conflictEvents: [],

  // Markets
  markets: [],
  sectors: [],
  commodities: [],
  crypto: [],

  // Other data
  polymarket: [],
  congressTrades: [],
  whaleTransactions: [],
  mainCharacters: [],
  fedData: null,
  fedBalance: null,
  govContracts: [],
  earthquakes: [],
  layoffs: [],

  // Situation news
  venezuelaNews: [],
  greenlandNews: [],
  
  // Twitter Intel
  twitterEvents: [],

  // Global state
  isLoading: false,
  error: null,
  lastUpdate: null,
  selectedNews: null, // Selected news item for map focus

  // HoloCall state (Phase 10: AI Character Reactions)
  holoCall: {
    isOpen: false,
    characterId: 'trump',
    message: '',
    isLoading: false,
    newsItem: null,
    error: null
  },

  // Loading states
  loading: {
    news: false,
    markets: false,
    polymarket: false,
    congress: false,
    whales: false,
    fed: false,
    contracts: false,
    earthquakes: false,
    layoffs: false
  },

  // Last updated timestamps
  lastUpdated: {
    news: null,
    markets: null,
    polymarket: null,
    earthquakes: null
  },

  // Actions
  setNews: (category, items) => {
    set(state => ({
      news: { ...state.news, [category]: items }
    }));
  },

  setAllNews: (items) => set({ allNews: items }),

  setConflictEvents: (items) => set({ conflictEvents: items }),

  setMarkets: (items) => set({ markets: items }),

  setSectors: (items) => set({ sectors: items }),

  setCommodities: (items) => set({ commodities: items }),

  setCrypto: (items) => set({ crypto: items }),

  setPolymarket: (items) => set({ polymarket: items }),

  setCongressTrades: (items) => set({ congressTrades: items }),

  setWhaleTransactions: (items) => set({ whaleTransactions: items }),

  setMainCharacters: (items) => set({ mainCharacters: items }),

  setFedData: (data) => set({ fedData: data }),

  setFedBalance: (data) => set({ fedBalance: data }),

  setGovContracts: (items) => set({ govContracts: items }),

  setEarthquakes: (items) => set({ earthquakes: items }),

  setLayoffs: (items) => set({ layoffs: items }),

  setVenezuelaNews: (items) => set({ venezuelaNews: items }),

  setGreenlandNews: (items) => set({ greenlandNews: items }),

  setTwitterEvents: (items) => set({ twitterEvents: items }),

  setLoading: (value) => set({ isLoading: value }),

  setError: (error) => set({ error }),

  setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),

  setLoadingState: (key, value) => {
    set(state => ({
      loading: { ...state.loading, [key]: value }
    }));
  },

  setLastUpdated: (key) => {
    set(state => ({
      lastUpdated: { ...state.lastUpdated, [key]: Date.now() }
    }));
  },

  setSelectedNews: (newsItem) => set({ selectedNews: newsItem }),

  clearSelectedNews: () => set({ selectedNews: null }),

  // HoloCall actions
  openHoloCall: (characterId, newsItem) => set({
    holoCall: {
      isOpen: true,
      characterId,
      message: '',
      isLoading: true,
      newsItem,
      error: null
    }
  }),

  setHoloCallMessage: (message, error = null) => set(state => ({
    holoCall: {
      ...state.holoCall,
      message,
      isLoading: false,
      error
    }
  })),

  closeHoloCall: () => set(state => ({
    holoCall: {
      ...state.holoCall,
      isOpen: false,
      isLoading: false
    }
  }))
}));

export default useDataStore;
