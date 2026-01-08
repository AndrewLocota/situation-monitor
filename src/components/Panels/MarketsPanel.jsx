import { ASCIIBox } from '../ui';
import { ASCIILoader } from '../ui/ASCIILoader';
import { useDataStore } from '../../stores';
import './Panels.css';

export function MarketsPanel() {
    const { markets, crypto, loading, lastUpdated } = useDataStore();

    const formatPrice = (price) => {
        if (price >= 1000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
        if (price >= 1) return price.toFixed(2);
        return price.toFixed(4);
    };

    const formatChange = (change) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)}%`;
    };

    return (
        <ASCIIBox
            title="MARKETS"
            collapsible
            defaultCollapsed={false}
            isLive={true}
            isLoading={loading.markets}
            lastUpdated={lastUpdated.markets}
            dataSource="Yahoo/CoinGecko"
            headerRight={
                <span className="panel-count">{markets.length + crypto.length}</span>
            }
        >
            {loading.markets && markets.length === 0 ? (
                <ASCIILoader text="FETCHING MARKETS" variant="spinner" />
            ) : (
                <>
                    {/* Stock Indices */}
                    {markets.length > 0 && (
                        <div className="markets-section">
                            <div className="markets-section-title">INDICES</div>
                            <div className="markets-grid">
                                {markets.map((item, i) => (
                                    <div key={i} className="market-item">
                                        <div className="market-symbol">{item.symbol}</div>
                                        <div className="market-price">${formatPrice(item.price)}</div>
                                        <div className={`market-change ${(item.changePercent || item.change) >= 0 ? 'up' : 'down'}`}>
                                            {formatChange(item.changePercent || item.change)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Crypto */}
                    {crypto.length > 0 && (
                        <div className="markets-section">
                            <div className="markets-section-title">CRYPTO</div>
                            <div className="markets-grid">
                                {crypto.map((item, i) => (
                                    <div key={i} className="market-item">
                                        <div className="market-symbol">{item.symbol}</div>
                                        <div className="market-price">${formatPrice(item.price)}</div>
                                        <div className={`market-change ${item.change24h >= 0 ? 'up' : 'down'}`}>
                                            {formatChange(item.change24h)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {markets.length === 0 && crypto.length === 0 && (
                        <div className="panel-empty">No market data</div>
                    )}
                </>
            )}
        </ASCIIBox>
    );
}

export default MarketsPanel;
