import { create } from 'zustand';

const DEFAULT_LAYERS = {
  conflicts: true,
  bases: true,
  nuclear: true,
  cables: false,
  sanctions: false,
  density: false,
  chokepoints: true,
  cyber: false,
  earthquakes: true
};

export const useMapStore = create((set, get) => ({
  // Initial state
  currentTheatre: 'GLOBAL',
  previousTheatre: null,
  viewMode: 'global',
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  isTransitioning: false,
  layers: DEFAULT_LAYERS,
  selectedHotspot: null,
  selectedConflict: null,
  selectedChokepoint: null,
  flashbackHours: 0,

  // Actions
  setTheatre: (theatreId) => {
    const currentTheatre = get().currentTheatre;
    set({
      previousTheatre: currentTheatre,
      currentTheatre: theatreId,
      isTransitioning: true,
      selectedHotspot: null,
      selectedConflict: null,
      selectedChokepoint: null
    });

    setTimeout(() => set({ isTransitioning: false }), 800);
  },

  goBack: () => {
    const { previousTheatre } = get();
    if (previousTheatre) {
      set({
        currentTheatre: previousTheatre,
        previousTheatre: null,
        isTransitioning: true,
        selectedHotspot: null,
        selectedConflict: null,
        selectedChokepoint: null
      });
      setTimeout(() => set({ isTransitioning: false }), 800);
    } else {
      get().setTheatre('GLOBAL');
    }
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
    if (mode === 'us') {
      get().setTheatre('US_DOMESTIC');
    } else {
      get().setTheatre('GLOBAL');
    }
  },

  setZoom: (level) => {
    const clampedLevel = Math.max(1, Math.min(4, level));
    set({ zoomLevel: clampedLevel });
    if (clampedLevel === 1) {
      set({ panOffset: { x: 0, y: 0 } });
    }
  },

  setPan: (offset) => {
    const { zoomLevel } = get();
    if (zoomLevel <= 1) return;

    const maxPan = (zoomLevel - 1) * 200;
    set({
      panOffset: {
        x: Math.max(-maxPan, Math.min(maxPan, offset.x)),
        y: Math.max(-maxPan, Math.min(maxPan, offset.y))
      }
    });
  },

  toggleLayer: (layer) => {
    set(state => ({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer]
      }
    }));
  },

  setLayers: (layerUpdates) => {
    set(state => ({
      layers: { ...state.layers, ...layerUpdates }
    }));
  },

  selectHotspot: (id) => {
    set({
      selectedHotspot: id,
      selectedConflict: null,
      selectedChokepoint: null
    });
  },

  selectConflict: (id) => {
    set({
      selectedConflict: id,
      selectedHotspot: null,
      selectedChokepoint: null
    });
  },

  selectChokepoint: (id) => {
    set({
      selectedChokepoint: id,
      selectedHotspot: null,
      selectedConflict: null
    });
  },

  setFlashback: (hours) => {
    set({ flashbackHours: Math.max(0, Math.min(24, hours)) });
  },

  resetView: () => {
    set({
      currentTheatre: 'GLOBAL',
      previousTheatre: null,
      viewMode: 'global',
      zoomLevel: 1,
      panOffset: { x: 0, y: 0 },
      selectedHotspot: null,
      selectedConflict: null,
      selectedChokepoint: null,
      flashbackHours: 0
    });
  },

  isGlobalView: () => {
    return get().currentTheatre === 'GLOBAL';
  }
}));

export default useMapStore;
