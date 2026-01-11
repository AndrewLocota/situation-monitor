import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon, Circle, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    THEATRES,
    INTEL_HOTSPOTS,
    CONFLICT_ZONES,
    FRONTLINES,
    MILITARY_BASES,
    SHIPPING_CHOKEPOINTS,
    NUCLEAR_FACILITIES,
    CYBER_ZONES,
    UNDERSEA_CABLES
} from '../data/theatres';
import { VIDEO_MARKERS } from '../data/videoMarkers';
import { fetchLiveUAMapEvents, fetchUkraineFrontline, fetchSudanFrontlines, fetchMyanmarFrontlines, EVENT_STYLES } from '../data/liveFeeds';
import { getAllConflictEvents, GLOBAL_EVENT_STYLES } from '../data/globalConflicts';
import { getControlZones } from '../services/api/controlZoneFetcher';
import { geolocateNewsItems } from '../utils/geolocateNews';
import { useDataStore, useMapStore } from '../stores';
import { timeAgo } from '../utils/timeFormat';
import { getPublisherLogo } from '../data/publisherLogos';

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
    video: '#2ed573',
    news: '#00d4ff'  // Cyan for news markers
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
        html: `
            <div style="
                width: 16px;
                height: 16px;
                background: ${color};
                border: 2px solid #000;
                border-radius: 2px;
                box-shadow: 0 0 10px ${color};
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            ">
                <!-- Play button triangle -->
                <div style="
                    width: 0;
                    height: 0;
                    border-left: 6px solid #000;
                    border-top: 4px solid transparent;
                    border-bottom: 4px solid transparent;
                    margin-left: 1px;
                "></div>
            </div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
};

// Nuclear facility marker icon
const createNuclearIcon = (color) => {
    return L.divIcon({
        className: 'custom-nuclear-marker',
        html: `<div style="
            font-size: 12px;
            text-shadow: 0 0 6px ${color}, 0 0 10px ${color}, 0 0 2px rgba(0,0,0,0.8);
            filter: drop-shadow(0 0 3px ${color});
        ">☢️</div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
};

// News marker icon (newspaper style with emoji)
const createNewsIcon = (color, opacity = 1, blur = 6, isRead = false, logoUrl = null) => {
    // Escape quotes in logoUrl to prevent HTML breaking
    const safeLogo = logoUrl ? logoUrl.replace(/"/g, '&quot;').replace(/'/g, '&#39;') : null;

    return L.divIcon({
        className: 'custom-news-marker',
        html: `
            <div style="position: relative; width: 24px; height: 24px; display: inline-block;">
                <div style="
                    font-size: 18px;
                    opacity: ${opacity};
                    text-shadow: ${isRead ? 'none' : `0 0 ${blur}px ${color}, 0 0 3px rgba(0,0,0,0.8)`};
                    filter: ${isRead ? `grayscale(100%) brightness(0.7) drop-shadow(0 0 1px ${color})` : `drop-shadow(0 0 2px ${color})`};
                    transition: all 0.5s ease;
                    line-height: 1;
                ">📰</div>
                ${safeLogo ? `
                    <img
                        src="${safeLogo}"
                        alt="publisher"
                        style="
                            position: absolute;
                            bottom: -2px;
                            right: -2px;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            border: none;
                            background: transparent;
                            object-fit: contain;
                            box-shadow: 0 0 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.4);
                            z-index: 100;
                            pointer-events: none;
                        "
                        onerror="console.error('Logo failed:', '${safeLogo}'); this.style.display='none';"
                        onload="console.log('Logo loaded:', '${safeLogo}');"
                    />
                ` : ''}
            </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// Map bounds controller
const MapController = ({ activeTheatre, onTheatreSelect }) => {
    const map = useMap();
    const hasInitialized = useRef(false);

    useEffect(() => {
        // Set bounds to prevent dragging out of view
        const southWest = L.latLng(-85, -180);
        const northEast = L.latLng(85, 180);
        const bounds = L.latLngBounds(southWest, northEast);
        map.setMaxBounds(bounds);
        map.on('drag', () => {
            map.panInsideBounds(bounds, { animate: false });
        });

        // Initial cinematic zoom-in animation on first load
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            // Start zoomed out and smoothly zoom in
            map.setView([20, 0], 1, { animate: false });
            setTimeout(() => {
                map.flyTo([20, 0], 2.8, { duration: 1, easeLinearity: 0.25 });
            }, 300);
        }
    }, [map]);

    useEffect(() => {
        if (activeTheatre && activeTheatre !== 'GLOBAL') {
            const theatre = THEATRES.find(t => t.id === activeTheatre);
            if (theatre) {
                const bounds = L.latLngBounds(
                    [theatre.bounds.south, theatre.bounds.west],
                    [theatre.bounds.north, theatre.bounds.east]
                );
                map.flyToBounds(bounds, { duration: 1.5, padding: [20, 20] });
            }
        } else if (hasInitialized.current) {
            // Only fly back if already initialized (not on first load)
            map.flyTo([20, 0], 2.8, { duration: 1.5 });
        }
    }, [activeTheatre, map]);

    return null;
};

// News focus handler - flies to selected news location
const NewsFocusHandler = ({ selectedNews, clearSelectedNews, setFocusedNewsId }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedNews && selectedNews.location) {
            const { lat, lng, label, matchedTerm } = selectedNews.location;

            // Determine zoom level - closer for DC/City locations
            let zoomLevel = 8;
            const isDC = (label && label.toLowerCase().includes('washington')) ||
                (label && label.toLowerCase().includes('dc')) ||
                (matchedTerm && ['white house', 'pentagon', 'congress', 'senate', 'house', 'fed', 'biden', 'vance'].includes(matchedTerm));

            if (isDC) {
                zoomLevel = 13;
            }

            // Fly to the news location
            map.flyTo([lat, lng], zoomLevel, { duration: 1 });
            // Set the focused news ID to highlight/open popup
            setFocusedNewsId(selectedNews.id);
            // Clear the selection after flying
            setTimeout(() => {
                clearSelectedNews();
            }, 100);
        }
    }, [selectedNews, map, clearSelectedNews, setFocusedNewsId]);

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

// Auto-declutter: automatically offset overlapping markers to not overlap
const AutoDeclutter = ({ allMarkers, setDeclutteredPositions }) => {
    const map = useMap();

    const calculateDeclutteredPositions = useCallback(() => {
        if (!map || allMarkers.length === 0) return {};

        const positions = {};

        // Minimum distance in pixels between markers to not overlap
        const minSpacing = 25;

        // Filter out military bases and canals - they stay at true positions
        const declutterableMarkers = allMarkers.filter(m => m.type !== 'base' && m.type !== 'ship');

        // Group markers by proximity (find clusters)
        const processed = new Set();
        const clusters = [];

        declutterableMarkers.forEach((marker, i) => {
            if (processed.has(marker.id)) return;

            const cluster = [marker];
            processed.add(marker.id);

            const p1 = map.latLngToContainerPoint(L.latLng(marker.lat, marker.lng));

            declutterableMarkers.forEach((other, j) => {
                if (i >= j || processed.has(other.id)) return;

                const p2 = map.latLngToContainerPoint(L.latLng(other.lat, other.lng));
                const distance = p1.distanceTo(p2);

                // If overlapping, add to cluster
                if (distance < minSpacing) {
                    cluster.push(other);
                    processed.add(other.id);
                }
            });

            if (cluster.length > 1) {
                clusters.push(cluster);
            }
        });

        // Spread each cluster just enough to not overlap
        clusters.forEach(cluster => {
            const count = cluster.length;
            // Calculate center of cluster
            const centerLat = cluster.reduce((sum, m) => sum + m.lat, 0) / count;
            const centerLng = cluster.reduce((sum, m) => sum + m.lng, 0) / count;
            const centerPoint = map.latLngToContainerPoint(L.latLng(centerLat, centerLng));

            // Spread radius = just enough so markers are minSpacing apart
            // For N markers in a circle: radius = minSpacing / (2 * sin(π/N))
            const spreadRadius = count === 2
                ? minSpacing / 2
                : minSpacing / (2 * Math.sin(Math.PI / count));

            cluster.forEach((marker, idx) => {
                const angle = (2 * Math.PI * idx) / count - Math.PI / 2; // Start from top
                const offsetX = Math.cos(angle) * spreadRadius;
                const offsetY = Math.sin(angle) * spreadRadius;

                const newPoint = L.point(centerPoint.x + offsetX, centerPoint.y + offsetY);
                const newLatLng = map.containerPointToLatLng(newPoint);

                positions[marker.id] = {
                    lat: newLatLng.lat,
                    lng: newLatLng.lng
                };
            });
        });

        return positions;
    }, [map, allMarkers]);

    // Recalculate on zoom change
    useMapEvents({
        zoomend: () => {
            const positions = calculateDeclutteredPositions();
            setDeclutteredPositions(positions);
        },
        moveend: () => {
            const positions = calculateDeclutteredPositions();
            setDeclutteredPositions(positions);
        }
    });

    // Recalculate when markers change (e.g., news items load)
    useEffect(() => {
        // Small delay to let the render settle
        const timeout = setTimeout(() => {
            const positions = calculateDeclutteredPositions();
            setDeclutteredPositions(positions);
        }, 100);
        return () => clearTimeout(timeout);
    }, [allMarkers, calculateDeclutteredPositions, setDeclutteredPositions]);



    return null;
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
// Video popup content component with ref forwarding for video control
const VideoPopupContent = React.forwardRef(({ video, onVideoPlay, onVideoPause }, ref) => {
    const videoRef = useRef(null);

    // Extract TikTok ID if applicable
    const getTikTokId = (url) => {
        const match = url && url.match(/video\/(\d+)/);
        return match ? match[1] : null;
    };

    const tikTokId = getTikTokId(video.src);
    const isIframe = !!tikTokId; // For now, only detect TikTok as iframe needs

    // Expose video element to parent
    React.useImperativeHandle(ref, () => ({
        play: () => {
            if (videoRef.current && !isIframe) {
                // If start time configured and we are at start, seek
                if (video.startTime && videoRef.current.currentTime < video.startTime) {
                    videoRef.current.currentTime = video.startTime;
                }
                videoRef.current.play().catch(e => console.log('Video autoplay blocked:', e));
            }
        },
        pause: () => {
            if (videoRef.current && !isIframe) {
                videoRef.current.pause();
            }
        },
        stop: () => {
            if (videoRef.current && !isIframe) {
                videoRef.current.pause();
                videoRef.current.currentTime = video.startTime || 0;
            }
        }
    }));

    return (
        <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '320px' }}>
            <strong style={{ color: COLORS.video }}>VIDEO INTEL // {video.title}</strong><br />
            <div style={{ marginTop: '6px', border: `1px solid ${COLORS.video}`, background: '#000', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isIframe ? (
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${tikTokId}`}
                        style={{ width: '100%', height: '380px', border: 'none' }}
                        allow="encrypted-media;"
                    ></iframe>
                ) : (
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
                )}
            </div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px', textAlign: 'right' }}>
                {isIframe ? 'SOURCE: TIKTOK' : 'LOOP: ACTIVE'} // ID: {video.id.toUpperCase()}
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
        const currentZoom = map.getZoom();
        const targetZoom = currentZoom >= 8 ? currentZoom : 8;
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
                        autoPan={false}
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
    const [sudanFrontlines, setSudanFrontlines] = useState([]);
    const [myanmarFrontlines, setMyanmarFrontlines] = useState([]);
    const [controlZones, setControlZones] = useState([]);
    const [spreadState, setSpreadState] = useState({ active: false, positions: {}, center: null });
    const [focusedNewsId, setFocusedNewsId] = useState(null);
    const [showTheatres, setShowTheatres] = useState(false);
    const [readNewsIds, setReadNewsIds] = useState(new Set());
    const [declutteredPositions, setDeclutteredPositions] = useState({});

    // Access map layers and currentTheatre from store
    const { layers, currentTheatre } = useMapStore();

    // Delay showing theatre polygons until after initial zoom animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTheatres(true);
        }, 1300); // Matches the 300ms delay + 1s animation
        return () => clearTimeout(timer);
    }, []);

    // Get news and selectedNews from store
    const { allNews, selectedNews, clearSelectedNews } = useDataStore();

    // Geolocate news items (up to 110)
    const geolocatedNews = useMemo(() => {
        return geolocateNewsItems(allNews, 110);
    }, [allNews]);

    // Calculate time stats for relative styling (opacity based on dataset range)
    const { minTime, timeRange } = useMemo(() => {
        if (!geolocatedNews.length) return { minTime: 0, timeRange: 1 };
        const times = geolocatedNews.map(n => new Date(n.newsItem.pubDate).getTime());
        const max = Math.max(...times);
        const min = Math.min(...times);
        return { minTime: min, timeRange: max - min || 1 };
    }, [geolocatedNews]);

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

        // News markers (geolocated)
        geolocatedNews.forEach(({ newsItem, location }, index) => {
            markers.push({
                id: `news-${newsItem.id || index}`,
                lat: location.lat,
                lng: location.lng,
                type: 'news',
                data: { newsItem, location }
            });
        });

        return markers;
    }, [geolocatedNews]);

    // Get marker position (auto-decluttered, spread, or original)
    const getMarkerPosition = useCallback((markerId, originalLat, originalLng) => {
        // First check if there's a decluttered position (auto-spread when zoomed out)
        if (declutteredPositions[markerId]) {
            return [declutteredPositions[markerId].lat, declutteredPositions[markerId].lng];
        }
        // Then check for click-spread positions
        if (spreadState.active && spreadState.positions[markerId]) {
            return [spreadState.positions[markerId].lat, spreadState.positions[markerId].lng];
        }
        return [originalLat, originalLng];
    }, [declutteredPositions, spreadState]);

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

    // Fetch all frontline data (Ukraine live, Sudan/Myanmar static)
    useEffect(() => {
        const loadFrontlineData = async () => {
            try {
                // Fetch all frontlines in parallel
                const [ukraineResult, sudanResult, myanmarResult] = await Promise.all([
                    fetchUkraineFrontline(),
                    fetchSudanFrontlines(),
                    fetchMyanmarFrontlines()
                ]);

                if (ukraineResult.success && ukraineResult.data.length > 0) {
                    setFrontlineData(ukraineResult.data);
                    console.log(`Loaded ${ukraineResult.data.length} Ukraine frontline segments`);
                }

                if (sudanResult.success) {
                    setSudanFrontlines(sudanResult.data);
                    console.log(`Loaded ${sudanResult.data.length} Sudan frontline segments`);
                }

                if (myanmarResult.success) {
                    setMyanmarFrontlines(myanmarResult.data);
                    console.log(`Loaded ${myanmarResult.data.length} Myanmar frontline segments`);
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

    // Fetch territorial control zones (live data with 6hr cache)
    useEffect(() => {
        const loadControlZones = async () => {
            try {
                const zones = await getControlZones();
                setControlZones(zones);
                console.log(`Loaded ${zones.length} territorial control zones`);
            } catch (err) {
                console.error('Failed to load control zones:', err);
            }
        };
        loadControlZones();
        // Refresh every 6 hours (control zones change slowly)
        const interval = setInterval(loadControlZones, 6 * 60 * 60 * 1000);
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

                <MapController activeTheatre={currentTheatre || activeTheatre} onTheatreSelect={onTheatreSelect} />
                <ZoomDisplay />
                <NewsFocusHandler
                    selectedNews={selectedNews}
                    clearSelectedNews={clearSelectedNews}
                    setFocusedNewsId={setFocusedNewsId}
                />
                <ClusterSpreadManager
                    allMarkers={allMarkers}
                    spreadState={spreadState}
                    setSpreadState={setSpreadState}
                />
                <AutoDeclutter
                    allMarkers={allMarkers}
                    setDeclutteredPositions={setDeclutteredPositions}
                />


                {/* Theatre Zone Polygons - delayed to appear after initial zoom */}
                {showTheatres && THEATRES.map(theatre => (
                    <Polygon
                        key={theatre.id}
                        positions={theatre.polygon
                            ? theatre.polygon.map(([lat, lng]) => [lat, lng])
                            : [
                                [theatre.bounds.north, theatre.bounds.west],
                                [theatre.bounds.north, theatre.bounds.east],
                                [theatre.bounds.south, theatre.bounds.east],
                                [theatre.bounds.south, theatre.bounds.west]
                            ]
                        }
                        pathOptions={{
                            color: COLORS.accent,
                            weight: 1,
                            opacity: 0.3,
                            fillOpacity: 0,
                            dashArray: '10, 5',
                            interactive: false
                        }}
                    />
                ))}

                {/* Territorial Control Zones - Low opacity overlays */}
                {layers.controlzones && controlZones.map(zone => (
                    <Polygon
                        key={zone.id}
                        positions={zone.coords.map(c => [c[1], c[0]])}
                        pathOptions={{
                            color: zone.color,
                            weight: 1,
                            opacity: 0.6,
                            fillColor: zone.color,
                            fillOpacity: zone.opacity || 0.2,
                            dashArray: '4, 4'
                        }}
                    >
                        <Popup autoPan={false}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                <strong style={{ color: zone.color }}>{zone.name}</strong><br />
                                <span style={{ color: '#888' }}>Faction: {zone.faction}</span><br />
                                <span style={{ fontSize: '10px', color: '#aaa' }}>{zone.description}</span><br />
                                <span style={{ fontSize: '9px', color: '#666' }}>Source: {zone.source}</span>
                                {zone.lastUpdated && <><br /><span style={{ fontSize: '9px', color: '#666' }}>Updated: {zone.lastUpdated}</span></>}
                            </div>
                        </Popup>
                    </Polygon>
                ))}

                {/* Conflict Zones */}
                {layers.conflicts && CONFLICT_ZONES.map(zone => (
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

                {/* All Frontlines - Ukraine (live), Sudan, Myanmar (static) */}
                {layers.frontlines && (
                    <>
                        {/* Ukraine Frontline from ISW/ArcGIS */}
                        {frontlineData.map((segment, idx) => {
                            // Convert [lon, lat] to [lat, lon] for Leaflet
                            const positions = segment.coordinates.map(coord => [coord[1], coord[0]]);
                            return (
                                <Polyline
                                    key={`frontline-ukraine-${segment.id || idx}`}
                                    positions={positions}
                                    pathOptions={{
                                        color: '#ff4757',
                                        weight: 3,
                                        opacity: 0.9,
                                        dashArray: null,
                                        smoothFactor: 1.5
                                    }}
                                >
                                    <Popup autoPan={false}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                            <strong style={{ color: '#ff4757' }}>🇺🇦 UKRAINE FRONTLINE</strong><br />
                                            Source: {segment.properties?.source || 'ISW/CTP'}<br />
                                            <span style={{ color: '#888' }}>Updated: {segment.properties?.date}</span>
                                        </div>
                                    </Popup>
                                </Polyline>
                            );
                        })}

                        {/* Sudan Frontlines */}
                        {sudanFrontlines.map((segment, idx) => {
                            // Convert [lon, lat] to [lat, lon] for Leaflet
                            const positions = segment.coordinates.map(coord => [coord[1], coord[0]]);
                            return (
                                <Polyline
                                    key={`frontline-sudan-${segment.id || idx}`}
                                    positions={positions}
                                    pathOptions={{
                                        color: '#ffa502',
                                        weight: 3,
                                        opacity: 0.85,
                                        dashArray: '8, 4',
                                        smoothFactor: 1.5
                                    }}
                                >
                                    <Popup autoPan={false}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                            <strong style={{ color: '#ffa502' }}>🇸🇩 SUDAN FRONTLINE</strong><br />
                                            {segment.properties?.name}<br />
                                            <span style={{ color: '#888' }}>{segment.properties?.parties}</span><br />
                                            <span style={{ fontSize: '9px', color: '#666' }}>Source: {segment.properties?.source}</span>
                                        </div>
                                    </Popup>
                                </Polyline>
                            );
                        })}

                        {/* Myanmar Frontlines */}
                        {myanmarFrontlines.map((segment, idx) => {
                            // Convert [lon, lat] to [lat, lon] for Leaflet
                            const positions = segment.coordinates.map(coord => [coord[1], coord[0]]);
                            return (
                                <Polyline
                                    key={`frontline-myanmar-${segment.id || idx}`}
                                    positions={positions}
                                    pathOptions={{
                                        color: '#f1c40f',
                                        weight: 3,
                                        opacity: 0.85,
                                        dashArray: '8, 4',
                                        smoothFactor: 1.5
                                    }}
                                >
                                    <Popup autoPan={false}>
                                        <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                            <strong style={{ color: '#f1c40f' }}>🇲🇲 MYANMAR FRONTLINE</strong><br />
                                            {segment.properties?.name}<br />
                                            <span style={{ color: '#888' }}>{segment.properties?.parties}</span><br />
                                            <span style={{ fontSize: '9px', color: '#666' }}>Source: {segment.properties?.source}</span>
                                        </div>
                                    </Popup>
                                </Polyline>
                            );
                        })}
                    </>
                )}

                {/* Intel Hotspots */}
                {INTEL_HOTSPOTS.map(spot => (
                    <Marker
                        key={spot.id}
                        position={getMarkerPosition(`intel-${spot.id}`, spot.lat, spot.lon)}
                        icon={createPulseIcon(getLevelColor(spot.level))}
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            }
                        }}
                    >
                        <Popup autoPan={false} maxWidth={300}>
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
                {layers.bases && MILITARY_BASES.map(base => {
                    const color = base.type === 'us-nato' ? COLORS.usnato :
                        base.type === 'china' ? COLORS.china : COLORS.russia;
                    return (
                        <Marker
                            key={base.id}
                            position={getMarkerPosition(`base-${base.id}`, base.lat, base.lon)}
                            icon={createSquareIcon(color)}
                            eventHandlers={{
                                mouseover: (e) => {
                                    e.target.openPopup();
                                }
                            }}
                        >
                            <Popup autoPan={false}>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                    <strong>{base.name}</strong><br />
                                    <span style={{ color: '#888' }}>{base.type.toUpperCase()}</span>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* Nuclear Facilities */}
                {layers.nuclear && NUCLEAR_FACILITIES.map(facility => (
                    <Marker
                        key={facility.id}
                        position={getMarkerPosition(`nuclear-${facility.id}`, facility.lat, facility.lon)}
                        icon={createNuclearIcon('#ffa502')}
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            }
                        }}
                    >
                        <Popup autoPan={false}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                <strong style={{ color: '#ffa502' }}>☢️ {facility.name}</strong><br />
                                <span style={{ color: '#888' }}>{facility.country}</span><br />
                                <span style={{ color: '#4da6ff' }}>{facility.type}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Shipping Chokepoints */}
                {layers.chokepoints && SHIPPING_CHOKEPOINTS.map(point => (
                    <Marker
                        key={point.id}
                        position={getMarkerPosition(`ship-${point.id}`, point.lat, point.lon)}
                        icon={createTriangleIcon('#00d4ff')}
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            }
                        }}
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

                {/* Undersea Cables */}
                {layers.cables && UNDERSEA_CABLES.map(cable => (
                    <Polyline
                        key={cable.id}
                        positions={cable.coords}
                        pathOptions={{
                            color: '#00ffcc',
                            weight: 2,
                            opacity: 0.7,
                            dashArray: '4, 8',
                            smoothFactor: 1.5
                        }}
                    >
                        <Popup autoPan={false}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                <strong style={{ color: '#00ffcc' }}>{cable.name}</strong><br />
                                Capacity: {cable.capacity}<br />
                                Length: {cable.length}<br />
                                Status: <span style={{ color: '#0f0' }}>{cable.status.toUpperCase()}</span>
                                {cable.owner && <><br />Owner: {cable.owner}</>}
                            </div>
                        </Popup>
                    </Polyline>
                ))}

                {/* Cyber Threat Zones */}
                {layers.cyber && CYBER_ZONES.map(zone => (
                    <Marker
                        key={zone.id}
                        position={getMarkerPosition(`cyber-${zone.id}`, zone.lat, zone.lon)}
                        icon={createPulseIcon('#ff4757', 12)}
                        eventHandlers={{
                            mouseover: (e) => {
                                e.target.openPopup();
                            }
                        }}
                    >
                        <Popup autoPan={false}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                <strong style={{ color: '#ff4757' }}>💻 {zone.fullName}</strong><br />
                                <span style={{ color: '#ffa502' }}>{zone.group}</span><br />
                                <span style={{ color: '#888' }}>Targets: {zone.targets.join(', ')}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* News Feed Markers */}
                {geolocatedNews.map(({ newsItem, location }, index) => {
                    // Calculate relative opacity: 0.1 (oldest) to 1.0 (newest)
                    const itemTime = new Date(newsItem.pubDate).getTime();
                    const normalized = Math.max(0, Math.min(1, (itemTime - minTime) / timeRange));
                    const opacity = 0.1 + (normalized * 0.9);
                    const blur = 2 + (normalized * 8);
                    const isRead = readNewsIds.has(newsItem.id);

                    // Get publisher logo
                    const publisherInfo = getPublisherLogo(newsItem.source);
                    const logoUrl = publisherInfo?.url;

                    // Debug: Log image, video, and logo availability for first few items
                    if (index < 3) {
                        console.log(`[News #${index}] ${newsItem.source}:`);
                        console.log(`  - Title: ${newsItem.title.substring(0, 50)}...`);
                        console.log(`  - Image: ${newsItem.imageUrl || 'NONE'}`);
                        console.log(`  - Video: ${newsItem.videoUrl || 'NONE'} (${newsItem.videoType || 'N/A'})`);
                        console.log(`  - Logo: ${logoUrl || 'NONE'}`);
                        console.log(`  - Description length: ${newsItem.description?.length || 0} chars`);
                    }

                    return (
                        <Marker
                            key={`news-${newsItem.id || index}`}
                            position={getMarkerPosition(`news-${newsItem.id || index}`, location.lat, location.lng)}
                            icon={createNewsIcon(COLORS.news, opacity, blur, isRead, logoUrl)}
                            eventHandlers={{
                                mouseover: (e) => {
                                    e.target.openPopup();
                                },
                                click: () => {
                                    setReadNewsIds(prev => {
                                        const next = new Set(prev);
                                        next.add(newsItem.id);
                                        return next;
                                    });
                                }
                            }}
                        >
                            <Popup autoPan={false} maxWidth={300}>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px', maxWidth: '280px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {logoUrl && (
                                                <img
                                                    src={logoUrl}
                                                    alt={newsItem.source}
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        borderRadius: '50%',
                                                        objectFit: 'contain'
                                                    }}
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            )}
                                            <span style={{ color: COLORS.news, fontWeight: 'bold', fontSize: '9px' }}>{newsItem.source}</span>
                                        </div>
                                        <span style={{ color: '#5a6478', fontSize: '9px' }}>{timeAgo(newsItem.pubDate)}</span>
                                    </div>
                                    {/* Bias Meter */}
                                    {newsItem.bias !== undefined && (
                                        <div style={{ marginBottom: '6px', padding: '4px', background: '#1a2030', borderRadius: '2px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[0, 1, 2, 3, 4, 5, 6].map(i => {
                                                        const position = (newsItem.bias || 0) + 3;
                                                        const isActive = i === position;
                                                        const getBiasColor = (b) => {
                                                            if (b <= -2) return '#ef4444';
                                                            if (b === -1) return '#f87171';
                                                            if (b === 0) return '#a855f7';
                                                            if (b === 1) return '#60a5fa';
                                                            return '#3b82f6';
                                                        };
                                                        return (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    width: '8px',
                                                                    height: '6px',
                                                                    borderRadius: '1px',
                                                                    backgroundColor: isActive ? getBiasColor(newsItem.bias || 0) : '#2a3040',
                                                                    opacity: isActive ? 1 : 0.4
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                                <span style={{ fontSize: '8px', color: '#8892a8' }}>
                                                    {newsItem.biasLabel || 'Unknown'} • Reliability: {newsItem.reliability || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {/* Article Video - Embedded from RSS feed (YouTube, direct video, etc.) */}
                                    {newsItem.videoUrl && (
                                        <div style={{
                                            marginBottom: '8px',
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                            border: '1px solid #2a3040',
                                            background: '#0d1117',
                                            position: 'relative',
                                            paddingBottom: newsItem.videoType === 'youtube' || newsItem.videoType === 'embed' ? '56.25%' : '0', // 16:9 aspect ratio for embeds
                                            height: newsItem.videoType === 'direct' ? '150px' : 'auto'
                                        }}>
                                            {(newsItem.videoType === 'youtube' || newsItem.videoType === 'embed') ? (
                                                <iframe
                                                    src={newsItem.videoUrl}
                                                    title={newsItem.title}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        border: 'none'
                                                    }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <video
                                                    src={newsItem.videoUrl}
                                                    controls
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        display: 'block'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.parentElement.style.display = 'none';
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </div>
                                    )}

                                    {/* Article Image - Embedded from RSS feed */}
                                    {newsItem.imageUrl && (
                                        <div style={{
                                            marginBottom: '8px',
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                            border: '1px solid #2a3040',
                                            background: '#0d1117'
                                        }}>
                                            <img
                                                src={newsItem.imageUrl}
                                                alt={newsItem.title}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    maxHeight: '150px',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                                onError={(e) => {
                                                    console.error(`[News Image] Failed to load: ${newsItem.imageUrl}`);
                                                    e.target.parentElement.style.display = 'none';
                                                }}
                                                onLoad={() => {
                                                    console.log(`[News Image] Successfully loaded: ${newsItem.imageUrl}`);
                                                }}
                                            />
                                        </div>
                                    )}

                                    <a
                                        href={newsItem.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#e0e4eb', textDecoration: 'none', lineHeight: '1.4', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
                                    >
                                        {newsItem.title}
                                    </a>

                                    {/* Article Description/Summary */}
                                    {newsItem.description && (
                                        <div style={{
                                            marginBottom: '8px',
                                            padding: '8px',
                                            background: '#1a2030',
                                            borderRadius: '2px',
                                            fontSize: '10px',
                                            lineHeight: '1.5',
                                            color: '#8892a8',
                                            maxHeight: '120px',
                                            overflowY: 'auto'
                                        }}>
                                            {newsItem.description}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                        <div style={{ fontSize: '9px', color: '#5a6478' }}>
                                            📍 {location.label}
                                        </div>
                                        {newsItem.category && (
                                            <div style={{
                                                fontSize: '8px',
                                                padding: '2px 6px',
                                                background: 'rgba(77, 166, 255, 0.1)',
                                                border: '1px solid rgba(77, 166, 255, 0.3)',
                                                color: '#4da6ff',
                                                borderRadius: '2px'
                                            }}>
                                                {newsItem.category}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

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
                            <Popup autoPan={false}>
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
                            <Popup autoPan={false}>
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
          transition: transform 0.3s ease-out;
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
                    <div style={{ color: COLORS.news }}>■ NEWS FEED</div>
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
