import { useState } from 'react';
import './ASCIIBox.css';

/**
 * Format relative time for "last updated" display
 */
const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 120) return '1 min ago';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 7200) return '1 hour ago';
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return 'Yesterday';
};

export function ASCIIBox({
    title,
    children,
    className = '',
    collapsible = true,
    defaultCollapsed = false,
    headerRight,
    count,
    status = 'normal',
    onCollapse,
    // New props for live/static indicators
    isLive = false,           // Whether this panel has live data
    lastUpdated = null,       // Timestamp of last update
    isLoading = false,        // Whether data is currently loading
    dataSource = null         // Optional: name of the data source (e.g., "CoinGecko", "RSS")
}) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    const handleToggle = () => {
        if (collapsible) {
            const newState = !collapsed;
            setCollapsed(newState);
            onCollapse?.(newState);
        }
    };

    return (
        <div className={`ascii-box ${className} ${status !== 'normal' ? `status-${status}` : ''}`}>
            <div className="ascii-box-header" onClick={handleToggle}>
                <div className="ascii-box-title">
                    <span className="ascii-box-bracket">[</span>
                    <span className="ascii-box-title-text">{title}</span>
                    {count !== undefined && (
                        <span className="ascii-box-count">{count}</span>
                    )}
                    <span className="ascii-box-bracket">]</span>

                    {/* Live/Static indicator */}
                    {isLive !== undefined && (
                        <span className={`ascii-box-live-badge ${isLive ? 'live' : 'static'} ${isLoading ? 'loading' : ''}`}>
                            {isLoading ? (
                                <>
                                    <span className="loading-dot"></span>
                                    SYNC
                                </>
                            ) : isLive ? (
                                <>
                                    <span className="live-dot-small"></span>
                                    LIVE
                                </>
                            ) : (
                                'STATIC'
                            )}
                        </span>
                    )}
                </div>
                <div className="ascii-box-header-right">
                    {/* Last updated indicator */}
                    {lastUpdated && !collapsed && (
                        <span className="ascii-box-updated" title={`Last updated: ${new Date(lastUpdated).toLocaleTimeString()}`}>
                            {formatRelativeTime(lastUpdated)}
                        </span>
                    )}
                    {/* Info icon with source tooltip */}
                    {dataSource && !collapsed && (
                        <span className="ascii-box-info" data-tooltip={dataSource}>
                            ⓘ
                        </span>
                    )}
                    {headerRight}
                    {collapsible && (
                        <span className="ascii-box-toggle">
                            {collapsed ? '[+]' : '[-]'}
                        </span>
                    )}
                </div>
            </div>
            {!collapsed && (
                <div className="ascii-box-content">
                    {isLoading && !children ? (
                        <div className="ascii-box-loading">
                            <span className="loading-text">SYNCING DATA...</span>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            )}
        </div>
    );
}

// Simpler panel variant
export function Panel({
    title,
    children,
    className = '',
    count,
    loading = false,
    error,
    isLive = false,
    lastUpdated = null
}) {
    return (
        <div className={`panel ${className}`}>
            <div className="panel-header">
                <span className="panel-title">{title}</span>
                <div className="panel-header-right">
                    {isLive && (
                        <span className={`panel-live-badge ${loading ? 'loading' : ''}`}>
                            {loading ? 'SYNC' : 'LIVE'}
                            <span className={`panel-live-dot ${loading ? 'syncing' : ''}`}></span>
                        </span>
                    )}
                    {lastUpdated && (
                        <span className="panel-updated">{formatRelativeTime(lastUpdated)}</span>
                    )}
                    {count !== undefined && (
                        <span className="panel-count">{count}</span>
                    )}
                </div>
            </div>
            <div className="panel-content">
                {loading ? (
                    <div className="panel-loading">Loading...</div>
                ) : error ? (
                    <div className="panel-error">{error}</div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

export default ASCIIBox;
