import { ASCIIBox } from '../ui';
import { ASCIILoader } from '../ui/ASCIILoader';
import { useDataStore } from '../../stores';
import './Panels.css';

export function PolymarketPanel() {
    const { polymarket, loading, lastUpdated } = useDataStore();

    const formatVolume = (vol) => {
        if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
        if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
        return `$${vol.toFixed(0)}`;
    };

    return (
        <ASCIIBox
            title="PREDICTION MARKETS"
            collapsible
            defaultCollapsed={false}
            isLive={true}
            isLoading={loading.polymarket}
            lastUpdated={lastUpdated.polymarket}
            dataSource="Polymarket"
            headerRight={
                <span className="panel-count">{polymarket.length}</span>
            }
        >
            {loading.polymarket && polymarket.length === 0 ? (
                <ASCIILoader text="LOADING PREDICTIONS" variant="dots" />
            ) : polymarket.length === 0 ? (
                <div className="panel-empty">No prediction data</div>
            ) : (
                <div className="polymarket-list">
                    {polymarket.map((item, i) => {
                        const probability = item.probability !== undefined
                            ? Math.round(item.probability * 100)
                            : (item.yes || 50);
                        return (
                            <div key={item.id || i} className="polymarket-item">
                                <div className="polymarket-question">{item.question}</div>
                                <div className="polymarket-odds">
                                    <div className="polymarket-bar">
                                        <div
                                            className="polymarket-fill"
                                            style={{ width: `${probability}%` }}
                                        />
                                    </div>
                                    <div className="polymarket-values">
                                        <span className="polymarket-yes">{probability}%</span>
                                        <span className="polymarket-vol">{formatVolume(item.volume)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </ASCIIBox>
    );
}

export default PolymarketPanel;
