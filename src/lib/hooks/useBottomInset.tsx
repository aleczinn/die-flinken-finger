'use client';

import { useEffect } from 'react';

/**
 * Setzt eine CSS-Variable --bottom-inset auf die tatsächliche Höhe,
 * die unten durch Browser-Chrome verdeckt wird.
 *
 * Hintergrund: env(safe-area-inset-bottom) deckt auf iOS Safari nur
 * den Home-Indicator (~34px) ab — die schwebende Toolbar bleibt
 * unsichtbar für CSS. Nur die VisualViewport-API kennt den wahren
 * sichtbaren Bereich und reagiert auf Toolbar-Animationen.
 */
export function useBottomInset() {
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;

        const update = () => {
            // Layout-Viewport (innerHeight) - Visual-Viewport (vv.height)
            // - Offset oben = was unten verdeckt ist
            const bottom = Math.max(
                0,
                window.innerHeight - vv.height - vv.offsetTop,
            );
            document.documentElement.style.setProperty(
                '--bottom-inset',
                `${bottom}px`,
            );
        };

        update();
        vv.addEventListener('resize', update);
        vv.addEventListener('scroll', update);
        window.addEventListener('orientationchange', update);

        return () => {
            vv.removeEventListener('resize', update);
            vv.removeEventListener('scroll', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);
}