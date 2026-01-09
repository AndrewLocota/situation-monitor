import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Radio, SkipBack, SkipForward } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

// Only include tracks that exist
const TRACKS = [
    { title: 'MACARENA (SLOWED)', src: `${BASE}music/macarena.mp3` },
    { title: 'PLAGUE INC THEME', src: `${BASE}music/Plague%20Inc%20OST.mp3` },
    { title: 'ARCADIA (CODY MARTIN)', src: `${BASE}music/Cody%20Martin%20-%20Arcadia%20Good%20Times%20Bad%20Times.mp3` }
];

// ASCII Visualizer Component
const AsciiVisualizer = ({ isPlaying }) => {
    const [bars, setBars] = useState([' ', ' ', ' ']);

    useEffect(() => {
        if (!isPlaying) {
            setBars(['_', '_', '_']);
            return;
        }

        const chars = [' ', '▂', '▃', '▅', '▇'];
        const interval = setInterval(() => {
            setBars(prev => [
                chars[Math.floor(Math.random() * chars.length)],
                chars[Math.floor(Math.random() * chars.length)],
                chars[Math.floor(Math.random() * chars.length)]
            ]);
        }, 250);

        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <span style={{
            fontFamily: 'monospace',
            marginRight: '6px',
            color: isPlaying ? '#4da6ff' : '#5a6478',
            fontWeight: 'bold'
        }}>

            [{bars.map((char, i) => (
                <span key={i}>
                    {char === ' ' ? <span style={{ opacity: 0 }}>▇</span> : char}
                </span>
            ))}]
        </span>
    );
};

const MusicPlayer = ({ forcePause = false }) => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(true); // Auto-start on load
    const [volume, setVolume] = useState(0.4); // Increased default volume
    const [currentTrack, setCurrentTrack] = useState(0);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);
    const [actualPlaying, setActualPlaying] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);

    // Sync volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume, ready]);

    // Global interaction listener to bypass browser autoplay policy
    useEffect(() => {
        const enableAudio = () => {
            setUserInteracted(true);
            if (playing && audioRef.current && audioRef.current.paused && !forcePause) {
                audioRef.current.play().catch(e => console.log("Interaction resume failed:", e));
            }
        };

        window.addEventListener('click', enableAudio);
        window.addEventListener('keydown', enableAudio);
        return () => {
            window.removeEventListener('click', enableAudio);
            window.removeEventListener('keydown', enableAudio);
        };
    }, [playing, forcePause]);

    // Handle play/pause based on state
    useEffect(() => {
        if (!audioRef.current) return;

        if (playing && !forcePause) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Autoplay prevented (waiting for interaction):", e);
                    setActualPlaying(false);
                });
            }
        } else {
            audioRef.current.pause();
        }
    }, [playing, forcePause, currentTrack, ready]); // Added currentTrack to re-trigger on skip

    // Handle forcePause from video popups
    useEffect(() => {
        if (forcePause && audioRef.current) {
            audioRef.current.pause();
        } else if (!forcePause && playing && audioRef.current && ready) {
            audioRef.current.play().catch(e => console.log("Resume failed:", e));
        }
    }, [forcePause]);

    const handlePlayPause = () => {
        setPlaying(!playing);
        setUserInteracted(true);
    };

    const handleNext = () => {
        setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
        setReady(false); // Reset ready state for new track
    };

    const handlePrev = () => {
        setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setReady(false);
    };

    const getStatusText = () => {
        if (error) return 'ERROR LOADING';
        if (!ready && playing) return 'BUFFERING...';
        if (actualPlaying) return 'BROADCASTING ACTIVE';
        return 'TRANSMISSION PAUSED';
    };

    return (
        <div style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #2a3040',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
        }}>
            <audio
                ref={audioRef}
                src={TRACKS[currentTrack].src}
                loop={TRACKS.length === 1} // Loop if only one track
                muted={false}
                preload="none"
                onEnded={handleNext}
                onCanPlay={() => { setReady(true); setError(false); }}
                onPlay={() => setActualPlaying(true)}
                onPause={() => setActualPlaying(false)}
                onError={() => { setError(true); setReady(false); }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {TRACKS.length > 1 && (
                        <button onClick={handlePrev} disabled={!ready} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4da6ff', padding: 0 }}>
                            <SkipBack size={12} />
                        </button>
                    )}

                    <button
                        onClick={handlePlayPause}
                        style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer',
                            color: actualPlaying ? '#4da6ff' : '#8892a8',
                            padding: 0,
                            display: 'flex', alignItems: 'center'
                        }}
                    >
                        {actualPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>

                    {TRACKS.length > 1 && (
                        <button onClick={handleNext} disabled={!ready} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4da6ff', padding: 0 }}>
                            <SkipForward size={12} />
                        </button>
                    )}

                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: '10px',
                        color: error ? '#ff4444' : actualPlaying ? '#4da6ff' : '#8892a8',
                        letterSpacing: '1px',
                        marginLeft: '4px'
                    }}>
                        {getStatusText()}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Volume2 size={10} color="#8892a8" />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={volume}
                        onChange={e => setVolume(parseFloat(e.target.value))}
                        style={{
                            width: '60px',
                            height: '2px',
                            accentColor: '#4da6ff',
                            background: '#2a3040',
                            appearance: 'none',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            <div style={{
                fontFamily: 'monospace',
                fontSize: '9px',
                color: '#8892a8',
                display: 'flex', alignItems: 'center', gap: '4px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px'
            }}>
                <AsciiVisualizer isPlaying={actualPlaying} /> {TRACKS[currentTrack].title}
            </div>
        </div>
    );
};

export default MusicPlayer;
