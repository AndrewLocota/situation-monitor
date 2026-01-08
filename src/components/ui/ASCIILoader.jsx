import { useState, useEffect } from 'react';

/**
 * ASCII Loading Animation Component
 * Creates a retro terminal-style loading effect
 */

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const BAR_CHARS = ['░', '▒', '▓', '█'];
const DOTS = ['.  ', '.. ', '...', ' ..', '  .', '   '];

export function ASCIILoader({
    text = 'LOADING',
    variant = 'spinner', // 'spinner' | 'dots' | 'bar' | 'matrix'
    size = 'sm' // 'sm' | 'md' | 'lg'
}) {
    const [frame, setFrame] = useState(0);
    const [barProgress, setBarProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % (variant === 'dots' ? DOTS.length : SPINNER_FRAMES.length));
            if (variant === 'bar') {
                setBarProgress(p => (p + 1) % 20);
            }
        }, variant === 'bar' ? 100 : 80);
        return () => clearInterval(interval);
    }, [variant]);

    const renderBar = () => {
        const total = 10;
        const filled = Math.floor(barProgress / 2);
        let bar = '';
        for (let i = 0; i < total; i++) {
            if (i < filled) bar += BAR_CHARS[3];
            else if (i === filled) bar += BAR_CHARS[frame % 3];
            else bar += BAR_CHARS[0];
        }
        return bar;
    };

    const sizeClass = size === 'lg' ? 'ascii-loader-lg' : size === 'md' ? 'ascii-loader-md' : '';

    return (
        <div className={`ascii-loader ${sizeClass}`}>
            {variant === 'spinner' && (
                <>
                    <span className="ascii-spinner">{SPINNER_FRAMES[frame]}</span>
                    <span className="ascii-text">{text}</span>
                </>
            )}
            {variant === 'dots' && (
                <span className="ascii-text">{text}{DOTS[frame]}</span>
            )}
            {variant === 'bar' && (
                <div className="ascii-bar-container">
                    <span className="ascii-text">{text}</span>
                    <span className="ascii-bar">[{renderBar()}]</span>
                </div>
            )}
            {variant === 'matrix' && (
                <div className="ascii-matrix">
                    <span className="matrix-char" style={{ animationDelay: '0ms' }}>▓</span>
                    <span className="matrix-char" style={{ animationDelay: '100ms' }}>▒</span>
                    <span className="matrix-char" style={{ animationDelay: '200ms' }}>░</span>
                    <span className="matrix-char" style={{ animationDelay: '300ms' }}>▒</span>
                    <span className="matrix-char" style={{ animationDelay: '400ms' }}>▓</span>
                    <span className="ascii-text">{text}</span>
                </div>
            )}
        </div>
    );
}

/**
 * Simple inline loading text with animated dots
 */
export function LoadingText({ text = 'Loading' }) {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => (d + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="loading-text-animated">
            {text}{'.'.repeat(dots)}
        </span>
    );
}

export default ASCIILoader;
