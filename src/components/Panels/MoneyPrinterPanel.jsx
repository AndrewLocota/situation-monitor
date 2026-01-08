import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

export function MoneyPrinterPanel() {
    const { fedData, fedBalance, isLoading } = useDataStore();

    // Use fedData if available, otherwise show placeholder
    const m2 = fedData?.m2 || 20.9;
    const fedRate = fedData?.fedFundsRate || 5.25;
    const inflation = fedData?.inflationRate || 3.4;

    const data = fedBalance || {
        value: m2,
        change: 0,
        changePercent: 0,
        date: new Date().toISOString().slice(0, 10),
        percentOfMax: 85,
    };

    const isExpanding = data.change > 0;
    const status = isExpanding ? 'PRINTER ON' : 'PRINTER OFF';

    return (
        <ASCIIBox title="MONEY PRINTER" collapsible defaultCollapsed={true}>
            <div className="printer-gauge">
                <div className="printer-label">Federal Reserve Balance Sheet</div>
                <div className="printer-value">
                    {data.value.toFixed(2)}<span className="printer-unit">T USD</span>
                </div>
                <div className={`printer-change ${isExpanding ? 'up' : 'down'}`}>
                    {data.change >= 0 ? '+' : ''}{(data.change * 1000).toFixed(0)}B
                    ({data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%) WoW
                </div>
                <div className="printer-bar">
                    <div
                        className="printer-fill"
                        style={{ width: `${Math.min(data.percentOfMax, 100)}%` }}
                    />
                </div>
                <div className="printer-status">
                    <span className={`printer-indicator ${isExpanding ? 'on' : 'off'}`} />
                    {status}
                </div>

                {/* Additional metrics */}
                <div className="printer-metrics">
                    <div className="printer-metric">
                        <span className="printer-metric-label">FED RATE</span>
                        <span className="printer-metric-value">{fedRate.toFixed(2)}%</span>
                    </div>
                    <div className="printer-metric">
                        <span className="printer-metric-label">INFLATION</span>
                        <span className="printer-metric-value">{inflation.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        </ASCIIBox>
    );
}

export default MoneyPrinterPanel;
