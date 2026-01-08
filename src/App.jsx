import { useEffect, useState } from 'react';
import MapLayer from './components/MapLayer';
import UIOverlay from './components/UIOverlay';
import { useLiveData } from './hooks/useLiveData';
import { useDataStore, useSettingsStore } from './stores';
import './styles/globals.css';
import './styles/animations.css';
import './index.css';

function App() {
  const [activeTheatre, setActiveTheatre] = useState(null);
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' or 'black'
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Initialize live data fetching
  const { refresh } = useLiveData({
    newsInterval: 60000,      // 1 minute
    conflictInterval: 30000,  // 30 seconds
    marketsInterval: 30000,   // 30 seconds
    earthquakeInterval: 120000, // 2 minutes
    enabled: true,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + R to refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refresh]);

  const handleTheatreSelect = (theatreId) => {
    setActiveTheatre(theatreId);
  };

  return (
    <UIOverlay
      onRefresh={refresh}
      videoPlaying={videoPlaying}
    >
      {/* Map is passed as children to be rendered in the center area */}
      <MapLayer
        activeTheatre={activeTheatre}
        onTheatreSelect={handleTheatreSelect}
        mapTheme={mapTheme}
        onVideoStateChange={setVideoPlaying}
      />
    </UIOverlay>
  );
}

export default App;
