import { useEffect, useState, useRef, useMemo } from 'react';
import './NewsTicker.css';

/**
 * NewsTicker - Scrolling news headlines ticker for footer
 * Seamlessly integrates with existing terminal aesthetic
 * Shows ALL news articles sorted chronologically (newest first)
 * Automatically updates when new articles are loaded
 */
export function NewsTicker({ news = [] }) {
    const tickerRef = useRef(null);
    const [sortedNews, setSortedNews] = useState([]);

    useEffect(() => {
        if (!news || news.length === 0) {
            setSortedNews([]);
            return;
        }
        // Sort by date (newest first) - this ensures ALL news items are included
        const items = [...news].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // No need to duplicate items - the CSS creates the seamless loop
        // by duplicating the content (ticker-loop-group appears twice)
        setSortedNews(items);
    }, [news]);

    // Calculate animation duration based on content length
    const animationDuration = useMemo(() => {
        if (sortedNews.length === 0) return '60s';

        // Multiplied speed again by 10x (Total 150x original): 12000 pixels per second
        const pixelsPerSecond = 12000;

        // Estimate total width: avg 8px per char + separators (40px each)
        const charCount = sortedNews.reduce((acc, item) => acc + (item.title?.length || 0), 0);
        const estimatedWidth = charCount * 8 + (sortedNews.length * 40);

        // Calculate duration: total width / speed
        // The animation moves 50% (one full loop), so we use estimatedWidth as the distance
        // Lowered minimum duration to 1s to support high speeds
        const duration = Math.max(1, estimatedWidth / pixelsPerSecond);

        console.log(`[NewsTicker] ${sortedNews.length} items, ~${estimatedWidth}px, ${duration.toFixed(1)}s duration`);

        return `${duration.toFixed(1)}s`;
    }, [sortedNews]);

    return (
        <div className="news-ticker-container">
            <span className="ticker-label">NEWS ({sortedNews.length}):</span>
            <div className="news-ticker-wrapper">
                <div
                    className="news-ticker-content"
                    ref={tickerRef}
                    key={sortedNews.length} // Force re-render and animation restart when data changes
                    style={{ animationDuration }}
                >
                    {/* First Loop - All news items */}
                    <div className="ticker-loop-group">
                        {sortedNews.map((item, idx) => (
                            <span key={`t1-${item.id || idx}`} className="ticker-item">
                                <span className="ticker-source">[{item.source}]</span>
                                {item.title?.replace(/^\[.*?\]\s*/, '')}
                                <span className="ticker-separator">•</span>
                            </span>
                        ))}
                    </div>
                    {/* Second Loop (Duplicate for seamless scrolling) */}
                    <div className="ticker-loop-group" aria-hidden="true">
                        {sortedNews.map((item, idx) => (
                            <span key={`t2-${item.id || idx}`} className="ticker-item">
                                <span className="ticker-source">[{item.source}]</span>
                                {item.title?.replace(/^\[.*?\]\s*/, '')}
                                <span className="ticker-separator">•</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsTicker;
