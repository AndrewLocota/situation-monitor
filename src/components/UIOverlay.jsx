import { useState, useEffect } from 'react';
import { Header } from './layout/Header';
import MusicPlayer from './MusicPlayer';
import NewsTicker from './NewsTicker';
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
    TwitterIntelPanel,
} from './panels';
import HoloCallBox from './HoloCallBox';
import { useHoloCall } from '../hooks';
import { useDataStore, useSettingsStore } from '../stores';
import { fetchWithCircuitBreaker } from '../utils/circuitBreaker';
import '../App.css';

/**
 * UIOverlay - Contains all static UI elements that overlay the map
 * including the header, sidebars with panels, and footer.
 * The map is passed as children and rendered in the center area.
 */
const UIOverlay = ({ onRefresh, videoPlaying, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1000);
    const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(() => window.innerWidth < 1000);
    const [utcNow, setUtcNow] = useState(new Date());

    const { isLoading, error, allNews, conflictEvents, earthquakes, holoCall, closeHoloCall } = useDataStore();
    const { panels } = useSettingsStore();

    // Initialize HoloCall hook for AI reactions
    useHoloCall();

    useEffect(() => {
        const interval = setInterval(() => setUtcNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatUTC = (date) => date.toISOString().substring(11, 19);
    const formatDate = (date) => date.toISOString().substring(0, 10);

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

                const data = await fetchWithCircuitBreaker(
                    'visitor-count',
                    async () => {
                        const response = await fetch(url);
                        return response.json();
                    },
                    {
                        failureThreshold: 2,
                        timeout: 300000, // Wait 5 minutes before retry (not critical)
                        maxTimeout: 1800000 // Max 30 minutes
                    }
                );

                if (data && data.value) {
                    setVisitorCount(data.value);
                    if (!hasCounted) {
                        sessionStorage.setItem(key, 'true');
                    }
                }
            } catch (err) {
                // Silently fail - visitor count is not critical
                // Circuit breaker will prevent excessive retries
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

            {/* HoloCall Box - MGS Codec-style AI reactions */}
            <HoloCallBox
                isOpen={holoCall.isOpen}
                characterId={holoCall.characterId}
                message={holoCall.message}
                isLoading={holoCall.isLoading}
                newsItem={holoCall.newsItem}
                onClose={closeHoloCall}
            />

            {/* Header with Theatre Navigation and Music Player */}
            <Header onRefresh={onRefresh} musicPlayer={<MusicPlayer forcePause={videoPlaying} />} />

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
                        {panels.twitterIntel && <TwitterIntelPanel />}
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
                    <span className="ascii-pill" aria-label="Current UTC time">
                        <span className="ascii-pill-bracket">[</span>
                        <span className="ascii-pill-label">UTC</span>
                        <span className="ascii-pill-value">{formatUTC(utcNow)}</span>
                        <span className="ascii-pill-bracket">]</span>
                    </span>
                    <span className="footer-separator">|</span>
                    <span className="stat-item" aria-label="Current UTC date">
                        <span className="stat-label">DATE</span>
                        <span className="stat-value">{formatDate(utcNow)}</span>
                    </span>
                    <span className="footer-separator">|</span>
                    <span className="live-indicator-small">
                        <span className="live-dot" />
                        LIVE
                    </span>
                </div>
                <div className="footer-right desktop-only">
                    <NewsTicker news={allNews} />
                    <span className="footer-separator">|</span>
                    {visitorCount !== null && (
                        <>
                            <span className="stat-item">
                                <span className="stat-label">VIS</span>
                                <span className="stat-value">{visitorCount.toLocaleString()}</span>
                            </span>
                            <span className="footer-separator">|</span>
                        </>
                    )}
                    <kbd>Ctrl+R</kbd>
                </div>
            </footer>
        </div>
    );
};

export default UIOverlay;
