import { useCallback } from 'react';
import { useMapStore } from '../../stores';

const IRAN_REGEX = /\b(Iran(?:ian)?)\b/gi;

export function IranLink({ children }) {
    const setTheatre = useMapStore(s => s.setTheatre);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        setTheatre('iran');
    }, [setTheatre]);

    if (typeof children !== 'string') return children;
    const parts = children.split(IRAN_REGEX);
    if (parts.length === 1) return children;

    return parts.map((part, i) =>
        IRAN_REGEX.test(part) ? (
            <span
                key={i}
                className="keyword-iran"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                title="View Iran theatre"
            >
                {part}
            </span>
        ) : (
            part
        )
    );
}
