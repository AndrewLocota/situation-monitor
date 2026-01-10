import { useState } from 'react';
import { useMapStore } from '../stores/mapStore';
import './MapLayersPanel.css';

export function MapLayersPanel() {
    const [isHovered, setIsHovered] = useState(false);
    const { layers, toggleLayer, setLayers } = useMapStore();

    const layerGroups = [
        {
            name: 'Infrastructure',
            layers: [
                { id: 'bases', label: 'Military Bases', icon: '🏛️' },
                { id: 'nuclear', label: 'Nuclear Facilities', icon: '☢️' },
                { id: 'cables', label: 'Undersea Cables', icon: '🔌' },
                { id: 'chokepoints', label: 'Shipping Chokepoints', icon: '🚢' }
            ]
        },
        {
            name: 'Geopolitical',
            layers: [
                { id: 'conflicts', label: 'Conflict Zones', icon: '⚔️' },
                { id: 'sanctions', label: 'Sanctions', icon: '🚫' },
                { id: 'cyber', label: 'Cyber Threats', icon: '💻' }
            ]
        },
        {
            name: 'Natural & Environment',
            layers: [
                { id: 'earthquakes', label: 'Earthquakes', icon: '📊' },
                { id: 'daynight', label: 'Day/Night Cycle', icon: '🌓' },
                { id: 'density', label: 'Population Density', icon: '👥' }
            ]
        }
    ];

    const handleSelectAll = () => {
        const allLayers = {};
        layerGroups.forEach(group => {
            group.layers.forEach(layer => {
                allLayers[layer.id] = true;
            });
        });
        setLayers(allLayers);
    };

    const handleClearAll = () => {
        const allLayers = {};
        layerGroups.forEach(group => {
            group.layers.forEach(layer => {
                allLayers[layer.id] = false;
            });
        });
        setLayers(allLayers);
    };

    return (
        <div
            className="map-layers-container"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="map-layers-toggle" title="Map Layers">
                <span className="layers-text">LAYERS</span>
                <span className="layers-arrow">{isHovered ? '▼' : '▶'}</span>
            </div>

            {isHovered && (
                <div className="map-layers-panel">
                        <div className="panel-header">
                            <span className="header-bracket">[</span>
                            <span className="header-title">MAP LAYERS</span>
                            <span className="header-bracket">]</span>
                        </div>

                        <div className="panel-content">
                            {layerGroups.map(group => (
                                <div key={group.name} className="layer-group">
                                    <div className="group-header">{group.name}</div>
                                    {group.layers.map(layer => (
                                        <label key={layer.id} className="layer-toggle">
                                            <input
                                                type="checkbox"
                                                checked={layers[layer.id] || false}
                                                onChange={() => toggleLayer(layer.id)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span className="layer-icon">{layer.icon}</span>
                                            <span className="layer-label">{layer.label}</span>
                                        </label>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="panel-actions">
                            <button onClick={handleSelectAll} className="action-btn">
                                Select All
                            </button>
                            <button onClick={handleClearAll} className="action-btn">
                                Clear All
                            </button>
                        </div>
                    </div>
            )}
        </div>
    );
}

export default MapLayersPanel;
