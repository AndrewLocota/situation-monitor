import { useDataStore } from '../../stores';
import { ASCIIBox } from '../ui';
import { geolocateNews } from '../../utils/geolocateNews';
import { timeAgo } from '../../utils/timeFormat';
import './Panels.css';

export function TwitterIntelPanel() {
    const { twitterEvents, loading, setSelectedNews } = useDataStore();

    const isLoading = loading?.twitter || false;

    const handleTweetClick = (tweet) => {
        // Try to geolocate the tweet using existing news geolocation
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

    return (
        <ASCIIBox title="TWITTER INTEL" collapsible defaultCollapsed={false} isLive={true} dataSource="@WarMonitors">
            {isLoading && twitterEvents.length === 0 ? (
                <div className="panel-loading">Loading intel...</div>
            ) : twitterEvents.length === 0 ? (
                <div className="panel-empty">No Twitter intel available</div>
            ) : (
                <div className="twitter-feed">
                    {twitterEvents.map((tweet) => {
                        const location = geolocateNews({
                            title: tweet.title,
                            description: tweet.description
                        });
                        const hasLocation = !!location;

                        return (
                            <div key={tweet.id} className="twitter-item">
                                <div className="twitter-header">
                                    <span className="twitter-source">@{tweet.username}</span>
                                    <span className="twitter-time">{timeAgo(tweet.pubDate)}</span>
                                </div>
                                <div
                                    className={`twitter-title ${hasLocation ? 'clickable' : ''}`}
                                    onClick={() => hasLocation && handleTweetClick(tweet)}
                                    style={{ cursor: hasLocation ? 'pointer' : 'default' }}
                                >
                                    {hasLocation && <span className="location-icon">📍</span>}
                                    {tweet.title}
                                </div>
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
                </div>
            )}
        </ASCIIBox>
    );
}
