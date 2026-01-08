import { useMemo } from 'react';
import { ASCIIBox } from '../ui';
import { useDataStore } from '../../stores';
import './Panels.css';

// Common names to track in news
const NOTABLE_NAMES = [
    'Trump', 'Biden', 'Vance', 'Musk', 'Putin', 'Xi', 'Zelensky',
    'Harris', 'DeSantis', 'Haley', 'Netanyahu', 'Kim',
    'Pelosi', 'McConnell', 'Bezos', 'Zuckerberg', 'Gates',
    'Altman', 'Pichai', 'Cook', 'Nadella', 'Powell', 'Yellen'
];

export function MainCharPanel() {
    const { allNews, isLoading } = useDataStore();

    // Calculate main characters from news
    const characters = useMemo(() => {
        const counts = {};

        allNews.forEach(item => {
            const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
            NOTABLE_NAMES.forEach(name => {
                if (text.includes(name.toLowerCase())) {
                    counts[name] = (counts[name] || 0) + 1;
                }
            });
        });

        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [allNews]);

    if (characters.length === 0) {
        return (
            <ASCIIBox title="MAIN CHARACTER" collapsible defaultCollapsed={false} isLive={true} dataSource="Calculated from RSS headlines">
                {isLoading ? (
                    <div className="panel-loading">Analyzing headlines...</div>
                ) : (
                    <div className="panel-empty">No main character detected</div>
                )}
            </ASCIIBox>
        );
    }

    const [top, ...rest] = characters;

    return (
        <ASCIIBox title="MAIN CHARACTER" collapsible defaultCollapsed={false} isLive={true} dataSource="Calculated from RSS headlines">
            <div className="mainchar-display">
                <div className="mainchar-label">Today's Main Character</div>
                <div className="mainchar-name">{top.name}</div>
                <div className="mainchar-count">{top.count} mentions</div>

                {rest.length > 0 && (
                    <div className="mainchar-list">
                        {rest.slice(0, 7).map((char, i) => (
                            <div key={i} className="mainchar-row">
                                <span className="mainchar-rank">{i + 2}.</span>
                                <span className="mainchar-row-name">{char.name}</span>
                                <span className="mainchar-mentions">{char.count}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ASCIIBox>
    );
}

export default MainCharPanel;
