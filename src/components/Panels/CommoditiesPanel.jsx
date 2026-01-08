import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

export function CommoditiesPanel() {
    const { commodities, isLoading } = useDataStore();

    // Fallback data
    const defaultCommodities = [
        { symbol: 'GC=F', name: 'Gold', price: 0, change: 0 },
        { symbol: 'SI=F', name: 'Silver', price: 0, change: 0 },
        { symbol: 'CL=F', name: 'Crude Oil', price: 0, change: 0 },
        { symbol: 'NG=F', name: 'Nat Gas', price: 0, change: 0 },
        { symbol: '^VIX', name: 'VIX', price: 0, change: 0 },
    ];

    const displayItems = commodities.length > 0 ? commodities : defaultCommodities;

    const formatPrice = (price, symbol) => {
        if (symbol === '^VIX' || symbol === 'VIX') return price.toFixed(2);
        return `$${price.toFixed(2)}`;
    };

    return (
        <ASCIIBox
            title="COMMODITIES / VIX"
            collapsible
            defaultCollapsed={true}
            headerRight={<span className="panel-count">{displayItems.length}</span>}
        >
            {isLoading && commodities.length === 0 ? (
                <div className="panel-loading">Loading commodities...</div>
            ) : (
                <div className="commodities-list">
                    {displayItems.map((item, i) => (
                        <div key={i} className="commodity-item">
                            <div className="commodity-info">
                                <span className="commodity-symbol">{item.symbol}</span>
                                <span className="commodity-name">{item.name}</span>
                            </div>
                            <div className="commodity-values">
                                <span className="commodity-price">{formatPrice(item.price, item.symbol)}</span>
                                <span className={`commodity-change ${item.change >= 0 ? 'up' : 'down'}`}>
                                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ASCIIBox>
    );
}

export default CommoditiesPanel;
