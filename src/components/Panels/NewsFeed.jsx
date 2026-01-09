import { useState } from 'react';
import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import { timeAgo } from '../../utils/timeFormat';
import { geolocateNews } from '../../utils/geolocateNews';
import './Panels.css';

const CATEGORIES = ['all', 'politics', 'tech', 'finance', 'intel', 'ai'];
const ITEMS_OPTIONS = [20, 50, 100];

// Bias meter component - GroundNews style
const BiasMeter = ({ bias = 0, biasLabel = 'Unknown', reliability = 'Unknown' }) => {
    // bias: -3 (far left) to +3 (far right), 0 = center
    // Convert to 0-6 scale for display (0=far left, 3=center, 6=far right)
    const position = bias + 3;

    // Color based on bias - Left=Red, Right=Blue
    const getBiasColor = (b) => {
        if (b <= -2) return '#ef4444'; // Red - Left
        if (b === -1) return '#f87171'; // Light red - Lean Left
        if (b === 0) return '#a855f7'; // Purple - Center
        if (b === 1) return '#60a5fa'; // Light blue - Lean Right
        return '#3b82f6'; // Blue - Right
    };

    const color = getBiasColor(bias);

    return (
        <div className="bias-meter-container" title={`${biasLabel} | Reliability: ${reliability}`}>
            <div className="bias-meter">
                <div className="bias-meter-track">
                    {/* 7 segments: Far Left, Left, Lean Left, Center, Lean Right, Right, Far Right */}
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <div
                            key={i}
                            className={`bias-segment ${i === position ? 'active' : ''}`}
                            style={{
                                backgroundColor: i === position ? color : 'var(--bg-tertiary)',
                                opacity: i === position ? 1 : 0.3
                            }}
                        />
                    ))}
                </div>
            </div>
            <div className="bias-tooltip">
                <div className="bias-tooltip-header">{biasLabel}</div>
                <div className="bias-tooltip-reliability">
                    Reliability: <span className={`reliability-${reliability.toLowerCase()}`}>{reliability}</span>
                </div>
            </div>
        </div>
    );
};

// Skeleton loading component for news items
const NewsSkeleton = ({ count = 5 }) => (
    <div className="news-skeleton">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="news-skeleton-item">
                <div className="news-skeleton-meta">
                    <span className="skeleton-line skeleton-source"></span>
                    <span className="skeleton-line skeleton-time"></span>
                </div>
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-title-short"></div>
            </div>
        ))}
    </div>
);

export function NewsFeed() {
    const [category, setCategory] = useState('all');
    const [maxItems, setMaxItems] = useState(20);
    const { allNews, loading, lastUpdated, setSelectedNews } = useDataStore();

    // Filter news by category (simple keyword matching)
    const filteredNews = allNews.filter(item => {
        if (category === 'all') return true;

        const titleLower = (item.title || '').toLowerCase();
        const sourceLower = (item.source || '').toLowerCase();

        switch (category) {
            case 'politics':
                return titleLower.includes('trump') || titleLower.includes('biden') ||
                    titleLower.includes('congress') || titleLower.includes('senate') ||
                    titleLower.includes('election') || titleLower.includes('political');
            case 'tech':
                return sourceLower.includes('tech') || titleLower.includes('ai') ||
                    titleLower.includes('tech') || titleLower.includes('apple') ||
                    titleLower.includes('google') || titleLower.includes('microsoft');
            case 'finance':
                return sourceLower.includes('market') || sourceLower.includes('bloomberg') ||
                    titleLower.includes('stock') || titleLower.includes('market') ||
                    titleLower.includes('economy');
            case 'intel':
                return titleLower.includes('ukraine') || titleLower.includes('russia') ||
                    titleLower.includes('military') || titleLower.includes('conflict') ||
                    titleLower.includes('war') || titleLower.includes('attack');
            case 'ai':
                return titleLower.includes('ai') || titleLower.includes('artificial intelligence') ||
                    titleLower.includes('openai') || titleLower.includes('chatgpt') ||
                    titleLower.includes('machine learning');
            default:
                return true;
        }
    }).slice(0, maxItems);

    // Check if there are more items available
    const totalFiltered = allNews.filter(item => {
        if (category === 'all') return true;
        const titleLower = (item.title || '').toLowerCase();
        const sourceLower = (item.source || '').toLowerCase();
        switch (category) {
            case 'politics':
                return titleLower.includes('trump') || titleLower.includes('biden') ||
                    titleLower.includes('congress') || titleLower.includes('senate') ||
                    titleLower.includes('election') || titleLower.includes('political');
            case 'tech':
                return sourceLower.includes('tech') || titleLower.includes('ai') ||
                    titleLower.includes('tech') || titleLower.includes('apple') ||
                    titleLower.includes('google') || titleLower.includes('microsoft');
            case 'finance':
                return sourceLower.includes('market') || sourceLower.includes('bloomberg') ||
                    titleLower.includes('stock') || titleLower.includes('market') ||
                    titleLower.includes('economy');
            case 'intel':
                return titleLower.includes('ukraine') || titleLower.includes('russia') ||
                    titleLower.includes('military') || titleLower.includes('conflict') ||
                    titleLower.includes('war') || titleLower.includes('attack');
            case 'ai':
                return titleLower.includes('ai') || titleLower.includes('artificial intelligence') ||
                    titleLower.includes('openai') || titleLower.includes('chatgpt') ||
                    titleLower.includes('machine learning');
            default:
                return true;
        }
    }).length;

    const hasMore = totalFiltered > maxItems;

    return (
        <ASCIIBox
            title="NEWS FEED"
            collapsible
            defaultCollapsed={false}
            isLive={true}
            isLoading={loading.news}
            lastUpdated={lastUpdated.news}
            dataSource="Reuters, AP, BBC, NPR, CNN RSS"
            count={filteredNews.length}
        >
            {/* Category filters */}
            <div className="news-filters">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${category === cat ? 'active' : ''}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="news-feed">
                {loading.news && allNews.length === 0 ? (
                    <NewsSkeleton count={6} />
                ) : filteredNews.length === 0 ? (
                    <div className="panel-empty">No news items</div>
                ) : (
                    <>
                        {filteredNews.map((item, i) => {
                            const isAlert = (item.title || '').toLowerCase().includes('breaking') ||
                                (item.title || '').toLowerCase().includes('urgent');
                            return (
                                <div key={item.id || i} className={`news-item ${isAlert ? 'alert' : ''}`}>
                                    <div className="news-meta">
                                        <span className="news-source">{item.source}</span>
                                        <BiasMeter
                                            bias={item.bias}
                                            biasLabel={item.biasLabel}
                                            reliability={item.reliability}
                                        />
                                        <span className="news-time">{timeAgo(item.pubDate)}</span>
                                    </div>
                                    <div className="news-title-row">
                                        <span
                                            className="news-title clickable"
                                            onClick={() => {
                                                const location = geolocateNews(item);
                                                if (location) {
                                                    setSelectedNews({ ...item, location });
                                                }
                                            }}
                                            title={geolocateNews(item) ? `Click to view on map (${geolocateNews(item)?.label})` : 'No location detected'}
                                        >
                                            {isAlert && <span className="news-alert-badge">!</span>}
                                            {item.title}
                                            {geolocateNews(item) && <span className="news-map-icon">📍</span>}
                                        </span>
                                        <a
                                            className="news-link-icon"
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Open article"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            ↗
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Show skeleton loading at bottom while more news is loading */}
                        {loading.news && allNews.length > 0 && (
                            <NewsSkeleton count={3} />
                        )}
                    </>
                )}
            </div>

            {/* Show more button */}
            {hasMore && (
                <button
                    className="show-more-btn"
                    onClick={() => setMaxItems(prev => prev + 10)}
                >
                    SHOW MORE ({totalFiltered - filteredNews.length} remaining)
                </button>
            )}

        </ASCIIBox>
    );
}

export default NewsFeed;
