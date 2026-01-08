import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon, Circle, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    THEATRES,
    INTEL_HOTSPOTS,
    CONFLICT_ZONES,
    MILITARY_BASES,
    SHIPPING_CHOKEPOINTS
} from '../data/theatres';
import { VIDEO_MARKERS } from '../data/videoMarkers';
import { fetchLiveUAMapEvents, fetchUkraineFrontline, EVENT_STYLES } from '../data/liveFeeds';
import { getAllConflictEvents, GLOBAL_EVENT_STYLES } from '../data/globalConflicts';

// Palantir-inspired colors
const COLORS = {
    accent: '#4da6ff',
    high: '#ff4757',
    elevated: '#ffa502',
    medium: '#4da6ff',
    success: '#2ed573',
    usnato: '#4da6ff',
    china: '#ff9f43',
    russia: '#ff4757',
    video: '#2ed573'
};

// Custom CSS filter for wireframe effect on tiles
const WIREFRAME_FILTER = `
  filter: 
    grayscale(100%) 
    invert(100%) 
    brightness(0.15) 
    contrast(1.5)
    sepia(0.3)
    hue-rotate(180deg);
`;

// Custom marker icons
const createPulseIcon = (color, size = 12) => {
    return L.divIcon({
        className: 'custom-pulse-marker',
        html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        box-shadow: 0 0 ${size}px ${color};
        animation: pulse-animation 2s infinite;
      "></div>
      <style>
        @keyframes pulse-animation {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

const createSquareIcon = (color, size = 10) => {
    return L.divIcon({
        className: 'custom-square-marker',
        html: `<div style="width: ${size}px; height: ${size}px; background: ${color}; border: 1px solid ${color}; opacity: 0.8;"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

const createTriangleIcon = (color, size = 10) => {
    return L.divIcon({
        className: 'custom-triangle-marker',
        html: `<div style="
      width: 0;
      height: 0;
      border-left: ${size / 2}px solid transparent;
      border-right: ${size / 2}px solid transparent;
      border-bottom: ${size}px solid ${color};
    "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size]
    });
};

const createVideoIcon = (color) => {
    return L.divIcon({
        className: 'custom-video-marker',
        html: `<div style="
            width: 14px; 
            height: 14px; 
            background: ${color}; 
            border: 2px solid #000; 
            transform: rotate(45deg);
            box-shadow: 0 0 10px ${color};
            display: flex; align-items: center; justify-content: center;
        "><div style="width: 4px; height: 4px; background: #000; border-radius: 50%;"></div></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });
};

// Map bounds controller
const MapController = ({ activeTheatre, onTheatreSelect }) => {
    const map = useMap();

    useEffect(() => {
        // Set bounds to prevent dragging out of view
        const southWest = L.latLng(-85, -180);
        const northEast = L.latLng(85, 180);
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        map.on('drag', () => {
            map.panInsideBounds(bounds, { animate: false });
        });
    }, [map]);

    useEffect(() => {
        if (activeTheatre) {
            const theatre = THEATRES.find(t => t.id === activeTheatre);
            if (theatre) {
                const bounds = L.latLngBounds(
                    [theatre.bounds.south, theatre.bounds.west],
                    [theatre.bounds.north, theatre.bounds.east]
                );
                map.flyToBounds(bounds, { duration: 1, padding: [20, 20] });
            }
        } else {
            map.flyTo([20, 0], 2, { duration: 1 });
        }
    }, [activeTheatre, map]);

    return null;
};

// Zoom level display
const ZoomDisplay = () => {
    const [zoom, setZoom] = useState(2);
    const map = useMapEvents({
        zoomend: () => setZoom(map.getZoom())
    });

    return (
        <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            color: COLORS.accent,
            fontFamily: 'monospace',
            fontSize: '10px',
            opacity: 0.7,
            background: 'rgba(10,10,15,0.8)',
            padding: '4px 8px',
            border: `1px solid #2a3040`,
            zIndex: 1000
        }}>
            ZOOM: {zoom.toFixed(1)}
        </div>
    );
};

// Video popup content component with ref forwarding for video control
const VideoPopupContent = React.forwardRef(({ video, onVideoPlay, onVideoPause }, ref) => {
    const videoRef = useRef(null);

    // Expose video element to parent
    React.useImperativeHandle(ref, () => ({
        play: () => {
            if (videoRef.current) {
                videoRef.current.play().catch(e => console.log('Video autoplay blocked:', e));
            }
        },
        pause: () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        },
        stop: () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }));

    return (
        <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '280px' }}>
            <strong style={{ color: COLORS.video }}>VIDEO INTEL // {video.title}</strong><br />
            <div style={{ marginTop: '6px', border: `1px solid ${COLORS.video}` }}>
                <video
                    ref={videoRef}
                    src={video.src}
                    loop
                    playsInline
                    muted={false}
                    onPlay={onVideoPlay}
                    onPause={onVideoPause}
                    style={{ width: '100%', display: 'block' }}
                />
            </div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px', textAlign: 'right' }}>
                LOOP: ACTIVE // ID: {video.id.toUpperCase()}
            </div>
        </div>
    );
});

const VideoMarkerLayer = ({ onVideoStateChange, onTheatreSelect }) => {
    const map = useMap();
    const [activeVideoId, setActiveVideoId] = useState(null);
    const videoRefs = useRef({});

    // Listen for popup close events to stop video and notify parent
    useEffect(() => {
        const handlePopupClose = () => {
            // Stop all videos when any popup closes
            Object.values(videoRefs.current).forEach(ref => {
                if (ref && ref.stop) ref.stop();
            });
            setActiveVideoId(null);
            onVideoStateChange(false);
        };

        map.on('popupclose', handlePopupClose);
        return () => {
            map.off('popupclose', handlePopupClose);
        };
    }, [map, onVideoStateChange]);

    const handleMarkerClick = (video) => {
        // Find containing theatre and pan so the popup is visible
        const theatre = THEATRES.find(t =>
            video.lat <= t.bounds.north &&
            video.lat >= t.bounds.south &&
            video.lng <= t.bounds.east &&
            video.lng >= t.bounds.west
        );

        if (theatre) {
            // Center on the marker with a cinematic zoom
            // Offset latitude slightly to make room for the popup if needed, but centering is usually fine
            map.flyTo([video.lat, video.lng], 6, { duration: 1.5 });
        }
    };

    const handlePopupOpen = (video) => {
        setActiveVideoId(video.id);
        // Start video when popup opens
        setTimeout(() => {
            const ref = videoRefs.current[video.id];
            if (ref && ref.play) {
                ref.play();
            }
        }, 100);
        onVideoStateChange(true);
    };

    const handleVideoPlay = () => {
        onVideoStateChange(true);
    };

    const handleVideoPause = () => {
        // Keep music paused while popup is open/active, even if video is paused manually.
        // Music only resumes when popup is closed (exiting the focused state).
    };

    return (
        <>
            {VIDEO_MARKERS.map(video => (
                <Marker
                    key={video.id}
                    position={[video.lat, video.lng]}
                    icon={createVideoIcon(COLORS.video)}
                    eventHandlers={{
                        click: () => handleMarkerClick(video)
                    }}
                >
                    <Popup
                        minWidth={300}
                        maxWidth={400}
                        className="video-popup"
                        eventHandlers={{
                            add: () => handlePopupOpen(video)
                        }}
                    >
                        <VideoPopupContent
                            ref={el => videoRefs.current[video.id] = el}
                            video={video}
                            onVideoPlay={handleVideoPlay}
                            onVideoPause={handleVideoPause}
                        />
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

const SituationMap = ({ activeTheatre, onTheatreSelect, mapTheme = 'dark', onVideoStateChange }) => {
    const [liveEvents, setLiveEvents] = useState([]);
    const [frontlineData, setFrontlineData] = useState([]);

    // Fetch live feed data
    useEffect(() => {
        const loadLiveData = async () => {
            try {
                const result = await fetchLiveUAMapEvents();
                if (result.success) setLiveEvents(result.data);
            } catch (err) {
                console.error('Failed to load live events:', err);
            }
        };
        loadLiveData();
        const interval = setInterval(loadLiveData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Fetch Ukraine frontline data from ISW/ArcGIS
    useEffect(() => {
        const loadFrontlineData = async () => {
            try {
                const result = await fetchUkraineFrontline();
                if (result.success && result.data.length > 0) {
                    setFrontlineData(result.data);
                    console.log(`Loaded ${result.data.length} frontline segments`);
                }
            } catch (err) {
                console.error('Failed to load frontline data:', err);
            }
        };
        loadFrontlineData();
        // Refresh every 30 minutes
        const interval = setInterval(loadFrontlineData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getLevelColor = (level) => {
        switch (level) {
            case 'high': return COLORS.high;
            case 'elevated': return COLORS.elevated;
            default: return COLORS.medium;
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                maxZoom={18}
                zoomSnap={0.25}
                zoomDelta={0.5}
                wheelPxPerZoomLevel={120}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#0a0a0f'
                }}
                zoomControl={false}
                attributionControl={false}
                maxBoundsViscosity={1.0}
            >
                {/* Map tiles - dark grey or black based on theme */}
                {mapTheme === 'dark' ? (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        subdomains="abcd"
                        className="dark-tiles"
                    />
                ) : (
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        subdomains="abcd"
                        className="black-tiles"
                    />
                )}

                <MapController activeTheatre={activeTheatre} onTheatreSelect={onTheatreSelect} />
                <ZoomDisplay />


                {/* Theatre Zone Rectangles */}
                {THEATRES.map(theatre => (
                    <Polygon
                        key={theatre.id}
                        positions={[
                            [theatre.bounds.north, theatre.bounds.west],
                            [theatre.bounds.north, theatre.bounds.east],
                            [theatre.bounds.south, theatre.bounds.east],
                            [theatre.bounds.south, theatre.bounds.west]
                        ]}
                        pathOptions={{
                            color: COLORS.accent,
                            weight: 1,
                            opacity: 0.3,
                            fillOpacity: 0,
                            dashArray: '10, 5'
                        }}
                        eventHandlers={{
                            click: () => onTheatreSelect(theatre.id),
                            mouseover: (e) => {
                                e.target.setStyle({ opacity: 0.7, fillOpacity: 0.03 });
                            },
                            mouseout: (e) => {
                                e.target.setStyle({ opacity: 0.3, fillOpacity: 0 });
                            }
                        }}
                    />
                ))}

                {/* Conflict Zones */}
                {CONFLICT_ZONES.map(zone => (
                    <Polygon
                        key={zone.id}
                        positions={zone.coords.map(c => [c[1], c[0]])}
                        pathOptions={{
                            color: zone.intensity === 'high' ? COLORS.high :
                                zone.intensity === 'medium' ? COLORS.elevated : '#ffd700',
                            weight: 1.5,
                            opacity: 0.6,
                            fillOpacity: 0.15,
                            dashArray: '6, 3'
                        }}
                    >
                        <Popup maxWidth={320}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px', maxWidth: '300px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #2a3040', paddingBottom: '4px' }}>
                                    <strong style={{ color: zone.intensity === 'high' ? '#ff4757' : zone.intensity === 'medium' ? '#ffa502' : '#4da6ff' }}>{zone.name}</strong>
                                    <span style={{ fontSize: '9px', padding: '2px 6px', border: `1px solid ${zone.intensity === 'high' ? '#ff4757' : zone.intensity === 'medium' ? '#ffa502' : '#4da6ff'}`, color: zone.intensity === 'high' ? '#ff4757' : zone.intensity === 'medium' ? '#ffa502' : '#4da6ff' }}>
                                        {zone.intensity.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ color: '#8892a8', marginBottom: '6px', lineHeight: '1.4' }}>{zone.description}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: '#1a2030', padding: '6px', marginBottom: '6px' }}>
                                    <div><span style={{ color: '#5a6478', fontSize: '9px' }}>SINCE</span><br /><span style={{ color: '#e0e4eb' }}>{zone.startDate}</span></div>
                                    <div><span style={{ color: '#5a6478', fontSize: '9px' }}>CASUALTIES</span><br /><span style={{ color: '#ff4757' }}>{zone.casualties || 'Unknown'}</span></div>
                                    <div style={{ gridColumn: '1 / -1' }}><span style={{ color: '#5a6478', fontSize: '9px' }}>DISPLACED</span><br /><span style={{ color: '#ffa502' }}>{zone.displaced || 'Unknown'}</span></div>
                                </div>
                                {zone.parties && zone.parties.length > 0 && (
                                    <div style={{ marginBottom: '6px' }}>
                                        <div style={{ color: '#5a6478', fontSize: '9px', marginBottom: '2px' }}>BELLIGERENTS</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {zone.parties.map((party, i) => (
                                                <span key={i} style={{ fontSize: '10px', padding: '2px 6px', background: '#141824', border: '1px solid #2a3040', color: '#e0e4eb' }}>{party}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {zone.keyEvents && zone.keyEvents.length > 0 && (
                                    <div>
                                        <div style={{ color: '#5a6478', fontSize: '9px', marginBottom: '2px' }}>KEY EVENTS</div>
                                        {zone.keyEvents.slice(0, 4).map((event, i) => (
                                            <div key={i} style={{ fontSize: '10px', color: '#8892a8', paddingLeft: '8px' }}>{'>'} {event}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Polygon>
                ))}

                {/* Ukraine Frontline from ISW/ArcGIS */}
                {frontlineData.map((segment, idx) => {
                    // Convert [lon, lat] to [lat, lon] for Leaflet
                    const positions = segment.coordinates.map(coord => [coord[1], coord[0]]);
                    return (
                        <Polyline
                            key={`frontline-${segment.id || idx}`}
                            positions={positions}
                            pathOptions={{
                                color: '#ff4757',
                                weight: 3,
                                opacity: 0.9,
                                dashArray: null,
                                smoothFactor: 1.5 // Optimize performance without manual simplification
                            }}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                    <strong style={{ color: '#ff4757' }}>UKRAINE FRONTLINE</strong><br />
                                    Source: {segment.properties?.source || 'ISW/CTP'}<br />
                                    <span style={{ color: '#888' }}>Updated: {segment.properties?.date}</span>
                                </div>
                            </Popup>
                        </Polyline>
                    );
                })}

                {/* Intel Hotspots */}
                {INTEL_HOTSPOTS.map(spot => (
                    <Marker
                        key={spot.id}
                        position={[spot.lat, spot.lon]}
                        icon={createPulseIcon(getLevelColor(spot.level))}
                    >
                        <Popup maxWidth={300}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '220px', maxWidth: '280px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px solid #2a3040', paddingBottom: '4px' }}>
                                    <strong style={{ color: getLevelColor(spot.level) }}>{spot.name}</strong>
                                    <span style={{ fontSize: '9px', padding: '2px 6px', border: `1px solid ${getLevelColor(spot.level)}`, color: getLevelColor(spot.level) }}>
                                        {spot.level.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ color: '#4da6ff', fontSize: '10px', marginBottom: '4px' }}>{spot.subtext}</div>
                                <div style={{ color: '#8892a8', marginBottom: '6px', lineHeight: '1.4' }}>{spot.description}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', background: '#1a2030', padding: '6px', marginBottom: '6px' }}>
                                    <div><span style={{ color: '#5a6478', fontSize: '9px' }}>COORDS</span><br /><span style={{ color: '#e0e4eb' }}>{spot.lat.toFixed(2)}N, {Math.abs(spot.lon).toFixed(2)}{spot.lon >= 0 ? 'E' : 'W'}</span></div>
                                    <div><span style={{ color: '#5a6478', fontSize: '9px' }}>STATUS</span><br /><span style={{ color: getLevelColor(spot.level) }}>{spot.status}</span></div>
                                </div>
                                {spot.agencies && spot.agencies.length > 0 && (
                                    <div>
                                        <div style={{ color: '#5a6478', fontSize: '9px', marginBottom: '2px' }}>KEY ENTITIES</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {spot.agencies.map((agency, i) => (
                                                <span key={i} style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(77, 166, 255, 0.1)', border: '1px solid rgba(77, 166, 255, 0.3)', color: '#4da6ff' }}>{agency}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Video Intelligence */}
                <VideoMarkerLayer onVideoStateChange={onVideoStateChange} onTheatreSelect={onTheatreSelect} />

                {/* Military Bases */}
                {MILITARY_BASES.map(base => {
                    const color = base.type === 'us-nato' ? COLORS.usnato :
                        base.type === 'china' ? COLORS.china : COLORS.russia;
                    return (
                        <Marker
                            key={base.id}
                            position={[base.lat, base.lon]}
                            icon={createSquareIcon(color)}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                    <strong>{base.name}</strong><br />
                                    <span style={{ color: '#888' }}>{base.type.toUpperCase()}</span>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Shipping Chokepoints */}
                {SHIPPING_CHOKEPOINTS.map(point => (
                    <Marker
                        key={point.id}
                        position={[point.lat, point.lon]}
                        icon={createTriangleIcon('#00d4ff')}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                <strong>{point.name}</strong><br />
                                {point.desc}<br />
                                <span style={{ color: '#888' }}>Traffic: {point.traffic}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Live Events */}
                {liveEvents.map(event => {
                    const style = EVENT_STYLES[event.type] || { color: '#ffffff' };
                    return (
                        <Circle
                            key={event.id}
                            center={[event.lat, event.lon]}
                            radius={5000}
                            pathOptions={{
                                color: style.color,
                                fillColor: style.color,
                                fillOpacity: 0.5,
                                weight: 2
                            }}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                    <strong style={{ color: style.color }}>{style.label}</strong><br />
                                    {event.title}<br />
                                    <span style={{ color: '#888', fontSize: '9px' }}>{event.timestamp}</span>
                                </div>
                            </Popup>
                        </Circle>
                    );
                })}

                {/* Global Conflict Events (Sudan, Gaza, Venezuela, Taiwan, Iran) */}
                {getAllConflictEvents().map((event, idx) => {
                    const style = GLOBAL_EVENT_STYLES[event.type] || GLOBAL_EVENT_STYLES.default;
                    return (
                        <CircleMarker
                            key={`global-${event.conflictId}-${idx}`}
                            center={[event.lat, event.lon]}
                            radius={6}
                            pathOptions={{
                                color: style.color,
                                fillColor: style.color,
                                fillOpacity: 0.7,
                                weight: 2
                            }}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '150px' }}>
                                    <strong style={{ color: style.color }}>{style.icon} {event.type.toUpperCase()}</strong><br />
                                    <span style={{ color: '#4da6ff' }}>{event.conflictName}</span><br />
                                    {event.city}<br />
                                    <span style={{ color: '#888', fontSize: '9px' }}>{event.date}</span>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Popup styles */}
            <style>{`
        .leaflet-container {
          background: #0a0a0f !important;
        }
        .dark-tiles {
          filter: brightness(1.2) contrast(1.05);
        }
        .black-tiles {
          filter: brightness(0.4) contrast(1.3);
        }
        .leaflet-popup-content-wrapper {
          background: rgba(10, 15, 25, 0.95);
          border: 1px solid #2a3040;
          color: #e0e4eb;
          border-radius: 2px;
        }
        .leaflet-popup-tip {
          background: rgba(10, 15, 25, 0.95);
        }
        .leaflet-popup-close-button {
          color: #8892a8 !important;
        }
      `}</style>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(10,10,15,0.9)',
                border: `1px solid #2a3040`,
                padding: '10px 12px',
                fontFamily: 'monospace',
                fontSize: '10px',
                zIndex: 1000
            }}>
                <div style={{ color: COLORS.high, marginBottom: '3px' }}>━ FRONTLINE (ISW)</div>
                <div style={{ color: COLORS.medium, marginBottom: '3px' }}>● LOW ACTIVITY</div>
                <div style={{ color: COLORS.elevated, marginBottom: '3px' }}>● ELEVATED</div>
                <div style={{ color: COLORS.high, marginBottom: '6px' }}>● HIGH ACTIVITY</div>
                <div style={{ borderTop: `1px solid #2a3040`, paddingTop: '6px' }}>
                    <div style={{ color: COLORS.usnato }}>■ US/NATO</div>
                    <div style={{ color: COLORS.china }}>■ CHINA</div>
                    <div style={{ color: COLORS.russia }}>■ RUSSIA</div>
                    <div style={{ color: COLORS.video }}>◆ VIDEO INTEL</div>
                </div>
            </div>

            {/* Grid overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                pointerEvents: 'none',
                opacity: 0.02,
                backgroundImage: `linear-gradient(${COLORS.accent}40 1px, transparent 1px), linear-gradient(90deg, ${COLORS.accent}40 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
                zIndex: 999
            }} />
        </div>
    );
};

export default SituationMap;
