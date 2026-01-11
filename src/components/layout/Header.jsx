import { useEffect, useState } from 'react';
import { useMapStore, useDataStore } from '../../stores';
import { THEATRES } from '../../data/theatres';
import { TheaterPopup } from '../TheaterPopup';
import './Header.css';

export function Header({ onRefresh, musicPlayer }) {
    const [time, setTime] = useState(new Date());
    const [selectedTheater, setSelectedTheater] = useState(null);
    const { currentTheatre, setTheatre, setMapView } = useMapStore();
    const { isLoading, lastUpdate } = useDataStore();

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const isGlobal = currentTheatre === 'GLOBAL';

    const formatUTC = (date) => {
        return date.toISOString().substring(11, 19);
    };

    const formatDate = (date) => {
        return date.toISOString().substring(0, 10);
    };

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            window.location.reload();
        }
    };

    const handleTheaterClick = (theater) => {
        // Show popup for theater
        setSelectedTheater(theater);
    };

    const handleLocationSelect = (location) => {
        // Zoom to specific location within theater
        if (setMapView) {
            setMapView({
                center: location.center,
                zoom: location.zoom
            });
        }
    };

    const theatreConfig = {
        'GLOBAL': { label: 'GLOBL' },
        'europe': { label: 'EURPE' },
        'middle_east': { label: 'MDEST' },
        'pacific': { label: 'PACFC' },
        'africa': { label: 'AFRCA' },
        'americas': { label: 'AMRCS' }
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-brand">
                    <span className="header-bracket">[</span>
                    <span className="header-title">SITUATION MONITOR</span>
                    <span className="header-bracket">]</span>
                </div>

                {/* Music Player on the left */}
                {musicPlayer && (
                    <div className="header-music-player">
                        {musicPlayer}
                    </div>
                )}
            </div>

            <div className="header-center">
                {/* Theater Exit Button - Shows when zoomed into a specific theater */}
                {!isGlobal && (
                    <div className="theater-exit-container">
                        <button
                            className="theater-exit-btn"
                            onClick={() => setTheatre('GLOBAL')}
                            title="Exit theater view (or zoom out twice)"
                        >
                            <span className="theater-exit-label">
                                {theatreConfig[currentTheatre]?.label || currentTheatre}
                            </span>
                            <span className="theater-exit-x">✕</span>
                        </button>
                    </div>
                )}

                {/* Theatre Navigation Buttons - Centered */}
                {isGlobal && (
                    <div className="header-theatre-nav">
                        <button
                            className={`theatre-nav-btn ${currentTheatre === 'GLOBAL' ? 'active' : ''}`}
                            onClick={() => setTheatre('GLOBAL')}
                            title="Global View"
                        >
                            {theatreConfig['GLOBAL'].label}
                        </button>
                        {THEATRES.map(t => (
                            <button
                                key={t.id}
                                className={`theatre-nav-btn ${currentTheatre === t.id ? 'active' : ''} ${t.glowing ? 'glowing-theatre' : ''}`}
                                onClick={() => handleTheaterClick(t)}
                                title={t.hoverDescription || t.description}
                                style={t.color ? {
                                    '--theatre-color': t.color,
                                    '--theatre-glow': `${t.color}aa`
                                } : {}}
                            >
                                {theatreConfig[t.id]?.label || t.name.substring(0, 3).toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Theater Popup Modal */}
            {selectedTheater && (
                <TheaterPopup
                    theater={selectedTheater}
                    onClose={() => setSelectedTheater(null)}
                    onSelectLocation={(location) => {
                        handleLocationSelect(location);
                        setTheatre(selectedTheater.id);
                    }}
                />
            )}

            <div className="header-right">
                <div className="header-divider"></div>

                <div className={`live-indicator ${isLoading ? 'syncing' : ''}`}>
                    <span className="live-dot" />
                    <span className="live-text">{isLoading ? 'SYNCING' : 'LIVE'}</span>
                </div>

                <div className="header-time">
                    <span className="header-time-label">UTC</span>
                    <span className="header-time-value">{formatUTC(time)}</span>
                </div>

                <div className="header-date">{formatDate(time)}</div>

                <div className="header-actions">
                    <button
                        className="header-btn"
                        onClick={handleRefresh}
                        title="Refresh Data"
                        disabled={isLoading}
                    >
                        {isLoading ? '[...]' : '[↻ REF]'}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
