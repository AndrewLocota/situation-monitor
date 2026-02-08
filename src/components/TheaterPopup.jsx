import React from 'react';
import './TheaterPopup.css';

/**
 * TheaterPopup - Modal popup that appears when clicking theater buttons
 * Styled like map marker popups with a dark theme
 *
 * For Middle East theater, shows option to focus on Iran with current events
 */
export function TheaterPopup({ theater, onClose, onSelectLocation }) {
    if (!theater) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === 'theater-popup-overlay') {
            onClose();
        }
    };

    const getTheaterContent = () => {
        switch (theater.id) {
            case 'middle_east':
                return (
                    <>
                        <div className="theater-popup-description">
                            <p>{theater.description}</p>
                        </div>
                        <div className="theater-popup-actions">
                            <button
                                className="theater-action-btn primary"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'iran',
                                        name: 'Iran',
                                        center: [35.6892, 51.3890],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: IRAN
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'israel',
                                        name: 'Israel/Gaza',
                                        center: [31.5, 34.8],
                                        zoom: 7
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: ISRAEL/GAZA
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'yemen',
                                        name: 'Yemen/Red Sea',
                                        center: [15.5, 48.0],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: YEMEN/RED SEA
                            </button>
                        </div>
                    </>
                );

            case 'europe':
                return (
                    <>
                        <div className="theater-popup-description">
                            <p>{theater.description}</p>
                        </div>
                        <div className="theater-popup-actions">
                            <button
                                className="theater-action-btn primary"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'ukraine',
                                        name: 'Ukraine',
                                        center: [48.5, 31.5],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: UKRAINE FRONTLINE
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'russia',
                                        name: 'Russia',
                                        center: [55.75, 37.6],
                                        zoom: 5
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: RUSSIA
                            </button>
                        </div>
                    </>
                );

            case 'pacific':
                return (
                    <>
                        <div className="theater-popup-description">
                            <p>{theater.description}</p>
                        </div>
                        <div className="theater-popup-actions">
                            <button
                                className="theater-action-btn primary"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'taiwan',
                                        name: 'Taiwan Strait',
                                        center: [24.0, 121.0],
                                        zoom: 7
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: TAIWAN STRAIT
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'south_china_sea',
                                        name: 'South China Sea',
                                        center: [12.0, 114.0],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: SOUTH CHINA SEA
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'korea',
                                        name: 'Korean Peninsula',
                                        center: [38.5, 127.5],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: KOREAN PENINSULA
                            </button>
                        </div>
                    </>
                );

            case 'africa':
                return (
                    <>
                        <div className="theater-popup-description">
                            <p>{theater.description}</p>
                        </div>
                        <div className="theater-popup-actions">
                            <button
                                className="theater-action-btn primary"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'sudan',
                                        name: 'Sudan',
                                        center: [15.5, 32.5],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: SUDAN CONFLICT
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'sahel',
                                        name: 'Sahel Region',
                                        center: [15.0, 0.0],
                                        zoom: 5
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: SAHEL INSTABILITY
                            </button>
                        </div>
                    </>
                );

            case 'americas':
                return (
                    <>
                        <div className="theater-popup-description">
                            <p>{theater.description}</p>
                        </div>
                        <div className="theater-popup-actions">
                            <button
                                className="theater-action-btn primary"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'venezuela',
                                        name: 'Venezuela',
                                        center: [10.5, -66.9],
                                        zoom: 6
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: VENEZUELA
                            </button>
                            <button
                                className="theater-action-btn"
                                onClick={() => {
                                    onSelectLocation({
                                        id: 'us_domestic',
                                        name: 'United States',
                                        center: [38.9, -77.0],
                                        zoom: 5
                                    });
                                    onClose();
                                }}
                            >
                                <span className="action-icon">📍</span>
                                FOCUS: US DOMESTIC
                            </button>
                        </div>
                    </>
                );

            default:
                return (
                    <div className="theater-popup-description">
                        <p>{theater.description}</p>
                    </div>
                );
        }
    };

    return (
        <div className="theater-popup-overlay" onClick={handleOverlayClick}>
            <div className="theater-popup-container">
                <div className="theater-popup-header">
                    <div className="theater-popup-title">
                        <span className="theater-bracket">[</span>
                        <span className="theater-name">{theater.name.toUpperCase()}</span>
                        <span className="theater-bracket">]</span>
                    </div>
                    <button className="theater-popup-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="theater-popup-content">
                    {getTheaterContent()}
                </div>

                <div className="theater-popup-footer">
                    <button className="theater-footer-btn" onClick={onClose}>
                        VIEW ENTIRE THEATER
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TheaterPopup;
