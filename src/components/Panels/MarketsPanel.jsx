import React from 'react';
import { MOCK_MARKETS } from '../../data/mockData';

const MarketsPanel = () => {
    const accent = '#4da6ff';
    const bg = 'rgba(12, 15, 25, 0.92)';
    const border = '#2a3040';
    const textDim = '#8892a8';

    const formatValue = (val) => {
        if (val >= 1000) return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
        return val.toFixed(2);
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ color: accent, fontWeight: 'bold', letterSpacing: '1px', fontSize: '10px' }}>
                    MARKET DATA
                </span>
                <span style={{ color: accent, fontSize: '9px' }}>● LIVE</span>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '6px', scrollBehavior: 'smooth' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: textDim, fontSize: '9px', borderBottom: `1px solid ${border}` }}>
                            <th style={{ textAlign: 'left', paddingBottom: '6px' }}>TICKER</th>
                            <th style={{ textAlign: 'left', paddingBottom: '6px' }}>NAME</th>
                            <th style={{ textAlign: 'right', paddingBottom: '6px' }}>PRICE</th>
                            <th style={{ textAlign: 'right', paddingBottom: '6px' }}>CHG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_MARKETS.map((m) => (
                            <tr key={m.symbol} style={{ borderBottom: `1px solid #1a1e28` }}>
                                <td style={{ padding: '6px 0', color: accent, fontWeight: 'bold' }}>{m.symbol}</td>
                                <td style={{ padding: '6px 0', color: textDim, fontSize: '10px' }}>{m.name}</td>
                                <td style={{ padding: '6px 0', textAlign: 'right', color: '#e0e4eb' }}>{formatValue(m.value)}</td>
                                <td style={{
                                    padding: '6px 0',
                                    textAlign: 'right',
                                    color: m.change >= 0 ? '#2ed573' : '#ff4757',
                                    fontWeight: 'bold'
                                }}>
                                    {m.change >= 0 ? '+' : ''}{m.change.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketsPanel;
