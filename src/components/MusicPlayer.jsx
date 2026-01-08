import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Radio, SkipBack, SkipForward } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

// Only include tracks that exist
const TRACKS = [
    { title: 'MACARENA (SLOWED)', src: `${BASE}music/macarena.mp3` },
    { title: 'ARCADIA (CODY MARTIN)', src: `${BASE}music/Cody%20Martin%20-%20Arcadia%20Good%20Times%20Bad%20Times.mp3` }
];

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
        if (!audioRef.current || !ready) return;

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
    }, [playing, ready, forcePause]);

    // Handle forcePause from video popups
    useEffect(() => {
        if (forcePause && audioRef.current) {
            audioRef.current.pause();
        } else if (!forcePause && playing && audioRef.current && ready) {
            audioRef.current.play().catch(e => console.log("Resume failed:", e));
        }
    }, [forcePause]);

    const handlePlayPause = () => {
        setUserInteracted(true);
        if (!playing) {
            setPlaying(true);
        } else {
            setPlaying(false);
        }
    };

    const handleNext = () => {
        setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
        if (userInteracted) setPlaying(true);
    };

    const handlePrev = () => {
        setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        if (userInteracted) setPlaying(true);
    };

    const getStatusText = () => {
        if (error) return 'FILE NOT FOUND';
        if (!ready) return 'LOADING...';
        if (actualPlaying) return 'PLAYING';
        if (playing && !actualPlaying) return 'CLICK ▶ TO START';
        return 'PAUSED';
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
                autoPlay
                preload="auto"
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
                <Radio size={10} /> {TRACKS[currentTrack].title}
            </div>
        </div>
    );
};

export default MusicPlayer;
