'use client';

import { RefObject, useEffect } from 'react';

interface UseScrollLockOptions {
    /**
     * Optional: Ref auf einen Container, in dem Touch-Scrolling erlaubt bleibt.
     * Ohne diese Option wird jegliches touchmove auf der Seite blockiert.
     */
    allowScrollWithin?: RefObject<HTMLElement | null>;
}

/**
 * Sperrt das Page-Scrolling, solange `active` true ist.
 *
 * iOS-sicher: setzt nicht nur overflow:hidden auf <html>, sondern blockiert auch
 * touchmove-Events außerhalb von `allowScrollWithin` — Safari ignoriert overflow
 * sonst, sobald die Geste auf body/html startet.
 *
 * Hinweis: Designed für genau einen aktiven Lock zur Zeit. Bei verschachtelten
 * Overlays (Modal in Modal) würde der innere Lock den Wert "hidden" als Original
 * speichern und beim Schließen wiederherstellen, statt den Page-Scroll freizugeben.
 */
export function useScrollLock(active: boolean, { allowScrollWithin }: UseScrollLockOptions = {}) {
    useEffect(() => {
        if (!active) return;

        const html = document.documentElement;
        const originalOverflow = html.style.overflow;
        html.style.overflow = 'hidden';

        const preventTouchMove = (event: TouchEvent) => {
            // Touches innerhalb des erlaubten Containers durchlassen
            if (allowScrollWithin?.current?.contains(event.target as Node)) return;
            event.preventDefault();
        };

        // passive: false ist nötig, damit preventDefault() greift
        document.addEventListener('touchmove', preventTouchMove, { passive: false });

        return () => {
            html.style.overflow = originalOverflow;
            document.removeEventListener('touchmove', preventTouchMove);
        };
    }, [active, allowScrollWithin]);
}