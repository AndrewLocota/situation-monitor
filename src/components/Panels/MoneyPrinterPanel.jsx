import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

export function MoneyPrinterPanel() {
    const { fedData, loading } = useDataStore();

    // Use fedData if available, otherwise show placeholder
    const m2 = fedData?.m2 || 6.8;
    const fedRate = fedData?.fedFundsRate || 4.5;
    const inflation = fedData?.inflationRate || 2.9;
    const change = fedData?.change || 0;
    const changePercent = fedData?.changePercent || 0;
    const percentOfMax = fedData?.percentOfMax || 75;

    const data = {
        value: m2,
        change: change,
        changePercent: changePercent,
        date: new Date().toISOString().slice(0, 10),
        percentOfMax: percentOfMax,
    };

    const isExpanding = data.change > 0;
    const status = isExpanding ? 'PRINTER ON' : 'PRINTER OFF';
    const isLive = !loading?.fed && fedData?.m2;

    return (
        <ASCIIBox
            title="MONEY PRINTER"
            collapsible
            defaultCollapsed={true}
            isLive={isLive}
            isLoading={loading?.fed}
            dataSource="FRED"
        >
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
