import { useEffect, useState } from 'react';

export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1792,  // 112rem
    '4xl': 2048,  // 128rem
} as const;

export type Breakpoint = keyof typeof breakpoints;

const px = (value: number) => `${value}px`;

/**
 * SSR-safe matchMedia
 */
const safeMatchMedia = (query: string): MediaQueryList => {
    if (typeof window === 'undefined') {
        return {
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
            addListener: () => {},
            removeListener: () => {},
        } as MediaQueryList;
    }
    return window.matchMedia(query);
};

export const breakpointUp = (bp: Breakpoint) => {
    return safeMatchMedia(`(min-width: ${px(breakpoints[bp])})`);
}

export const breakpointDown = (bp: Breakpoint) => {
    return safeMatchMedia(`(max-width: ${px(breakpoints[bp] - 1)})`);
}

export const breakpointBetween = (min: Breakpoint, max: Breakpoint) => {
    return safeMatchMedia(`(min-width: ${px(breakpoints[min])}) and (max-width: ${px(breakpoints[max] - 1)})`);
}

export function useBreakpoint(bp: Breakpoint, direction: 'up' | 'down' = 'up'): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mq = direction === 'up' ? breakpointUp(bp) : breakpointDown(bp);
        setMatches(mq.matches);

        const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, [bp, direction]);

    return matches;
}
