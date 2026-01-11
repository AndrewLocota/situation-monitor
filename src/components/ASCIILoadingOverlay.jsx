import { useEffect, useRef } from 'react';
import './ASCIILoadingOverlay.css';

/**
 * ASCII Loading Screen Overlay
 *
 * Displays an animated ASCII art filter over the map during loading/syncing.
 * Uses a canvas-based ASCII conversion that samples the underlying map content.
 */

const ASCII_CHARS = ' .:-=+*#%@';  // Characters from light to dark
const CHAR_SIZE = 8;  // Size of each ASCII character in pixels

export function ASCIILoadingOverlay({ isActive, children }) {
    const canvasRef = useRef(null);
    const contentRef = useRef(null);
    const animationFrameRef = useRef(null);
    const phaseRef = useRef(0);

    useEffect(() => {
        if (!isActive || !canvasRef.current || !contentRef.current) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const content = contentRef.current;

        // Set canvas size to match container
        const updateSize = () => {
            const rect = content.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        // ASCII rendering function
        const renderASCII = () => {
            if (!isActive) return;

            const width = canvas.width;
            const height = canvas.height;

            // Clear canvas
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(0, 0, width, height);

            // Calculate grid dimensions
            const cols = Math.floor(width / CHAR_SIZE);
            const rows = Math.floor(height / CHAR_SIZE);

            // Set font for ASCII characters
            ctx.font = `${CHAR_SIZE}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Create animated pattern
            phaseRef.current += 0.02;
            const phase = phaseRef.current;

            // Render ASCII grid with animated pattern
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    // Calculate position
                    const px = x * CHAR_SIZE;
                    const py = y * CHAR_SIZE;

                    // Create wave pattern for brightness
                    const centerX = cols / 2;
                    const centerY = rows / 2;
                    const dx = x - centerX;
                    const dy = y - centerY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Multiple wave patterns
                    const wave1 = Math.sin(distance * 0.2 + phase * 2) * 0.5 + 0.5;
                    const wave2 = Math.sin(x * 0.1 + phase * 3) * 0.5 + 0.5;
                    const wave3 = Math.cos(y * 0.1 + phase * 2.5) * 0.5 + 0.5;

                    // Combine waves
                    const brightness = (wave1 * 0.4 + wave2 * 0.3 + wave3 * 0.3);

                    // Select ASCII character based on brightness
                    const charIndex = Math.floor(brightness * (ASCII_CHARS.length - 1));
                    const char = ASCII_CHARS[charIndex];

                    // Color with blue tint (Palantir theme)
                    const blue = Math.floor(brightness * 255);
                    const green = Math.floor(brightness * 180);
                    ctx.fillStyle = `rgb(${blue * 0.3}, ${green}, ${blue})`;

                    // Draw character
                    ctx.fillText(char, px + CHAR_SIZE / 2, py + CHAR_SIZE / 2);
                }
            }

            // Draw "SYNCING DATA..." text overlay
            ctx.save();
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Pulsing effect for text
            const textPulse = Math.sin(phase * 4) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(77, 166, 255, ${textPulse})`;
            ctx.strokeStyle = 'rgba(10, 10, 15, 0.8)';
            ctx.lineWidth = 3;

            const text = 'SYNCING DATA...';
            ctx.strokeText(text, width / 2, height / 2);
            ctx.fillText(text, width / 2, height / 2);

            // Smaller subtext
            ctx.font = '12px monospace';
            const subtext = 'ESTABLISHING SECURE CONNECTION';
            const subtextPulse = Math.sin(phase * 4 + 0.5) * 0.2 + 0.5;
            ctx.fillStyle = `rgba(77, 166, 255, ${subtextPulse})`;
            ctx.fillText(subtext, width / 2, height / 2 + 32);

            ctx.restore();

            // Continue animation
            animationFrameRef.current = requestAnimationFrame(renderASCII);
        };

        // Start animation
        renderASCII();

        return () => {
            window.removeEventListener('resize', updateSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive]);

    return (
        <div className="ascii-overlay-container" ref={contentRef}>
            {children}
            {isActive && (
                <canvas
                    ref={canvasRef}
                    className="ascii-overlay-canvas"
                />
            )}
        </div>
    );
}
