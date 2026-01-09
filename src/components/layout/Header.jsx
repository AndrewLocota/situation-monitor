import { useEffect, useState } from 'react';
import { useMapStore, useDataStore } from '../../stores';
import { THEATRES } from '../../data/theatres';
import './Header.css';

export function Header({ onRefresh }) {
    const [time, setTime] = useState(new Date());
    const { currentTheatre, setTheatre } = useMapStore();
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

    return (
        <header className="header">
            <div className="header-left">
                <div className="header-brand">
                    <span className="header-bracket">[</span>
                    <span className="header-title">SITUATION MONITOR</span>
                    <span className="header-bracket">]</span>
                </div>



            </div>

            <div className="header-center">
            </div>

            <div className="header-right">
                <div className="header-theatre-nav">
                    <button
                        className={`theatre-nav-btn ${currentTheatre === 'GLOBAL' ? 'active' : ''}`}
                        onClick={() => setTheatre('GLOBAL')}
                    >
                        GLOBAL
                    </button>
                    {THEATRES.map(t => (
                        <button
                            key={t.id}
                            className={`theatre-nav-btn ${currentTheatre === t.id ? 'active' : ''}`}
                            onClick={() => setTheatre(t.id)}
                        >
                            {t.name.toUpperCase()}
                        </button>
                    ))}
                </div>

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
                        {isLoading ? '[...]' : '[REF]'}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
