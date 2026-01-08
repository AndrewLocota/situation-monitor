import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Radio, SkipBack, SkipForward } from 'lucide-react';

const BASE = import.meta.env.BASE_URL;

const TRACKS = [
    { title: 'MACARENA (SLOWED)', src: `${BASE}music/macarena.mp3` },
    { title: 'TRACK 02', src: `${BASE}music/track2.mp3` },
    { title: 'TRACK 03', src: `${BASE}music/track3.mp3` }
];

const MusicPlayer = () => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(true); // Autostart enabled
    const [volume, setVolume] = useState(0.20);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [canLoad, setCanLoad] = useState(false);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(false);
    const [actualPlaying, setActualPlaying] = useState(false);

    // Lazy load: Wait 3 seconds after mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setCanLoad(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // Sync volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume, canLoad, ready]);

    // Handle track changes and playback
    useEffect(() => {
        if (!canLoad) return;

        // Reset state on track change
        setReady(false);
        setError(false);
        setActualPlaying(false);

        // Audio element is updated via render prop 'src', we just handle play/pause trigger
        // But we need to wait for 'canplay' event before playing
    }, [currentTrack, canLoad]);

    useEffect(() => {
        if (canLoad && ready && audioRef.current) {
            if (playing) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log("Playback prevented (Autoplay blocked):", e);
                        // Do not revert playing state, keep trying on interaction
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [playing, ready, canLoad, currentTrack]);

    // Retry playback on first user interaction
    useEffect(() => {
        const handleInteraction = () => {
            if (playing && audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.log("Retry failed", e));
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [playing]);

    const handleNext = () => {
        setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
        setPlaying(true); // Auto-play next
    };

    const handlePrev = () => {
        setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
        setPlaying(true);
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
            {canLoad && (
                <audio
                    ref={audioRef}
                    src={TRACKS[currentTrack].src}
                    loop={false} // Playlist mode usually doesn't loop single track? Or loop entire? User said "folder", implies generic player. I'll loop list manually via onEnded.
                    onEnded={handleNext}
                    onCanPlay={() => { setReady(true); setError(false); }}
                    onPlay={() => setActualPlaying(true)}
                    onPause={() => setActualPlaying(false)}
                    onError={() => { setError(true); setReady(false); }}
                />
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button onClick={handlePrev} disabled={!ready} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4da6ff', padding: 0 }}>
                        <SkipBack size={12} />
                    </button>

                    <button
                        onClick={() => setPlaying(!playing)}
                        disabled={!canLoad || (!ready && !error)}
                        style={{
                            background: 'none', border: 'none',
                            cursor: (canLoad && ready) ? 'pointer' : 'default',
                            color: playing ? '#4da6ff' : (canLoad && ready) ? '#8892a8' : '#444',
                            padding: 0,
                            display: 'flex', alignItems: 'center'
                        }}
                    >
                        {playing ? <Pause size={14} /> : <Play size={14} />}
                    </button>

                    <button onClick={handleNext} disabled={!ready} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4da6ff', padding: 0 }}>
                        <SkipForward size={12} />
                    </button>

                    <div style={{ fontFamily: 'monospace', fontSize: '10px', color: error ? '#ff4444' : '#4da6ff', letterSpacing: '1px', marginLeft: '4px' }}>
                        {!canLoad ? 'WAITING...' : error ? 'FILE NOT FOUND' : !ready ? 'LOADING...' : playing && !actualPlaying ? 'CLICK TO START' : actualPlaying ? 'PLAYING' : 'READY'}
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
