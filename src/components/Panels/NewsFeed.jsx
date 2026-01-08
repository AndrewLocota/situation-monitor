import { useState } from 'react';
import { ASCIIBox } from '../ui';
import { ASCIILoader } from '../ui/ASCIILoader';
import { useDataStore } from '../../stores';
import { timeAgo } from '../../utils/timeFormat';
import './Panels.css';

const CATEGORIES = ['all', 'politics', 'tech', 'finance', 'intel', 'ai'];

export function NewsFeed() {
    const [category, setCategory] = useState('all');
    const [maxItems, setMaxItems] = useState(20);
    const { allNews, loading, lastUpdated } = useDataStore();

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

    return (
        <ASCIIBox
            title="NEWS FEED"
            collapsible
            defaultCollapsed={false}
            isLive={true}
            isLoading={loading.news}
            lastUpdated={lastUpdated.news}
            dataSource="RSS"
            headerRight={
                <span className="panel-count">{filteredNews.length}</span>
            }
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
                {loading.news && filteredNews.length === 0 ? (
                    <ASCIILoader text="SYNCING FEEDS" variant="spinner" />
                ) : filteredNews.length === 0 ? (
                    <div className="panel-empty">No news items</div>
                ) : (
                    filteredNews.map((item, i) => {
                        const isAlert = (item.title || '').toLowerCase().includes('breaking') ||
                            (item.title || '').toLowerCase().includes('urgent');
                        return (
                            <div key={item.id || i} className={`news-item ${isAlert ? 'alert' : ''}`}>
                                <div className="news-meta">
                                    <span className="news-source">{item.source}</span>
                                    <span className="news-time">{timeAgo(item.pubDate)}</span>
                                </div>
                                <a
                                    className="news-title"
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {isAlert && <span className="news-alert-badge">!</span>}
                                    {item.title}
                                </a>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Load more */}
            {filteredNews.length >= maxItems && (
                <button
                    className="load-more-btn"
                    onClick={() => setMaxItems(prev => prev + 20)}
                >
                    LOAD MORE
                </button>
            )}
        </ASCIIBox>
    );
}

export default NewsFeed;
