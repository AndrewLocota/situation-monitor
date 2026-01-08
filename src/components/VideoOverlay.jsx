import React from 'react';
import { X } from 'lucide-react';

const VideoOverlay = ({ video, onClose }) => {
    if (!video) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                position: 'relative',
                width: '80%', maxWidth: '800px',
                border: '1px solid #4da6ff',
                background: '#000',
                padding: '2px',
                boxShadow: '0 0 30px rgba(77, 166, 255, 0.2)'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    background: 'rgba(77, 166, 255, 0.1)',
                    padding: '8px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: '1px solid #4da6ff'
                }}>
                    <span style={{ fontFamily: 'monospace', color: '#4da6ff', fontSize: '12px', letterSpacing: '1px' }}>
                        VIDEO INTEL // {video.title}
                    </span>
                    <button onClick={onClose} style={{ color: '#4da6ff', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>
                {/* Video */}
                <video
                    src={video.src}
                    controls
                    autoPlay
                    loop
                    muted={false} // AutoPlay usually requires mute, but user clicked marker so it's allowed.
                    style={{ width: '100%', display: 'block', maxHeight: '70vh' }}
                />
                {/* Footer */}
                <div style={{
                    background: 'rgba(77, 166, 255, 0.1)',
                    padding: '4px 8px',
                    fontFamily: 'monospace', fontSize: '10px', color: '#4da6ff',
                    borderTop: '1px solid #4da6ff',
                    display: 'flex', justifyContent: 'space-between'
                }}>
                    <span>SRC: {video.id.toUpperCase()}</span>
                    <span>SIGNAL: ENCRYPTED // LOOP: ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

export default VideoOverlay;
