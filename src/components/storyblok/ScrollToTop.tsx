'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        if (window.location.hash) return;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        // Tastatur-Fokus auf <main> verschieben, damit Tab nach Navigation oben weitergeht
        const main = document.getElementById('main');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus({ preventScroll: true });
        }
    }, [pathname]);

    return null;
}