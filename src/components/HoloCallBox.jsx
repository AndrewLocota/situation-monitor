/**
 * HoloCallBox - MGS Codec-style Character Reaction Component
 * Phase 10: AI Character Reactions
 *
 * Visual design inspired by Metal Gear Solid codec calls:
 * - Scanline overlay effect
 * - Green/blue tinted display
 * - Stop-motion portrait animation
 * - Static/glitch effects
 * - Audio codec beep on open/close
 */

import { useState, useEffect, useRef } from 'react';
import { getCharacter } from '../data/characters';
import './HoloCallBox.css';

// Codec sound effects (base64 encoded short beeps, or paths to audio files)
const CODEC_OPEN_SOUND = '/audio/codec-open.mp3';
const CODEC_CLOSE_SOUND = '/audio/codec-close.mp3';

/**
 * HoloCallBox Component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the call box is visible
 * @param {string} props.characterId - ID of the character speaking
 * @param {string} props.message - The character's response text
 * @param {boolean} props.isLoading - Whether AI is generating response
 * @param {Object} props.newsItem - The news item being reacted to
 * @param {Function} props.onClose - Callback when box is closed
 */
export function HoloCallBox({
  isOpen = false,
  characterId = 'trump',
  message = '',
  isLoading = false,
  newsItem = null,
  onClose = () => {}
}) {
  const [displayText, setDisplayText] = useState('');
  const [frameIndex, setFrameIndex] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const audioRef = useRef(null);
  const messageAreaRef = useRef(null);

  const character = getCharacter(characterId);

  // Handle open/close with animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose();
    }, 400); // Match animation duration
  };

  // Typewriter effect for message
  useEffect(() => {
    if (!message || isLoading) {
      setDisplayText('');
      return;
    }

    let index = 0;
    setDisplayText('');

    const typeInterval = setInterval(() => {
      if (index < message.length) {
        const char = message[index]; // Capture current character before incrementing
        setDisplayText(prev => prev + char);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 30); // 30ms per character

    return () => clearInterval(typeInterval);
  }, [message, isLoading]);

  // Keep the "subtitle" panel scrolled to the newest text as it types.
  useEffect(() => {
    const el = messageAreaRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [displayText, isLoading]);

  // Stop-motion portrait animation (4-5 frames, 150ms intervals)
  useEffect(() => {
    if (!isOpen || !character?.visuals?.portraitFrames?.length) return;

    const frameInterval = setInterval(() => {
      setFrameIndex(prev =>
        (prev + 1) % character.visuals.portraitFrames.length
      );
    }, 150);

    return () => clearInterval(frameInterval);
  }, [isOpen, character]);

  // Static/glitch effect on open
  useEffect(() => {
    if (isOpen) {
      setShowStatic(true);
      const timer = setTimeout(() => setShowStatic(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Play codec sounds
  useEffect(() => {
    if (audioRef.current) {
      // Could play codec sounds here
      // audioRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const primaryColor = character?.visuals?.primaryColor || '#4da6ff';
  const glowColor = character?.visuals?.glowColor || 'rgba(77, 166, 255, 0.6)';

  return (
    <div
      id="holocall-box"
      className={`holocall-box ${showStatic ? 'static-effect' : ''} ${isClosing ? 'closing' : ''}`}
      style={{
        '--character-color': primaryColor,
        '--character-glow': glowColor
      }}
    >
      {/* Scanline overlay */}
      <div className="holocall-scanlines" />

      {/* Close button */}
      <button
        className="holocall-close"
        onClick={handleClose}
        title="Close transmission"
      >
        x
      </button>

      {/* Header bar */}
      <div className="holocall-header">
        <div className="holocall-header-left">
          <span className="holocall-signal">o</span>
          <span className="holocall-label">INCOMING TRANSMISSION</span>
        </div>
        <div className="holocall-header-right">
          <span className="holocall-freq">FREQ: 140.85</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="holocall-content">
        {/* Portrait area */}
        <div className="holocall-portrait-container">
          {character?.visuals?.portraitFrames?.length > 0 ? (
            <img
              src={character.visuals.portraitFrames[frameIndex]}
              alt={character.name}
              className="holocall-portrait"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="holocall-portrait-fallback">
              <span className="holocall-fallback-text">
                NO SIGNAL
              </span>
            </div>
          )}

          {/* Portrait frame decoration */}
          <div className="holocall-portrait-frame">
            <div className="frame-corner top-left" />
            <div className="frame-corner top-right" />
            <div className="frame-corner bottom-left" />
            <div className="frame-corner bottom-right" />
          </div>
        </div>

        {/* Character info */}
        <div className="holocall-info">
          <div className="holocall-character-name">
            {character?.shortName || 'UNKNOWN'}
          </div>
          <div className="holocall-character-title">
            {character?.title || ''}
          </div>
        </div>

        {/* News context (kept above the response so the message stays at the bottom) */}
        {newsItem && (
          <div className="holocall-context">
            <span className="context-label">RE:</span>
            <span className="context-headline">
              {newsItem.title?.slice(0, 60)}
              {newsItem.title?.length > 60 ? '...' : ''}
            </span>
          </div>
        )}

        {/* Message area (anchored at bottom of the box) */}
        <div className="holocall-message-area" ref={messageAreaRef}>
          {isLoading ? (
            <div className="holocall-loading">
              <span className="loading-text">ANALYZING</span>
              <span className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          ) : (
            <p className="holocall-message">
              {displayText}
              <span className="holocall-cursor">|</span>
            </p>
          )}
        </div>
      </div>

      {/* Audio element for codec sounds */}
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}

export default HoloCallBox;
