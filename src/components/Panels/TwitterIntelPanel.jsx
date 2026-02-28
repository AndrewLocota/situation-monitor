import { useState } from 'react';
import { useDataStore } from '../../stores';
import { ASCIIBox, IranLink } from '../ui';
import { geolocateNews } from '../../utils/geolocateNews';
import { timeAgo } from '../../utils/timeFormat';
import './Panels.css';

const BASE = import.meta.env.BASE_URL;
const TWITTER_AVATARS = {
    warmonitors: `${BASE}logos/twitter_warmonitors.jpg`,
    osintdefender: `${BASE}logos/twitter_osintdefender.jpg`,
    conflicts: `${BASE}logos/twitter_conflicts.jpg`,
    intelcrab: `${BASE}logos/twitter_intelcrab.jpg`,
    visegrad24: `${BASE}logos/visegrad24.jpg`,
    sentaboringtweet: `${BASE}logos/twitter_sentaboringtweet.jpg`,
};

// Skeleton loading component for twitter items (matches NewsFeed skeleton style)
const TwitterSkeleton = ({ count = 3 }) => (
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

export function TwitterIntelPanel() {
    const { twitterEvents, loading, setSelectedNews } = useDataStore();
    const [maxItems, setMaxItems] = useState(10);

    const isLoading = loading?.twitter || false;

    const handleTweetClick = (tweet) => {
        const location = geolocateNews({
            title: tweet.title,
            description: tweet.description
        });

        if (location) {
            setSelectedNews({
                id: tweet.id,
                location,
                ...tweet
            });
        }
    };

    const displayedTweets = twitterEvents.slice(0, maxItems);
    const hasMore = twitterEvents.length > maxItems;

    return (
        <ASCIIBox
            title="TWITTER INTEL"
            collapsible
            defaultCollapsed={false}
            isLive={true}
            isLoading={isLoading}
            dataSource="OSINT"
            count={displayedTweets.length}
        >
            <div className="twitter-feed">
                {isLoading && twitterEvents.length === 0 ? (
                    <TwitterSkeleton count={4} />
                ) : twitterEvents.length === 0 ? (
                    <div className="panel-empty">No Twitter intel available</div>
                ) : (
                    <>
                        {displayedTweets.map((tweet) => {
                            const location = geolocateNews({
                                title: tweet.title,
                                description: tweet.description
                            });
                            const hasLocation = !!location;

                            return (
                                <div key={tweet.id} className="twitter-item">
                                    <div className="twitter-header">
                                        <div className="twitter-source-row">
                                            {TWITTER_AVATARS[tweet.username?.toLowerCase()] && (
                                                <img
                                                    src={TWITTER_AVATARS[tweet.username.toLowerCase()]}
                                                    alt=""
                                                    className="twitter-avatar"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            )}
                                            <span className="twitter-source">@{tweet.username}</span>
                                        </div>
                                        <span className="twitter-time">{timeAgo(tweet.pubDate)}</span>
                                    </div>
                                    <div
                                        className={`twitter-title ${hasLocation ? 'clickable' : ''}`}
                                        onClick={() => hasLocation && handleTweetClick(tweet)}
                                        style={{ cursor: hasLocation ? 'pointer' : 'default' }}
                                    >
                                        {hasLocation && <span className="location-icon">📍</span>}
                                        <IranLink>{tweet.title}</IranLink>
                                    </div>
                                    {tweet.imageUrl && (
                                        <div className="twitter-media">
                                            <img
                                                src={tweet.imageUrl}
                                                alt=""
                                                className="twitter-media-img"
                                                loading="lazy"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    {tweet.videoUrl && !tweet.imageUrl && (
                                        <div className="twitter-media">
                                            <video
                                                src={tweet.videoUrl}
                                                controls
                                                muted
                                                preload="metadata"
                                                className="twitter-media-vid"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                    <div className="twitter-actions">
                                        {tweet.tweetId && (
                                            <a
                                                href={`https://twitter.com/i/status/${tweet.tweetId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="twitter-link"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Tweet ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {/* Show skeleton at bottom while loading more */}
                        {isLoading && twitterEvents.length > 0 && (
                            <TwitterSkeleton count={2} />
                        )}
                    </>
                )}
            </div>

            {/* Show more button - matches NewsFeed style */}
            {hasMore && (
                <button
                    className="show-more-btn"
                    onClick={() => setMaxItems(prev => prev + 10)}
                >
                    SHOW MORE ({twitterEvents.length - displayedTweets.length} remaining)
                </button>
            )}
        </ASCIIBox>
    );
}
