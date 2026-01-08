import { useState, useEffect } from 'react';
import { Header } from './layout/Header';
import MusicPlayer from './MusicPlayer';
import {
    NewsFeed,
    MarketsPanel,
    SectorHeatmap,
    CommoditiesPanel,
    PolymarketPanel,
    CongressPanel,
    WhalePanel,
    MainCharPanel,
    MoneyPrinterPanel,
    ContractsPanel,
} from './panels';
import { useDataStore, useSettingsStore } from '../stores';
import '../App.css';

/**
 * UIOverlay - Contains all static UI elements that overlay the map
 * including the header, sidebars with panels, and footer.
 * The map is passed as children and rendered in the center area.
 */
const UIOverlay = ({ onRefresh, videoPlaying, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1000);
    const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(() => window.innerWidth < 1000);

    const { isLoading, error, lastUpdate, allNews, conflictEvents, earthquakes } = useDataStore();
    const { panels } = useSettingsStore();

    // Cycling footer taglines
    const FOOTER_TAGLINES = [
        { type: 'text', content: 'We live in interesting times' },
        { type: 'text', content: 'SITUATION MONITOR' },
        {
            type: 'ascii', content: `  (--v--)
__  __|__
(@)_(::|@\\
\`--\\_____)`}
    ];
    const [taglineIndex, setTaglineIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIndex(prev => (prev + 1) % FOOTER_TAGLINES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Persistent Visitor Counter
    const [visitorCount, setVisitorCount] = useState(null);
    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                // Check if we've already counted this user session to avoid spamming increments on refresh
                const key = 'situation_monitor_visit_counted';
                const hasCounted = sessionStorage.getItem(key);

                let url = 'https://api.countapi.xyz/hit/AndrewLocota/situation-monitor';
                if (hasCounted) {
                    // Just get the info, don't increment
                    url = 'https://api.countapi.xyz/get/AndrewLocota/situation-monitor';
                }

                const response = await fetch(url);
                const data = await response.json();
                if (data && data.value) {
                    setVisitorCount(data.value);
                    if (!hasCounted) {
                        sessionStorage.setItem(key, 'true');
                    }
                }
            } catch (err) {
                console.warn('Failed to fetch visitor count:', err);
                // Fallback to simple local storage count if API fails? No, just hide it.
            }
        };

        fetchVisitorCount();
    }, []);

    return (
        <div className="app">
            {/* Map Layer - Positioned absolutely behind everything */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 28, /* Above status bar/footer */
                zIndex: 0
            }}>
                {children}
            </div>

            {/* Header with Music Player */}
            <header className="header" style={{ position: 'relative', zIndex: 10 }}>
                <div className="header-left">
                    <div className="header-brand">
                        <span className="header-bracket">[</span>
                        <span className="header-title">SITUATION MONITOR</span>
                        <span className="header-bracket">]</span>
                    </div>
                    {/* Music Player integrated in header */}
                    <div style={{ marginLeft: '16px' }}>
                        <MusicPlayer forcePause={videoPlaying} />
                    </div>
                </div>

                <div className="header-center">
                    {/* Empty center for balance, or could add tagline later */}
                </div>

                <div className="header-right">
                    {/* LIVE indicator - to the left of time */}
                    <div className={`live-indicator ${isLoading ? 'syncing' : ''}`}>
                        <span className="live-dot" />
                        <span className="live-text">{isLoading ? 'SYNCING' : 'LIVE'}</span>
                    </div>
                    <div className="header-time">
                        <span className="header-time-label">UTC</span>
                        <span className="header-time-value">{new Date().toISOString().substring(11, 19)}</span>
                    </div>
                    <div className="header-date desktop-only">{new Date().toISOString().substring(0, 10)}</div>
                    <button
                        className="header-btn desktop-only"
                        onClick={onRefresh}
                        title="Refresh Data"
                        disabled={isLoading}
                    >
                        {isLoading ? '[...]' : '[REF]'}
                    </button>
                </div>
            </header>

            {/* Main content area (Sidebars + Center UI) */}
            <div className="main-container" style={{ position: 'relative', zIndex: 5, pointerEvents: 'none' }}>
                {/* Left Sidebar */}
                <aside className={`sidebar left ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ pointerEvents: 'auto' }}>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? '»' : '«'}
                    </button>

                    <div className="sidebar-content" style={{ display: sidebarCollapsed ? 'none' : 'flex' }}>
                        {panels.newsFeed && <NewsFeed />}
                        {panels.polymarket && <PolymarketPanel />}
                        {panels.mainChar && <MainCharPanel />}
                    </div>
                </aside>

                {/* Center area (just for layout spacing and center UI elements) */}
                <main className="map-area" style={{ background: 'transparent' }}>
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="loading-overlay" style={{ pointerEvents: 'auto' }}>
                            <div className="loading-spinner" />
                            <span>SYNCING LIVE DATA...</span>
                        </div>
                    )}

                    {/* Error indicator */}
                    {error && (
                        <div className="error-banner" style={{ pointerEvents: 'auto' }}>
                            <span>⚠ {error}</span>
                            <button onClick={onRefresh}>RETRY</button>
                        </div>
                    )}

                </main>

                {/* Right Sidebar */}
                <aside className={`sidebar right ${rightSidebarCollapsed ? 'collapsed' : ''}`} style={{ pointerEvents: 'auto' }}>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
                        title={rightSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {rightSidebarCollapsed ? '«' : '»'}
                    </button>

                    <div className="sidebar-content" style={{ display: rightSidebarCollapsed ? 'none' : 'flex' }}>
                        {panels.markets && <MarketsPanel />}
                        {panels.sectors && <SectorHeatmap />}
                        {panels.commodities && <CommoditiesPanel />}
                        {panels.congress && <CongressPanel />}
                        {panels.whales && <WhalePanel />}
                        {panels.moneyPrinter && <MoneyPrinterPanel />}
                        {panels.contracts && <ContractsPanel />}
                    </div>
                </aside>
            </div>

            {/* Footer with status info */}
            <footer className="app-footer" style={{ position: 'relative', zIndex: 10 }}>
                <div className="footer-left">
                    <span className="terminal-prompt">&gt;</span>
                    <span className={`footer-tagline ${FOOTER_TAGLINES[taglineIndex].type === 'ascii' ? 'ascii-art' : ''}`}>
                        {FOOTER_TAGLINES[taglineIndex].content}
                    </span>
                    <span className="footer-separator">|</span>
                    <div className="footer-stats">
                        <span className="stat-item">
                            <span className="stat-label">NEWS</span>
                            <span className="stat-value">{allNews.length}</span>
                        </span>
                        <span className="stat-item">
                            <span className="stat-label">EVENTS</span>
                            <span className="stat-value">{conflictEvents.length}</span>
                        </span>
                        <span className="stat-item">
                            <span className="stat-label">QUAKES</span>
                            <span className="stat-value">{earthquakes.length}</span>
                        </span>
                    </div>
                </div>
                <div className="footer-center">
                    <span className="stat-item">
                        <span className="stat-label">UPDATED</span>
                        <span className="stat-value">
                            {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '--:--:--'}
                        </span>
                    </span>
                    <span className="footer-separator">|</span>
                    <span className="live-indicator-small">
                        <span className="live-dot" />
                        LIVE
                    </span>
                </div>
                <div className="footer-right desktop-only">
                    {visitorCount !== null && (
                        <>
                            <span className="stat-item" style={{ marginRight: '16px' }}>
                                <span className="stat-label">VISITORS</span>
                                <span className="stat-value">{visitorCount.toLocaleString()}</span>
                            </span>
                            <span className="footer-separator">|</span>
                        </>
                    )}
                    <kbd>Ctrl+R</kbd> Refresh
                </div>
            </footer>
        </div>
    );
};

export default UIOverlay;
