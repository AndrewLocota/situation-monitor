import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

export function ContractsPanel() {
    const { govContracts, isLoading } = useDataStore();

    const formatValue = (v) => {
        if (v >= 1000000000) return `$${(v / 1000000000).toFixed(1)}B`;
        if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
        return `$${v.toFixed(0)}`;
    };

    return (
        <ASCIIBox
            title="GOV CONTRACTS"
            collapsible
            defaultCollapsed={true}
            headerRight={<span className="panel-count">{govContracts.length}</span>}
        >
            {isLoading && govContracts.length === 0 ? (
                <div className="panel-loading">Loading contracts...</div>
            ) : govContracts.length === 0 ? (
                <div className="panel-empty">No contracts to display</div>
            ) : (
                <div className="contracts-list">
                    {govContracts.map((c, i) => (
                        <div key={i} className="contract-item">
                            <div className="contract-agency">{c.agency}</div>
                            <div className="contract-desc">
                                {c.description.substring(0, 80)}{c.description.length > 80 ? '...' : ''}
                            </div>
                            <div className="contract-meta">
                                <span className="contract-vendor">{c.vendor}</span>
                                <span className="contract-value">{formatValue(c.amount)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ASCIIBox>
    );
}

export default ContractsPanel;
