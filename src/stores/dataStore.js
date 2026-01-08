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

  // Global state
  isLoading: false,
  error: null,
  lastUpdate: null,

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
  }
}));

export default useDataStore;
