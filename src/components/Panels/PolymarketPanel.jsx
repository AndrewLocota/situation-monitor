import { useState } from 'react';
import { ASCIIBox, IranLink } from '../ui';
import { ASCIILoader } from '../ui/ASCIILoader';
import { useDataStore } from '../../stores';
import { useShallow } from 'zustand/react/shallow';
import './Panels.css';

export function PolymarketPanel() {
    const { polymarket, loading, lastUpdated } = useDataStore(
        useShallow(s => ({ polymarket: s.polymarket, loading: s.loading, lastUpdated: s.lastUpdated }))
    );
    const [maxItems, setMaxItems] = useState(10);

    const formatVolume = (vol) => {
        if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
        if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
        return `$${Math.round(vol)}`;
    };

    const displayed = polymarket.slice(0, maxItems);
    const hasMore = polymarket.length > maxItems;

    return (
        <ASCIIBox
            title="PREDICTION MARKETS"
            collapsible
            defaultCollapsed={false}
            isLive={true}
            isLoading={loading.polymarket}
            lastUpdated={lastUpdated.polymarket}
            dataSource="Polymarket"
            count={displayed.length}
        >
            {loading.polymarket && polymarket.length === 0 ? (
                <ASCIILoader text="LOADING PREDICTIONS" variant="dots" />
            ) : polymarket.length === 0 ? (
                <div className="panel-empty">No prediction data</div>
            ) : (
                <div className="polymarket-list">
                    {displayed.map((item, i) => {
                        const probability = item.probability !== undefined
                            ? Math.round(item.probability * 100)
                            : 50;
                        const change = item.priceChange || 0;
                        const changeAbs = Math.abs(Math.round(change * 100));
                        const changeDir = change > 0.005 ? '+' : change < -0.005 ? '-' : '';
                        const changeColor = change > 0.005 ? '#2ed573' : change < -0.005 ? '#ff4757' : '#5a6478';
                        const slug = item.slug;

                        return (
                            <div key={item.id || i} className="polymarket-item">
                                <div className="polymarket-question-row">
                                    {slug ? (
                                        <a
                                            href={`https://polymarket.com/event/${slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="polymarket-question polymarket-link"
                                            title="View on Polymarket"
                                        >
                                            <IranLink>{item.question}</IranLink>
                                        </a>
                                    ) : (
                                        <span className="polymarket-question"><IranLink>{item.question}</IranLink></span>
                                    )}
                                    {item.marketCount > 1 && (
                                        <span className="polymarket-subcount" title={`${item.marketCount} sub-markets`}>
                                            ×{item.marketCount}
                                        </span>
                                    )}
                                </div>
                                <div className="polymarket-odds">
                                    <div className="polymarket-bar">
                                        <div
                                            className="polymarket-fill"
                                            style={{ width: `${probability}%` }}
                                        />
                                    </div>
                                    <div className="polymarket-values">
                                        <span className="polymarket-yes">{probability}%</span>
                                        {changeDir && (
                                            <span className="polymarket-change" style={{ color: changeColor }}>
                                                {changeDir}{changeAbs}¢
                                            </span>
                                        )}
                                        <span className="polymarket-vol" title={`24h: ${formatVolume(item.volume24h || 0)}`}>
                                            {formatVolume(item.volume)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {hasMore && (
                <button
                    className="show-more-btn"
                    onClick={() => setMaxItems(prev => prev + 10)}
                >
                    SHOW MORE ({polymarket.length - displayed.length} remaining)
                </button>
            )}
        </ASCIIBox>
    );
}

export default PolymarketPanel;
