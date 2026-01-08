import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
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

// Cluster spread configuration
const CLUSTER_CONFIG = {
    proximityThreshold: 50, // pixels - markers closer than this are considered overlapping
    spreadRadius: 60, // pixels - radius of the semicircle spread
    minZoomForSpread: 4, // don't spread at very low zoom levels
    targetSpacing: 120, // pixels - desired minimum spacing between markers after zoom (increased for better visibility)
};

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

// Cluster spread manager - detects overlapping markers and spreads them on click
const ClusterSpreadManager = ({ allMarkers, spreadState, setSpreadState }) => {
    const map = useMap();

    // Find markers that overlap at a given point
    const findOverlappingMarkers = useCallback((clickLatLng) => {
        const clickPoint = map.latLngToContainerPoint(clickLatLng);
        const overlapping = [];

        allMarkers.forEach(marker => {
            const markerPoint = map.latLngToContainerPoint(L.latLng(marker.lat, marker.lng));
            const distance = clickPoint.distanceTo(markerPoint);
            if (distance < CLUSTER_CONFIG.proximityThreshold) {
                overlapping.push({ ...marker, pixelDistance: distance });
            }
        });

        return overlapping;
    }, [map, allMarkers]);

    // Calculate spread positions in a semicircle
    const calculateSpreadPositions = useCallback((center, markers) => {
        const centerPoint = map.latLngToContainerPoint(center);
        const count = markers.length;
        const spreadPositions = {};

        if (count <= 1) return spreadPositions;

        // Spread in a semicircle (arc from -90 to 90 degrees, pointing upward)
        const startAngle = -Math.PI / 2 - (Math.PI / 2);
        const endAngle = -Math.PI / 2 + (Math.PI / 2);
        const angleStep = (endAngle - startAngle) / (count - 1);

        markers.forEach((marker, idx) => {
            const angle = startAngle + (idx * angleStep);
            const offsetX = Math.cos(angle) * CLUSTER_CONFIG.spreadRadius;
            const offsetY = Math.sin(angle) * CLUSTER_CONFIG.spreadRadius;

            const newPoint = L.point(centerPoint.x + offsetX, centerPoint.y + offsetY);
            const newLatLng = map.containerPointToLatLng(newPoint);

            spreadPositions[marker.id] = {
                lat: newLatLng.lat,
                lng: newLatLng.lng,
                originalLat: marker.lat,
                originalLng: marker.lng
            };
        });

        return spreadPositions;
    }, [map]);

    // Calculate required zoom level to achieve target spacing between markers
    const calculateRequiredZoom = useCallback((markers) => {
        if (markers.length < 2) return map.getZoom();

        // Find the minimum geographic distance between any two markers
        let minDistance = Infinity;
        for (let i = 0; i < markers.length; i++) {
            for (let j = i + 1; j < markers.length; j++) {
                const p1 = L.latLng(markers[i].lat, markers[i].lng);
                const p2 = L.latLng(markers[j].lat, markers[j].lng);
                const dist = p1.distanceTo(p2); // meters
                if (dist < minDistance) minDistance = dist;
            }
        }

        // Calculate zoom level where this distance equals target spacing in pixels
        // At zoom Z, 1 pixel ≈ 156543.03392 * cos(lat) / 2^Z meters
        const centerLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
        const metersPerPixelAtZoom1 = 156543.03392 * Math.cos(centerLat * Math.PI / 180);

        // We want: minDistance / (metersPerPixelAtZoom1 / 2^zoom) = targetSpacing
        // So: 2^zoom = targetSpacing * metersPerPixelAtZoom1 / minDistance
        const requiredZoom = Math.log2((CLUSTER_CONFIG.targetSpacing * metersPerPixelAtZoom1) / minDistance);

        return Math.min(Math.max(requiredZoom, map.getZoom() + 1), 16);
    }, [map]);

    // Handle map click to detect clusters
    useMapEvents({
        click: (e) => {
            const overlapping = findOverlappingMarkers(e.latlng);

            if (overlapping.length > 1 && map.getZoom() >= CLUSTER_CONFIG.minZoomForSpread) {
                // Calculate the zoom needed to separate markers
                const requiredZoom = calculateRequiredZoom(overlapping);
                const currentZoom = map.getZoom();

                if (requiredZoom > currentZoom + 0.5) {
                    // Need to zoom in more - fly there and the markers will naturally spread
                    map.flyTo(e.latlng, requiredZoom, { duration: 0.7 });
                    // Clear any existing spread state since we're zooming
                    setSpreadState({ active: false, positions: {}, center: null });
                } else {
                    // Already zoomed enough - spread markers in semicircle
                    const positions = calculateSpreadPositions(e.latlng, overlapping);
                    setSpreadState({ active: true, positions, center: e.latlng });
                }
            } else if (spreadState.active) {
                // Click elsewhere - collapse spread
                setSpreadState({ active: false, positions: {}, center: null });
            }
        },
        zoomstart: () => {
            // Collapse spread when zooming
            if (spreadState.active) {
                setSpreadState({ active: false, positions: {}, center: null });
            }
        }
    });

    return null;
};

// Video popup content component with ref forwarding for video control
const VideoPopupContent = React.forwardRef(({ video, onVideoPlay, onVideoPause }, ref) => {
    const videoRef = useRef(null);

    // Expose video element to parent
    React.useImperativeHandle(ref, () => ({
        play: () => {
            if (videoRef.current) {
                // If start time configured and we are at start, seek
                if (video.startTime && videoRef.current.currentTime < video.startTime) {
                    videoRef.current.currentTime = video.startTime;
                }
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
                videoRef.current.currentTime = video.startTime || 0;
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
                    onLoadedMetadata={(e) => { e.target.volume = 0.5; }}
                    style={{ width: '100%', display: 'block' }}
                />
            </div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px', textAlign: 'right' }}>
                LOOP: ACTIVE // ID: {video.id.toUpperCase()}
            </div>
        </div>
    );
});

const VideoMarkerLayer = ({ onVideoStateChange, onTheatreSelect, getMarkerPosition }) => {
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
        // Center on the marker with a cinematic zoom
        // Offset latitude slightly upward to account for popup height above the marker
        const targetZoom = 8;
        const popupOffset = 0.02 * Math.pow(2, 10 - targetZoom); // Scale offset by target zoom level
        map.flyTo([video.lat + popupOffset, video.lng], targetZoom, { duration: 1 });
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

    // Use spread position if available, otherwise original
    const getVideoPosition = (video) => {
        if (getMarkerPosition) {
            return getMarkerPosition(`video-${video.id}`, video.lat, video.lng);
        }
        return [video.lat, video.lng];
    };

    return (
        <>
            {VIDEO_MARKERS.map(video => (
                <Marker
                    key={video.id}
                    position={getVideoPosition(video)}
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
    const [spreadState, setSpreadState] = useState({ active: false, positions: {}, center: null });

    // Collect all markers for cluster detection
    const allMarkers = useMemo(() => {
        const markers = [];

        // Intel hotspots
        INTEL_HOTSPOTS.forEach(spot => {
            markers.push({ id: `intel-${spot.id}`, lat: spot.lat, lng: spot.lon, type: 'intel', data: spot });
        });

        // Video markers
        VIDEO_MARKERS.forEach(video => {
            markers.push({ id: `video-${video.id}`, lat: video.lat, lng: video.lng, type: 'video', data: video });
        });

        // Military bases
        MILITARY_BASES.forEach(base => {
            markers.push({ id: `base-${base.id}`, lat: base.lat, lng: base.lon, type: 'base', data: base });
        });

        // Shipping chokepoints
        SHIPPING_CHOKEPOINTS.forEach(point => {
            markers.push({ id: `ship-${point.id}`, lat: point.lat, lng: point.lon, type: 'ship', data: point });
        });

        return markers;
    }, []);

    // Get marker position (spread or original)
    const getMarkerPosition = useCallback((markerId, originalLat, originalLng) => {
        if (spreadState.active && spreadState.positions[markerId]) {
            return [spreadState.positions[markerId].lat, spreadState.positions[markerId].lng];
        }
        return [originalLat, originalLng];
    }, [spreadState]);

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
                <ClusterSpreadManager
                    allMarkers={allMarkers}
                    spreadState={spreadState}
                    setSpreadState={setSpreadState}
                />


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
                        position={getMarkerPosition(`intel-${spot.id}`, spot.lat, spot.lon)}
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
                <VideoMarkerLayer
                    onVideoStateChange={onVideoStateChange}
                    onTheatreSelect={onTheatreSelect}
                    getMarkerPosition={getMarkerPosition}
                />

                {/* Military Bases */}
                {MILITARY_BASES.map(base => {
                    const color = base.type === 'us-nato' ? COLORS.usnato :
                        base.type === 'china' ? COLORS.china : COLORS.russia;
                    return (
                        <Marker
                            key={base.id}
                            position={getMarkerPosition(`base-${base.id}`, base.lat, base.lon)}
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
                        position={getMarkerPosition(`ship-${point.id}`, point.lat, point.lon)}
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

            {/* Popup styles and performance optimizations */}
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
        /* Performance optimizations for smooth zooming */
        .leaflet-tile-container {
          will-change: transform;
        }
        .leaflet-zoom-anim .leaflet-zoom-animated {
          will-change: transform;
          transition: transform 0.25s cubic-bezier(0, 0, 0.25, 1) !important;
        }
        .leaflet-marker-pane,
        .leaflet-shadow-pane,
        .leaflet-overlay-pane,
        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          will-change: transform;
        }
        .leaflet-pane {
          transform: translateZ(0);
        }
        .leaflet-tile {
          transform: translateZ(0);
          backface-visibility: hidden;
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
