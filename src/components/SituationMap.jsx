import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, useMap, Marker, Popup, Polygon, Circle, Polyline, CircleMarker, useMapEvents } from 'react-leaflet';
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
import { SANCTION_HOTSPOTS } from '../data/sanctions';
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

// Global population density overlay (SEDAC GPWv4 WMS)
const POPULATION_DENSITY_WMS_URL = 'https://sedac.ciesin.columbia.edu/geoserver/wms';
const MAX_NEWS_MARKERS = 110;
const INITIAL_NEWS_MARKERS = 36;
const NEWS_MARKER_BATCH_SIZE = 24;
const NEWS_MARKER_BATCH_INTERVAL_MS = 110;

const EARTH_RADIUS_M = 6371008.8;
const NIGHT_RADIUS_M = Math.PI * EARTH_RADIUS_M / 2; // 90deg great-circle distance

function normalizeLongitude(lon) {
    let value = lon;
    while (value > 180) value -= 360;
    while (value < -180) value += 360;
    return value;
}

function getDayNightOverlay(date = new Date()) {
    const deg = 180 / Math.PI;
    const rad = Math.PI / 180;

    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
    const dayOfYear = (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - startOfYear) / 86400000;
    const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;

    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + ((utcMinutes / 60) - 12) / 24);
    const declination =
        0.006918
        - 0.399912 * Math.cos(gamma)
        + 0.070257 * Math.sin(gamma)
        - 0.006758 * Math.cos(2 * gamma)
        + 0.000907 * Math.sin(2 * gamma)
        - 0.002697 * Math.cos(3 * gamma)
        + 0.00148 * Math.sin(3 * gamma);
    const equationOfTime =
        229.18 * (
            0.000075
            + 0.001868 * Math.cos(gamma)
            - 0.032077 * Math.sin(gamma)
            - 0.014615 * Math.cos(2 * gamma)
            - 0.040849 * Math.sin(2 * gamma)
        );

    const subsolarLon = normalizeLongitude((720 - utcMinutes - equationOfTime) / 4);
    const subsolarLat = declination * deg;
    const nightCenter = [(-subsolarLat), normalizeLongitude(subsolarLon + 180)];

    const terminator = [];
    for (let lon = -180; lon <= 180; lon += 4) {
        const hourAngle = (lon - subsolarLon) * rad;
        let lat;
        if (Math.abs(Math.tan(declination)) < 1e-6) {
            lat = 0;
        } else {
            lat = Math.atan(-Math.cos(hourAngle) / Math.tan(declination)) * deg;
        }
        terminator.push([Math.max(-89.9, Math.min(89.9, lat)), lon]);
    }

    return { nightCenter, terminator };
}

function getEarthquakeColor(mag = 0) {
    if (mag >= 6) return '#ff4757';
    if (mag >= 5) return '#ff9f43';
    if (mag >= 4) return '#f1c40f';
    return '#4da6ff';
}

function positionsEqual(a = {}, b = {}) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    for (let i = 0; i < aKeys.length; i++) {
        const key = aKeys[i];
        const aPos = a[key];
        const bPos = b[key];
        if (!bPos) return false;
        if (Math.abs((aPos.lat || 0) - (bPos.lat || 0)) > 1e-7) return false;
        if (Math.abs((aPos.lng || 0) - (bPos.lng || 0)) > 1e-7) return false;
    }
    return true;
}

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

const createSanctionsIcon = (color = '#ff9f43', size = 14) => {
    return L.divIcon({
        className: 'custom-sanctions-marker',
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(0,0,0,0.85);
                border: 1px solid ${color};
                box-shadow: 0 0 8px ${color};
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${color};
                font-size: 9px;
                font-weight: bold;
                line-height: 1;
            ">S</div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
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

// Twitter/X marker icon with poster badge
const createTwitterIcon = (color, opacity = 1, username = null) => {
    const safeUsername = username ? username.replace(/"/g, '&quot;').replace(/'/g, '&#39;') : null;

    return L.divIcon({
        className: 'custom-twitter-marker',
        html: `
            <div style="position: relative; width: 24px; height: 24px; display: inline-block;">
                <div style="
                    font-size: 16px;
                    opacity: ${opacity};
                    text-shadow: 0 0 8px ${color}, 0 0 3px rgba(0,0,0,0.8);
                    filter: drop-shadow(0 0 3px ${color});
                    transition: all 0.5s ease;
                    line-height: 1;
                ">𝕏</div>
                ${safeUsername ? `
                    <div style="
                        position: absolute;
                        bottom: -4px;
                        right: -8px;
                        font-size: 7px;
                        font-family: monospace;
                        font-weight: bold;
                        color: ${color};
                        background: rgba(0,0,0,0.8);
                        padding: 1px 3px;
                        border-radius: 2px;
                        white-space: nowrap;
                        text-shadow: none;
                        box-shadow: 0 0 4px rgba(0,0,0,0.6);
                    ">@${safeUsername.slice(0, 8)}</div>
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
            setDeclutteredPositions(prev => (positionsEqual(prev, positions) ? prev : positions));
        },
        moveend: () => {
            const positions = calculateDeclutteredPositions();
            setDeclutteredPositions(prev => (positionsEqual(prev, positions) ? prev : positions));
        }
    });

    // Recalculate when markers change (e.g., news items load)
    useEffect(() => {
        // Small delay to let the render settle
        const timeout = setTimeout(() => {
            const positions = calculateDeclutteredPositions();
            setDeclutteredPositions(prev => (positionsEqual(prev, positions) ? prev : positions));
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
    const [legendOpen, setLegendOpen] = useState(false);
    const [dayNightNow, setDayNightNow] = useState(() => new Date());
    const [newsMarkerLimit, setNewsMarkerLimit] = useState(INITIAL_NEWS_MARKERS);

    // Access map layers and currentTheatre from store
    const { layers, currentTheatre } = useMapStore();

    useEffect(() => {
        if (!layers.daynight) return undefined;
        setDayNightNow(new Date());
        const timer = setInterval(() => setDayNightNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, [layers.daynight]);

    // Delay showing theatre polygons until after initial zoom animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTheatres(true);
        }, 1300); // Matches the 300ms delay + 1s animation
        return () => clearTimeout(timer);
    }, []);

    // Get news, twitter, earthquakes, and selectedNews from store
    const { allNews, twitterEvents, earthquakes, selectedNews, clearSelectedNews } = useDataStore();

    // Fill map news markers in fast batches for better perceived responsiveness.
    useEffect(() => {
        const totalNews = Array.isArray(allNews) ? allNews.length : 0;
        const targetLimit = Math.min(MAX_NEWS_MARKERS, totalNews);
        if (targetLimit <= 0) {
            setNewsMarkerLimit(0);
            return undefined;
        }

        const initialLimit = Math.min(INITIAL_NEWS_MARKERS, targetLimit);
        setNewsMarkerLimit(initialLimit);

        if (targetLimit <= initialLimit) return undefined;

        let currentLimit = initialLimit;
        const timer = setInterval(() => {
            currentLimit = Math.min(targetLimit, currentLimit + NEWS_MARKER_BATCH_SIZE);
            setNewsMarkerLimit(currentLimit);
            if (currentLimit >= targetLimit) clearInterval(timer);
        }, NEWS_MARKER_BATCH_INTERVAL_MS);

        return () => clearInterval(timer);
    }, [allNews]);

    const dayNightOverlay = useMemo(() => getDayNightOverlay(dayNightNow), [dayNightNow]);

    // Geolocate only the active batch; the limit ramps quickly above.
    const geolocatedNews = useMemo(() => {
        return geolocateNewsItems(allNews, newsMarkerLimit);
    }, [allNews, newsMarkerLimit]);

    // Geolocate twitter intel items (up to 50)
    // Convert tweets to news-like format for geolocating
    const geolocatedTweets = useMemo(() => {
        const tweetAsNews = twitterEvents.map(tweet => ({
            id: tweet.id,
            title: tweet.title,
            description: tweet.description,
            link: tweet.link,
            pubDate: tweet.pubDate,
            source: tweet.source,
            username: tweet.username
        }));
        return geolocateNewsItems(tweetAsNews, 50);
    }, [twitterEvents]);

    // Calculate time stats for relative styling (opacity based on dataset range)
    const { minTime, timeRange } = useMemo(() => {
        if (!geolocatedNews.length) return { minTime: 0, timeRange: 1 };
        const times = geolocatedNews.map(n => new Date(n.newsItem.pubDate).getTime());
        const max = Math.max(...times);
        const min = Math.min(...times);
        return { minTime: min, timeRange: max - min || 1 };
    }, [geolocatedNews]);

    // Precompute news marker visual state/icons once per data update (not per zoom/pan render)
    const newsMarkers = useMemo(() => {
        return geolocatedNews.map(({ newsItem, location }, index) => {
            const markerId = `news-${newsItem.id || index}`;
            const itemTime = new Date(newsItem.pubDate).getTime();
            const normalized = Math.max(0, Math.min(1, ((Number.isFinite(itemTime) ? itemTime : minTime) - minTime) / timeRange));
            const opacity = 0.1 + (normalized * 0.9);
            const blur = 2 + (normalized * 8);
            const isRead = readNewsIds.has(newsItem.id);
            const publisherInfo = getPublisherLogo(newsItem.source);
            const logoUrl = publisherInfo?.url;

            return {
                key: markerId,
                markerId,
                newsItem,
                location,
                logoUrl,
                icon: createNewsIcon(COLORS.news, opacity, blur, isRead, logoUrl)
            };
        });
    }, [geolocatedNews, minTime, timeRange, readNewsIds]);

    // Precompute twitter marker visual state/icons once per data update
    const twitterMarkers = useMemo(() => {
        return geolocatedTweets.map(({ newsItem: tweet, location }, index) => {
            const markerId = `twitter-${tweet.id || index}`;
            return {
                key: markerId,
                markerId,
                tweet,
                location,
                icon: createTwitterIcon('#1da1f2', 1, tweet.username)
            };
        });
    }, [geolocatedTweets]);

    const globalConflictEvents = useMemo(() => getAllConflictEvents(), []);

    // Shared canvas renderer for vector layers to reduce SVG DOM overhead.
    const vectorRenderer = useMemo(() => L.canvas({ padding: 0.5 }), []);

    // Memoize theatre polygons + style (static data - never changes)
    const theatrePolygons = useMemo(() => {
        return THEATRES.map(theatre => ({
            id: theatre.id,
            positions: theatre.polygon
                ? theatre.polygon.map(([lat, lng]) => [lat, lng])
                : [
                    [theatre.bounds.north, theatre.bounds.west],
                    [theatre.bounds.north, theatre.bounds.east],
                    [theatre.bounds.south, theatre.bounds.east],
                    [theatre.bounds.south, theatre.bounds.west]
                ],
            pathOptions: {
                color: COLORS.accent,
                weight: 1,
                opacity: 0.3,
                fillOpacity: 0,
                dashArray: '10, 5',
                interactive: false,
                smoothFactor: 1.4,
                renderer: vectorRenderer
            }
        }));
    }, [vectorRenderer]);

    // Precompute polygon points + style for territorial control zones.
    const controlZonePolygons = useMemo(() => {
        return controlZones
            .filter(zone => Array.isArray(zone.coords) && zone.coords.length > 2)
            .map(zone => ({
                ...zone,
                positions: zone.coords.map(c => [c[1], c[0]]),
                pathOptions: {
                    color: zone.color,
                    weight: 1,
                    opacity: 0.6,
                    fillColor: zone.color,
                    fillOpacity: zone.opacity || 0.2,
                    dashArray: '4, 4',
                    smoothFactor: 1.4,
                    bubblingMouseEvents: false,
                    renderer: vectorRenderer
                }
            }));
    }, [controlZones, vectorRenderer]);

    // Precompute conflict zone polygon points + style.
    const conflictZonePolygons = useMemo(() => {
        return CONFLICT_ZONES
            .filter(zone => Array.isArray(zone.coords) && zone.coords.length > 2)
            .map(zone => {
                const intensityColor = zone.intensity === 'high'
                    ? COLORS.high
                    : zone.intensity === 'medium'
                        ? COLORS.elevated
                        : '#ffd700';

                return {
                    ...zone,
                    intensityColor,
                    positions: zone.coords.map(c => [c[1], c[0]]),
                    pathOptions: {
                        color: intensityColor,
                        weight: 1.5,
                        opacity: 0.6,
                        fillOpacity: 0.15,
                        dashArray: '6, 3',
                        smoothFactor: 1.4,
                        bubblingMouseEvents: false,
                        renderer: vectorRenderer
                    }
                };
            });
    }, [vectorRenderer]);

    // Collect only currently visible markers for cluster detection
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

        if (layers.bases) {
            MILITARY_BASES.forEach(base => {
                markers.push({ id: `base-${base.id}`, lat: base.lat, lng: base.lon, type: 'base', data: base });
            });
        }

        if (layers.chokepoints) {
            SHIPPING_CHOKEPOINTS.forEach(point => {
                markers.push({ id: `ship-${point.id}`, lat: point.lat, lng: point.lon, type: 'ship', data: point });
            });
        }

        newsMarkers.forEach((marker) => {
            markers.push({
                id: marker.markerId,
                lat: marker.location.lat,
                lng: marker.location.lng,
                type: 'news',
                data: marker
            });
        });

        twitterMarkers.forEach((marker) => {
            markers.push({
                id: marker.markerId,
                lat: marker.location.lat,
                lng: marker.location.lng,
                type: 'twitter',
                data: marker
            });
        });

        if (layers.nuclear) {
            NUCLEAR_FACILITIES.forEach((facility) => {
                markers.push({ id: `nuclear-${facility.id}`, lat: facility.lat, lng: facility.lon, type: 'nuclear', data: facility });
            });
        }

        if (layers.cyber) {
            CYBER_ZONES.forEach((zone) => {
                markers.push({ id: `cyber-${zone.id}`, lat: zone.lat, lng: zone.lon, type: 'cyber', data: zone });
            });
        }

        if (layers.sanctions) {
            SANCTION_HOTSPOTS.forEach((spot) => {
                markers.push({ id: `sanction-${spot.id}`, lat: spot.lat, lng: spot.lon, type: 'sanction', data: spot });
            });
        }

        return markers;
    }, [newsMarkers, twitterMarkers, layers.bases, layers.chokepoints, layers.nuclear, layers.cyber, layers.sanctions]);

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
                preferCanvas={true}
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

                {/* Optional population density overlay */}
                {layers.density && (
                    <WMSTileLayer
                        url={POPULATION_DENSITY_WMS_URL}
                        layers="gpw-v4:gpw-v4-population-density_2020"
                        format="image/png"
                        transparent={true}
                        version="1.1.1"
                        className="population-density-tiles"
                        opacity={0.62}
                        zIndex={250}
                    />
                )}

                {/* Optional day/night overlay */}
                {layers.daynight && (
                    <>
                        <Circle
                            center={dayNightOverlay.nightCenter}
                            radius={NIGHT_RADIUS_M}
                            pathOptions={{
                                color: '#0b1020',
                                weight: 1,
                                opacity: 0.55,
                                fillColor: '#03060d',
                                fillOpacity: 0.26
                            }}
                            interactive={false}
                        />
                        <Polyline
                            positions={dayNightOverlay.terminator}
                            pathOptions={{
                                color: '#8aa7d6',
                                weight: 1.2,
                                opacity: 0.6,
                                dashArray: '4, 6'
                            }}
                            interactive={false}
                        />
                    </>
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


                {/* Theatre Zone Polygons - memoized for performance, delayed to appear after initial zoom */}
                {showTheatres && theatrePolygons.map(theatre => (
                    <Polygon
                        key={theatre.id}
                        positions={theatre.positions}
                        pathOptions={theatre.pathOptions}
                    />
                ))}

                {/* Territorial Control Zones - Low opacity overlays */}
                {layers.controlzones && controlZonePolygons.map(zone => (
                    <Polygon
                        key={zone.id}
                        positions={zone.positions}
                        pathOptions={zone.pathOptions}
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
                {layers.conflicts && conflictZonePolygons.map(zone => (
                    <Polygon
                        key={zone.id}
                        positions={zone.positions}
                        pathOptions={zone.pathOptions}
                    >
                        <Popup maxWidth={320}>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px', maxWidth: '300px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid #2a3040', paddingBottom: '4px' }}>
                                    <strong style={{ color: zone.intensityColor }}>{zone.name}</strong>
                                    <span style={{ fontSize: '9px', padding: '2px 6px', border: `1px solid ${zone.intensityColor}`, color: zone.intensityColor }}>
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
                            const segmentId = segment.id || idx;
                            return (
                                <React.Fragment key={`frontline-ukraine-${segmentId}`}>
                                    {/* Outer halo for better contrast against tiles */}
                                    <Polyline
                                        positions={positions}
                                        pathOptions={{
                                            color: '#ff4757',
                                            weight: 8,
                                            opacity: 0.2,
                                            smoothFactor: 0.5,
                                            lineCap: 'round',
                                            lineJoin: 'round',
                                            interactive: false
                                        }}
                                    />

                                    {/* Core frontline stroke */}
                                    <Polyline
                                        positions={positions}
                                        pathOptions={{
                                            color: '#ff5f6f',
                                            weight: 4,
                                            opacity: 0.95,
                                            smoothFactor: 0.5,
                                            lineCap: 'round',
                                            lineJoin: 'round',
                                            interactive: false
                                        }}
                                    />

                                    {/* Dashed tactical overlay */}
                                    <Polyline
                                        positions={positions}
                                        pathOptions={{
                                            color: '#ffd4da',
                                            weight: 1.4,
                                            opacity: 0.7,
                                            dashArray: '10, 6',
                                            smoothFactor: 0.5,
                                            lineCap: 'round',
                                            lineJoin: 'round'
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
                                </React.Fragment>
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

                {/* Sanctions Layer */}
                {layers.sanctions && SANCTION_HOTSPOTS.map((spot) => {
                    const weightScale = Math.max(4, Math.min(11, Math.sqrt(spot.estimatedEntities || 0) / 6));
                    return (
                        <React.Fragment key={spot.id}>
                            <CircleMarker
                                center={[spot.lat, spot.lon]}
                                radius={weightScale}
                                pathOptions={{
                                    color: '#ff9f43',
                                    fillColor: '#ff9f43',
                                    fillOpacity: 0.18,
                                    weight: 1.2
                                }}
                            />
                            <Marker
                                position={[spot.lat, spot.lon]}
                                icon={createSanctionsIcon('#ff9f43', 14)}
                                eventHandlers={{
                                    mouseover: (e) => {
                                        e.target.openPopup();
                                    }
                                }}
                            >
                                <Popup autoPan={false}>
                                    <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '220px' }}>
                                        <strong style={{ color: '#ff9f43' }}>SANCTIONS: {spot.name}</strong><br />
                                        <span style={{ color: '#8892a8' }}>Focus: {spot.target}</span><br />
                                        <span style={{ color: '#4da6ff' }}>Regimes: {spot.regimes.join(', ')}</span><br />
                                        <span style={{ color: '#5a6478', fontSize: '10px' }}>Estimated listed entities: {spot.estimatedEntities.toLocaleString()}</span><br />
                                        <span style={{ color: '#888', fontSize: '10px' }}>{spot.note}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                {/* Earthquakes Layer */}
                {layers.earthquakes && earthquakes.map((eq, idx) => {
                    const magnitude = Number(eq.mag) || 0;
                    const color = getEarthquakeColor(magnitude);
                    const radius = Math.max(4, Math.min(14, magnitude * 1.8));
                    const eventTime = eq.time ? new Date(eq.time) : null;
                    const quakeKey = `eq-${eventTime ? eventTime.getTime() : idx}-${eq.lat}-${eq.lon}`;

                    return (
                        <CircleMarker
                            key={quakeKey}
                            center={[eq.lat, eq.lon]}
                            radius={radius}
                            pathOptions={{
                                color,
                                fillColor: color,
                                fillOpacity: 0.45,
                                weight: 1.2
                            }}
                        >
                            <Popup autoPan={false}>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '180px' }}>
                                    <strong style={{ color }}>M{magnitude.toFixed(1)} Earthquake</strong><br />
                                    <span style={{ color: '#e0e4eb' }}>{eq.place}</span><br />
                                    <span style={{ color: '#5a6478', fontSize: '10px' }}>
                                        {eventTime ? eventTime.toUTCString() : 'Unknown time'}
                                    </span>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}

                {/* News Feed Markers */}
                {newsMarkers.map(({ key, markerId, newsItem, location, logoUrl, icon }) => {
                    return (
                        <Marker
                            key={key}
                            position={getMarkerPosition(markerId, location.lat, location.lng)}
                            icon={icon}
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
                                                    e.target.parentElement.style.display = 'none';
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

                {/* Twitter Intel Markers */}
                {twitterMarkers.map(({ key, markerId, tweet, location, icon }) => {
                    return (
                        <Marker
                            key={key}
                            position={getMarkerPosition(markerId, location.lat, location.lng)}
                            icon={icon}
                            eventHandlers={{
                                mouseover: (e) => {
                                    e.target.openPopup();
                                }
                            }}
                        >
                            <Popup autoPan={false} maxWidth={300}>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px', maxWidth: '280px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '14px' }}>𝕏</span>
                                            <span style={{ color: '#1da1f2', fontWeight: 'bold', fontSize: '10px' }}>@{tweet.username}</span>
                                        </div>
                                        <span style={{ color: '#5a6478', fontSize: '9px' }}>{timeAgo(tweet.pubDate)}</span>
                                    </div>
                                    <a
                                        href={tweet.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#e0e4eb', textDecoration: 'none', lineHeight: '1.4', display: 'block', marginBottom: '8px' }}
                                    >
                                        {tweet.title}
                                    </a>
                                    {tweet.description && (
                                        <div style={{
                                            marginBottom: '8px',
                                            padding: '8px',
                                            background: '#1a2030',
                                            borderRadius: '2px',
                                            fontSize: '10px',
                                            lineHeight: '1.5',
                                            color: '#8892a8',
                                            maxHeight: '100px',
                                            overflowY: 'auto'
                                        }}>
                                            {tweet.description}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '9px', color: '#5a6478' }}>
                                        📍 {location.label}
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
                {globalConflictEvents.map((event, idx) => {
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
        .population-density-tiles {
          filter: saturate(1.45) contrast(1.12) brightness(1.02);
          mix-blend-mode: screen;
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
        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          transition: none !important;
        }
        .leaflet-pane {
          transform: translateZ(0);
        }
        .leaflet-tile {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .map-legend-container {
          position: fixed;
          top: 102px;
          right: 340px;
          z-index: 999;
          pointer-events: auto;
        }
        .map-legend-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(12, 15, 25, 0.92);
          border: 1px solid rgba(77, 166, 255, 0.3);
          color: #4da6ff;
          cursor: pointer;
          font-family: monospace;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 0.1em;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .map-legend-toggle:hover {
          background: rgba(77, 166, 255, 0.15);
          box-shadow: 0 0 15px rgba(77, 166, 255, 0.3);
          border-color: rgba(77, 166, 255, 0.5);
        }
        .map-legend-panel {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          width: 220px;
          background: rgba(10, 10, 15, 0.94);
          border: 1px solid #2a3040;
          padding: 8px 10px;
          font-family: monospace;
          font-size: 10px;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
          animation: slideDown 0.2s ease-out;
        }
        .map-legend-section {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid #2a3040;
        }
        .map-legend-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          color: #c7cfde;
        }
        .map-legend-chip {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .map-legend-line {
          display: inline-block;
          width: 12px;
          height: 2px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        @media (max-width: 1000px) {
          .map-legend-container {
            top: 92px !important;
            right: 20px !important;
          }
        }
      `}</style>

            {/* Compact legend (accordion-style toggle) */}
            <div
                className="map-legend-container"
                onMouseEnter={() => setLegendOpen(true)}
                onMouseLeave={() => setLegendOpen(false)}
            >
                <button
                    type="button"
                    className="map-legend-toggle"
                    onClick={() => setLegendOpen(prev => !prev)}
                    title="Map Legend"
                    aria-expanded={legendOpen}
                >
                    <span>LEGEND</span>
                    <span>{legendOpen ? 'v' : '>'}</span>
                </button>

                {legendOpen && (
                    <div className="map-legend-panel">
                        <div className="map-legend-row" style={{ color: COLORS.high }}>
                            <span className="map-legend-line" style={{ background: COLORS.high }}></span>
                            <span>Frontline (ISW)</span>
                        </div>
                        <div className="map-legend-row">
                            <span className="map-legend-chip" style={{ background: COLORS.medium }}></span>
                            <span>Low activity</span>
                        </div>
                        <div className="map-legend-row">
                            <span className="map-legend-chip" style={{ background: COLORS.elevated }}></span>
                            <span>Elevated</span>
                        </div>
                        <div className="map-legend-row">
                            <span className="map-legend-chip" style={{ background: COLORS.high }}></span>
                            <span>High activity</span>
                        </div>

                        <div className="map-legend-section">
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: COLORS.usnato }}></span>
                                <span>US/NATO</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: COLORS.china }}></span>
                                <span>China</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: COLORS.russia }}></span>
                                <span>Russia</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: COLORS.video }}></span>
                                <span>Video intel</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: COLORS.news }}></span>
                                <span>News feed</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: '#1da1f2' }}></span>
                                <span>Twitter intel</span>
                            </div>
                        </div>

                        <div className="map-legend-section">
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: '#ff9f43' }}></span>
                                <span>Sanctions</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: '#8aa7d6' }}></span>
                                <span>Day/night terminator</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: '#f1c40f' }}></span>
                                <span>Earthquakes</span>
                            </div>
                            <div className="map-legend-row">
                                <span className="map-legend-chip" style={{ background: '#b366ff' }}></span>
                                <span>Population density</span>
                            </div>
                        </div>
                    </div>
                )}
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


