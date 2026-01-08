import React from 'react';
import { MOCK_POLYMARKET } from '../../data/mockData';

const PolymarketPanel = () => {
    const accent = '#4da6ff';
    const bg = 'rgba(12, 15, 25, 0.92)';
    const border = '#2a3040';
    const textDim = '#8892a8';

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
                    PREDICTION MARKETS
                </span>
                <span style={{ color: '#6699ff', fontSize: '9px' }}>POLYMARKET</span>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '4px', scrollBehavior: 'smooth' }}>
                {MOCK_POLYMARKET.map((m, idx) => (
                    <div
                        key={idx}
                        style={{
                            borderBottom: `1px solid #1a1e28`,
                            padding: '8px'
                        }}
                    >
                        <div style={{
                            color: '#c8cdd8',
                            marginBottom: '5px',
                            fontSize: '10px',
                            lineHeight: '1.3'
                        }}>
                            {m.question}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '4px 8px',
                                background: 'rgba(46, 213, 115, 0.1)',
                                border: '1px solid rgba(46, 213, 115, 0.3)',
                                borderRadius: '2px'
                            }}>
                                <span style={{ color: '#2ed573', fontWeight: 'bold', fontSize: '9px' }}>YES</span>
                                <span style={{ color: '#5acc8c', fontSize: '9px' }}>{Math.round(m.yes * 100)}%</span>
                            </div>
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '4px 8px',
                                background: 'rgba(255, 71, 87, 0.1)',
                                border: '1px solid rgba(255, 71, 87, 0.3)',
                                borderRadius: '2px'
                            }}>
                                <span style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '9px' }}>NO</span>
                                <span style={{ color: '#cc8888', fontSize: '9px' }}>{Math.round(m.no * 100)}%</span>
                            </div>
                            <span style={{ color: textDim, fontSize: '8px', minWidth: '40px', textAlign: 'right' }}>
                                {m.volume}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PolymarketPanel;
