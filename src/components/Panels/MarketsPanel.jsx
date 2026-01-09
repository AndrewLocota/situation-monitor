import { useState, useEffect } from 'react';
import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

// ASCII Skeleton for Markets - shows animated placeholder items
const MarketsSkeleton = ({ count = 5 }) => {
    const [charIndex, setCharIndex] = useState(0);
    const ASCII_CHARS = ['░', '▒', '▓', '█', '▓', '▒'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCharIndex(i => (i + 1) % ASCII_CHARS.length);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="markets-skeleton">
            <div className="markets-section">
                <div className="markets-section-title ascii-shimmer">INDICES</div>
                <div className="markets-grid">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="market-item skeleton-item">
                            <div className="market-symbol ascii-placeholder">
                                {ASCII_CHARS[(charIndex + i) % ASCII_CHARS.length].repeat(3)}
                            </div>
                            <div className="market-price ascii-placeholder">
                                {ASCII_CHARS[(charIndex + i + 1) % ASCII_CHARS.length].repeat(6)}
                            </div>
                            <div className="market-change ascii-placeholder">
                                {ASCII_CHARS[(charIndex + i + 2) % ASCII_CHARS.length].repeat(4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="markets-section">
                <div className="markets-section-title ascii-shimmer">CRYPTO</div>
                <div className="markets-grid">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="market-item skeleton-item">
                            <div className="market-symbol ascii-placeholder">
                                {ASCII_CHARS[(charIndex + i + 3) % ASCII_CHARS.length].repeat(3)}
                            </div>
                            <div className="market-price ascii-placeholder">
                                {ASCII_CHARS[(charIndex + i + 4) % ASCII_CHARS.length].repeat(6)}
                            </div>
                            <div className="market-change ascii-placeholder">
                                {ASCII_CHARS[(charIndex + i + 5) % ASCII_CHARS.length].repeat(4)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
                <MarketsSkeleton count={5} />
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
