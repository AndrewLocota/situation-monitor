import { useState } from 'react';
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
                    <div className={`live-indicator ${isLoading ? 'syncing' : ''}`}>
                        <span className="live-dot" />
                        <span className="live-text">{isLoading ? 'SYNCING' : 'LIVE'}</span>
                    </div>
                    {/* Mobile Time Display */}
                    <div className="header-time mobile-only" style={{ marginLeft: '8px', border: 'none', background: 'transparent', padding: 0 }}>
                        <span className="header-time-value" style={{ fontSize: '11px' }}>{new Date().toISOString().substring(11, 19)} UTC</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="header-time desktop-only">
                        <span className="header-time-label">UTC</span>
                        <span className="header-time-value">{new Date().toISOString().substring(11, 19)}</span>
                    </div>
                    <div className="header-date">{new Date().toISOString().substring(0, 10)}</div>
                    <button
                        className="header-btn"
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

                    {!sidebarCollapsed && (
                        <div className="sidebar-content">
                            {panels.newsFeed && <NewsFeed />}
                            {panels.polymarket && <PolymarketPanel />}
                            {panels.mainChar && <MainCharPanel />}
                        </div>
                    )}
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

                    {/* Status bar */}
                    <div className="status-bar" style={{ pointerEvents: 'auto' }}>
                        <div className="status-item">
                            <span className="status-label">NEWS</span>
                            <span className="status-value">{allNews.length}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">EVENTS</span>
                            <span className="status-value">{conflictEvents.length}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">QUAKES</span>
                            <span className="status-value">{earthquakes.length}</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">LAST UPDATE</span>
                            <span className="status-value">
                                {lastUpdate
                                    ? new Date(lastUpdate).toLocaleTimeString()
                                    : '--:--:--'}
                            </span>
                        </div>
                        <div className="status-item live">
                            <span className="live-dot" />
                            <span>LIVE</span>
                        </div>
                    </div>
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

                    {!rightSidebarCollapsed && (
                        <div className="sidebar-content">
                            {panels.markets && <MarketsPanel />}
                            {panels.sectors && <SectorHeatmap />}
                            {panels.commodities && <CommoditiesPanel />}
                            {panels.congress && <CongressPanel />}
                            {panels.whales && <WhalePanel />}
                            {panels.moneyPrinter && <MoneyPrinterPanel />}
                            {panels.contracts && <ContractsPanel />}
                        </div>
                    )}
                </aside>
            </div>

            {/* Footer status */}
            <footer className="app-footer" style={{ position: 'relative', zIndex: 10 }}>
                <div className="footer-left">
                    <span className="terminal-prompt">&gt;</span>
                    <span className="footer-status">
                        SITUATION MONITOR v3.0 | OPERATIONAL
                    </span>
                </div>
                <div className="footer-center">
                    <span className="blink">█</span> AWAITING INPUT
                </div>
                <div className="footer-right">
                    <kbd>[</kbd> Left Panel <kbd>]</kbd> Right Panel <kbd>Ctrl+R</kbd> Refresh
                </div>
            </footer>
        </div>
    );
};

export default UIOverlay;
