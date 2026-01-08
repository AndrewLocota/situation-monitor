import React from 'react';
import { MOCK_INTEL_FEED } from '../../data/mockData';

const NewsPanel = () => {
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
                    INTELLIGENCE FEED
                </span>
                <span style={{ color: textDim, fontSize: '9px' }}>GLOBAL</span>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '4px', scrollBehavior: 'smooth' }}>
                {MOCK_INTEL_FEED.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            borderBottom: `1px solid #1a1e28`,
                            padding: '8px',
                            cursor: 'pointer',
                            transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(77, 166, 255, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '9px',
                            color: textDim,
                            marginBottom: '3px'
                        }}>
                            <span>{item.time} // {item.source}</span>
                            <span style={{ color: accent }}>›</span>
                        </div>
                        <div style={{ color: '#c8cdd8', lineHeight: '1.4', fontSize: '10px' }}>
                            {item.title}
                        </div>
                    </div>
                ))}
                <div style={{
                    textAlign: 'center',
                    color: '#444',
                    padding: '10px',
                    fontSize: '9px'
                }}>
                    -- END OF STREAM --
                </div>
            </div>
        </div>
    );
};

export default NewsPanel;
