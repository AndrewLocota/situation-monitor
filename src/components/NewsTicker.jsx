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
        // Sort by date
        let items = [...news].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // Create a flat string representation to check length
        // We want the ticker loop to be physically long enough (e.g. > 2000 chars)
        // so the animation loop is wide and seamless.
        let currentLength = items.reduce((acc, i) => acc + (i.title?.length || 0), 0);

        if (currentLength > 0 && currentLength < 2000) {
            const originalItems = [...items];
            while (currentLength < 2000) { // Force it to be very wide
                const clones = originalItems.map((item, i) => ({
                    ...item,
                    id: `${item.id}-clone-${items.length + i}`
                }));
                items = [...items, ...clones];
                currentLength += clones.reduce((acc, i) => acc + (i.title?.length || 0), 0);
            }
        }

        setSortedNews(items);
    }, [news]);

    // Calculate animation duration
    const animationDuration = useMemo(() => {
        if (sortedNews.length === 0) return '30s';

        const baseSpeed = 18000; // Restored high speed (18000 pixels/sec)

        // Estimate width more accurately
        const charCount = sortedNews.reduce((acc, item) => acc + (item.title?.length || 0), 0);
        const estimatedWidth = charCount * 8 + (sortedNews.length * 40); // text + separators

        // Duration = Distance / Speed
        // Distance is the full width of the content
        const duration = Math.max(2, estimatedWidth / baseSpeed);

        return `${duration}s`;
    }, [sortedNews]);

    return (
        <div className="news-ticker-container">
            <span className="ticker-label">BREAKING ({sortedNews.length}):</span>
            <div className="news-ticker-wrapper">
                <div
                    className="news-ticker-content"
                    ref={tickerRef}
                    key={sortedNews.length} // Force re-render and animation restart when data changes
                    style={{ animationDuration }}
                >
                    {/* First Loop */}
                    <div className="ticker-loop-group">
                        {sortedNews.map((item, idx) => (
                            <span key={`t1-${item.id || idx}`} className="ticker-item">
                                {item.title?.replace(/^\[.*?\]\s*/, '')}
                                <span className="ticker-separator">•</span>
                            </span>
                        ))}
                    </div>
                    {/* Second Loop (Duplicate) */}
                    <div className="ticker-loop-group" aria-hidden="true">
                        {sortedNews.map((item, idx) => (
                            <span key={`t2-${item.id || idx}`} className="ticker-item">
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
