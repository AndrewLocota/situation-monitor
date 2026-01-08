import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import { timeAgo } from '../../utils/timeFormat';
import './Panels.css';

export function CongressPanel() {
    const { congressTrades, loading } = useDataStore();
    const isLive = !loading?.congress && congressTrades.length > 0;

    return (
        <ASCIIBox
            title="CONGRESS TRADES"
            collapsible
            defaultCollapsed={true}
            headerRight={<span className="panel-count">{congressTrades.length}</span>}
            isLive={isLive}
            isLoading={loading?.congress}
            dataSource="House/Senate"
        >
            {loading?.congress && congressTrades.length === 0 ? (
                <div className="panel-loading">Loading trades...</div>
            ) : congressTrades.length === 0 ? (
                <div className="panel-empty">No recent trades</div>
            ) : (
                <div className="congress-list">
                    {congressTrades.map((trade, i) => (
                        <div key={i} className="congress-item">
                            <div className="congress-info">
                                <div className="congress-top">
                                    <span className="congress-name">{trade.name}</span>
                                    <span className={`congress-party ${trade.party}`}>{trade.party}</span>
                                </div>
                                <div className="congress-ticker">{trade.ticker}</div>
                                <div className="congress-meta">
                                    {timeAgo(trade.date)} / {trade.district}
                                </div>
                            </div>
                            <div className="congress-trade">
                                <span className={`congress-action ${trade.type}`}>
                                    {trade.type.toUpperCase()}
                                </span>
                                <div className="congress-amount">{trade.amount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ASCIIBox>
    );
}

export default CongressPanel;
