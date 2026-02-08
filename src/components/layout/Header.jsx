import { useMapStore, useDataStore } from '../../stores';
import { THEATRES } from '../../data/theatres';
import './Header.css';

export function Header({ onRefresh, musicPlayer }) {
    const { currentTheatre, setTheatre } = useMapStore();
    const { isLoading } = useDataStore();

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            window.location.reload();
        }
    };

    const theatreConfig = {
        'GLOBAL': { label: 'GLB' },
        'europe': { label: 'EUR' },
        'middle_east': { label: 'MDE' },
        'pacific': { label: 'PAC' },
        'africa': { label: 'AFR' },
        'americas': { label: 'AME' }
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
                {/* Theatre Navigation Buttons */}
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
                            className={`theatre-nav-btn ${currentTheatre === t.id ? 'active' : ''}`}
                            onClick={() => setTheatre(t.id)}
                            title={t.description}
                        >
                            {theatreConfig[t.id]?.label || t.name.substring(0, 3).toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="header-right">
                <div className="header-divider"></div>

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
