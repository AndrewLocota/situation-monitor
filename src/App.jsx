import React, { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import SituationMap from './components/SituationMap';
import MarketsPanel from './components/Panels/MarketsPanel';
import NewsPanel from './components/Panels/NewsPanel';
import SectorHeatmap from './components/Panels/SectorHeatmap';
import PolymarketPanel from './components/Panels/PolymarketPanel';
import './index.css';

function App() {
  const [activeTheatre, setActiveTheatre] = useState(null);
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' or 'black'
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleTheatreSelect = (theatreId) => {
    setActiveTheatre(theatreId);
  };

  const handleResetView = () => {
    setActiveTheatre(null);
  };

  const toggleMapTheme = () => {
    setMapTheme(prev => prev === 'dark' ? 'black' : 'dark');
  };

  // Palantir-inspired colors
  const accentColor = '#4da6ff';
  const bgPanel = 'rgba(12, 15, 25, 0.92)';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#0a0a0f'
    }}>
      {/* Layer 0: The Map */}
      <div className="map-zoom-entry" style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0
      }}>
        <SituationMap
          activeTheatre={activeTheatre}
          onTheatreSelect={handleTheatreSelect}
          mapTheme={mapTheme}
          onVideoStateChange={setVideoPlaying}
        />
      </div>

      {/* Layer 1: UI Overlays */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px'
      }}>

        {/* Top Bar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pointerEvents: 'auto'
        }}>
          <div style={{
            padding: '12px 16px',
            background: bgPanel,
            border: '1px solid #2a3040',
            backdropFilter: 'blur(8px)'
          }}>
            <h1 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: accentColor,
              textShadow: '0 0 10px rgba(77, 166, 255, 0.4)',
              margin: 0,
              letterSpacing: '3px'
            }}>
              SITUATION MONITOR // V2
            </h1>
            <div style={{ fontSize: '11px', color: '#8892a8', marginTop: '4px' }}>
              STATUS: <span style={{ color: accentColor }}>ONLINE</span> |
              THEATRE: <span style={{ color: accentColor }}>{activeTheatre ? activeTheatre.toUpperCase() : 'GLOBAL'}</span>
            </div>
            <MusicPlayer forcePause={videoPlaying} />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {activeTheatre && (
              <button
                onClick={handleResetView}
                style={{
                  background: 'rgba(12, 15, 25, 0.9)',
                  color: accentColor,
                  border: `1px solid ${accentColor}`,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  letterSpacing: '1px'
                }}
              >
                [ RETURN TO GLOBAL ]
              </button>
            )}
            <button
              onClick={toggleMapTheme}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                background: bgPanel,
                border: '1px solid #2a3040',
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#8892a8'
              }}
            >
              MAP: {mapTheme === 'dark' ? 'DARK GREY' : 'BLACK'}
            </button>
            <button style={{
              padding: '8px 16px',
              cursor: 'pointer',
              background: bgPanel,
              border: '1px solid #2a3040'
            }}>
              SETTINGS
            </button>
          </div>
        </header>

        {/* Bottom Panel Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '24px',
          pointerEvents: 'none'
        }}>

          {/* Left Dock */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'auto',
            width: '400px'
          }}>
            <div style={{ height: '220px' }}>
              <MarketsPanel />
            </div>
            <div style={{ height: '180px' }}>
              <SectorHeatmap />
            </div>
          </div>

          {/* Right Dock */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            pointerEvents: 'auto',
            width: '450px'
          }}>
            <div style={{ height: '180px' }}>
              <PolymarketPanel />
            </div>
            <div style={{ height: '240px' }}>
              <NewsPanel />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
