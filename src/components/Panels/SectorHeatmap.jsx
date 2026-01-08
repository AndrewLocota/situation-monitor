import React from 'react';
import { MOCK_SECTORS } from '../../data/mockData';

const SectorHeatmap = () => {
    const accent = '#4da6ff';
    const bg = 'rgba(12, 15, 25, 0.92)';
    const border = '#2a3040';

    const getColor = (change) => {
        if (change > 1.0) return { bg: '#0d3520', text: '#2ed573' };
        if (change > 0.5) return { bg: '#0a2d1f', text: '#2ed573' };
        if (change > 0) return { bg: '#0a1f18', text: '#5acc8c' };
        if (change < -1.5) return { bg: '#2d0a0a', text: '#ff6b6b' };
        if (change < -0.5) return { bg: '#250808', text: '#ff4757' };
        if (change < 0) return { bg: '#1f0a0a', text: '#cc6666' };
        return { bg: '#1a1e28', text: '#888' };
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${border}`,
            background: bg,
            backdropFilter: 'blur(8px)',
            fontFamily: 'monospace',
            fontSize: '11px'
        }}>
            <div style={{
                padding: '10px 12px',
                borderBottom: `1px solid ${border}`,
                color: accent,
                fontWeight: 'bold',
                letterSpacing: '1px',
                fontSize: '10px'
            }}>
                SECTOR HEATMAP
            </div>

            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '3px',
                padding: '6px'
            }}>
                {MOCK_SECTORS.map((s) => {
                    const colors = getColor(s.change);
                    return (
                        <div
                            key={s.symbol}
                            style={{
                                backgroundColor: colors.bg,
                                color: colors.text,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '6px 3px',
                                cursor: 'pointer',
                                border: `1px solid ${border}`,
                                transition: 'all 0.15s'
                            }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '9px' }}>{s.name}</span>
                            <span style={{ fontSize: '9px', marginTop: '2px' }}>
                                {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SectorHeatmap;
