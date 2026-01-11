import React from 'react';
import SituationMap from './SituationMap';
import MapLayersPanel from './MapLayersPanel';
import { ASCIILoadingOverlay } from './ASCIILoadingOverlay';
import { useDataStore, useMapStore } from '../stores';

/**
 * MapLayer - Contains the full-screen map with all map-related elements
 * including markers, popups, polygons, and other map overlays.
 */
const MapLayer = ({ activeTheatre, onTheatreSelect, mapTheme, onVideoStateChange }) => {
    const { isLoading } = useDataStore();
    const { currentTheatre } = useMapStore();

    // Check if zoomed into a specific theater (not global view)
    const isTheaterZoomed = currentTheatre && currentTheatre !== 'GLOBAL';

    return (
        <ASCIILoadingOverlay isActive={isLoading}>
            <div className="map-zoom-entry" style={{
                width: '100%',
                height: '100%',
                position: 'relative'
            }}>
                <SituationMap
                    activeTheatre={activeTheatre}
                    onTheatreSelect={onTheatreSelect}
                    mapTheme={mapTheme}
                    onVideoStateChange={onVideoStateChange}
                />
                <MapLayersPanel />

                {/* Theater Vignette Overlay - glows orange around edges when zoomed into theater */}
                {isTheaterZoomed && (
                    <div className="theater-vignette" />
                )}
            </div>
        </ASCIILoadingOverlay>
    );
};

export default MapLayer;
