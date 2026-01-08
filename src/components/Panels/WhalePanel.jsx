import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

export function WhalePanel() {
    const { whaleTransactions, isLoading } = useDataStore();

    const formatAmount = (amt) => {
        if (amt >= 1000) return `${(amt / 1000).toFixed(1)}K`;
        return amt.toFixed(2);
    };

    const formatUSD = (usd) => {
        if (usd >= 1000000000) return `$${(usd / 1000000000).toFixed(1)}B`;
        if (usd >= 1000000) return `$${(usd / 1000000).toFixed(1)}M`;
        return `$${(usd / 1000).toFixed(0)}K`;
    };

    return (
        <ASCIIBox
            title="WHALE WATCH"
            collapsible
            defaultCollapsed={true}
            headerRight={<span className="panel-count">{whaleTransactions.length}</span>}
        >
            {isLoading && whaleTransactions.length === 0 ? (
                <div className="panel-loading">Scanning blockchain...</div>
            ) : whaleTransactions.length === 0 ? (
                <div className="panel-empty">No whale transactions detected</div>
            ) : (
                <div className="whale-list">
                    {whaleTransactions.map((tx, i) => (
                        <div key={i} className="whale-item">
                            <div className="whale-header">
                                <span className="whale-coin">{tx.coin}</span>
                                <span className="whale-amount">{formatAmount(tx.amount)} {tx.coin}</span>
                            </div>
                            <div className="whale-flow">
                                <span className="whale-usd">{formatUSD(tx.usd)}</span>
                                <span className="whale-arrow">-&gt;</span>
                                <span className="whale-hash">{tx.hash}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ASCIIBox>
    );
}

export default WhalePanel;
