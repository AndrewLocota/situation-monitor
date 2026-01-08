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
    russia: '#ff4757'
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

const SituationMap = ({ activeTheatre, onTheatreSelect, mapTheme = 'dark' }) => {
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
                        <Popup>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                <strong>{zone.name}</strong><br />
                                {zone.description}<br />
                                <span style={{ color: '#888' }}>Since: {zone.startDate}</span>
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
                        <Popup>
                            <div style={{ fontFamily: 'monospace', fontSize: '11px', minWidth: '150px' }}>
                                <strong style={{ color: getLevelColor(spot.level) }}>{spot.name}</strong><br />
                                <span style={{ color: '#888' }}>{spot.subtext}</span><br />
                                {spot.description}<br />
                                <span style={{ fontSize: '9px', color: '#666' }}>Status: {spot.status}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

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
