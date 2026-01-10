import React from 'react';
import SituationMap from './SituationMap';
import MapLayersPanel from './MapLayersPanel';

/**
 * MapLayer - Contains the full-screen map with all map-related elements
 * including markers, popups, polygons, and other map overlays.
 */
const MapLayer = ({ activeTheatre, onTheatreSelect, mapTheme, onVideoStateChange }) => {
    return (
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
        </div>
    );
};

export default MapLayer;
