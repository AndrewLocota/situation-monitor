import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_PANELS = {
  newsFeed: true,
  markets: true,
  sectors: true,
  commodities: true,
  polymarket: true,
  congress: true,
  whales: true,
  mainChar: true,
  moneyPrinter: true,
  contracts: true,
  ai: true,
  layoffs: true,
  venezuela: true,
  greenland: true,
};

const DEFAULT_PANEL_ORDER = [
  'newsFeed', 'markets', 'sectors', 'commodities', 'polymarket',
  'congress', 'whales', 'mainChar', 'moneyPrinter', 'contracts',
  'ai', 'layoffs', 'venezuela', 'greenland'
];

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Initial state
      panels: DEFAULT_PANELS,
      panelOrder: DEFAULT_PANEL_ORDER,
      monitors: [],
      livestreamUrl: 'https://www.youtube.com/watch?v=jWEZa9WEnIo',
      showScanlines: false,
      compactMode: false,
      autoRefresh: true,
      refreshInterval: 5,
      settingsModalOpen: false,
      monitorModalOpen: false,
      editingMonitor: null,

      // Actions
      togglePanel: (panelId) => {
        set(state => ({
          panels: {
            ...state.panels,
            [panelId]: !state.panels[panelId]
          }
        }));
      },

      setPanelEnabled: (panelId, enabled) => {
        set(state => ({
          panels: { ...state.panels, [panelId]: enabled }
        }));
      },

      setPanelOrder: (order) => {
        set({ panelOrder: order });
      },

      addMonitor: (monitor) => {
        const id = `monitor_${Date.now()}`;
        set(state => ({
          monitors: [
            ...state.monitors,
            {
              ...monitor,
              id,
              createdAt: Date.now()
            }
          ]
        }));
      },

      updateMonitor: (id, updates) => {
        set(state => ({
          monitors: state.monitors.map(m =>
            m.id === id ? { ...m, ...updates } : m
          )
        }));
      },

      removeMonitor: (id) => {
        set(state => ({
          monitors: state.monitors.filter(m => m.id !== id)
        }));
      },

      toggleMonitor: (id) => {
        set(state => ({
          monitors: state.monitors.map(m =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
          )
        }));
      },

      setLivestreamUrl: (url) => {
        set({ livestreamUrl: url });
      },

      setShowScanlines: (show) => {
        set({ showScanlines: show });
      },

      setCompactMode: (compact) => {
        set({ compactMode: compact });
      },

      setAutoRefresh: (auto) => {
        set({ autoRefresh: auto });
      },

      setRefreshInterval: (minutes) => {
        set({ refreshInterval: Math.max(1, Math.min(60, minutes)) });
      },

      openSettingsModal: () => {
        set({ settingsModalOpen: true });
      },

      closeSettingsModal: () => {
        set({ settingsModalOpen: false });
      },

      openMonitorModal: (editId) => {
        set({
          monitorModalOpen: true,
          editingMonitor: editId || null
        });
      },

      closeMonitorModal: () => {
        set({
          monitorModalOpen: false,
          editingMonitor: null
        });
      },

      resetToDefaults: () => {
        set({
          panels: DEFAULT_PANELS,
          panelOrder: DEFAULT_PANEL_ORDER,
          showScanlines: false,
          compactMode: false,
          autoRefresh: true,
          refreshInterval: 5
        });
      }
    }),
    {
      name: 'situation-monitor-settings',
      partialize: (state) => ({
        panels: state.panels,
        panelOrder: state.panelOrder,
        monitors: state.monitors,
        livestreamUrl: state.livestreamUrl,
        showScanlines: state.showScanlines,
        compactMode: state.compactMode,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval
      })
    }
  )
);

export default useSettingsStore;
