import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

export function SectorHeatmap() {
    const { sectors, loading } = useDataStore();
    const isLive = sectors.length > 0;

    // Static sector data as fallback
    const defaultSectors = [
        { name: 'Tech', symbol: 'XLK', change: 0 },
        { name: 'Health', symbol: 'XLV', change: 0 },
        { name: 'Finance', symbol: 'XLF', change: 0 },
        { name: 'Energy', symbol: 'XLE', change: 0 },
        { name: 'Consumer', symbol: 'XLY', change: 0 },
        { name: 'Industrial', symbol: 'XLI', change: 0 },
        { name: 'Materials', symbol: 'XLB', change: 0 },
        { name: 'Utilities', symbol: 'XLU', change: 0 },
    ];

    const displaySectors = sectors.length > 0 ? sectors : defaultSectors;

    const getColor = (change) => {
        if (change >= 2) return 'var(--accent-green, #00ff88)';
        if (change >= 1) return '#66cc88';
        if (change >= 0.5) return '#88aa88';
        if (change >= 0) return '#888888';
        if (change >= -0.5) return '#aa8888';
        if (change >= -1) return '#cc6666';
        return 'var(--accent-red, #ff4444)';
    };

    const getBgOpacity = (change) => {
        const absChange = Math.abs(change);
        return Math.min(0.3 + absChange * 0.1, 0.6);
    };

    return (
        <ASCIIBox title="SECTOR HEATMAP" collapsible defaultCollapsed={true} isLive={isLive} dataSource="Yahoo">
            <div className="heatmap-grid">
                {displaySectors.map((sector, i) => (
                    <div
                        key={i}
                        className="heatmap-cell"
                        style={{
                            backgroundColor: `rgba(${sector.change >= 0 ? '0, 255, 136' : '255, 68, 68'}, ${getBgOpacity(sector.change)})`,
                            color: getColor(sector.change)
                        }}
                    >
                        <div className="heatmap-name">{sector.name}</div>
                        <div className="heatmap-change">
                            {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </ASCIIBox>
    );
}

export default SectorHeatmap;
