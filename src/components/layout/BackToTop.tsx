'use client';

import { Locale } from "@/lib/locale/locales";
import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { css } from "@/lib/utils";
import { IconChevronUp } from "@/components/icons";

interface BackToTopProps {
    locale: Locale;
    /** Sichtbar ab dieser Scroll-Position in Pixel (Default: 600) */
    threshold?: number;
}

export default function BackToTop({ locale, threshold = 600 }: BackToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // rAF-Throttling: Scroll feuert ~60–120x/sec, State-Update aber nur,
        // wenn sich der sichtbare Zustand wirklich ändert
        let ticking = false;

        const update = () => {
            setIsVisible(window.scrollY > threshold);
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        update(); // initial check, falls Seite mit Scroll-Position geladen wird
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [threshold]);

    const handleClick = () => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: reduceMotion ? 'instant' : 'smooth',
        });

        // Tastatur-Fokus auf <main> verschieben, damit Tab-Navigation
        // nach dem Scroll-zum-Anfang oben weitergeht statt im Footer
        const main = document.getElementById('main');
        if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus({ preventScroll: true });
        }
    };

    const label = t(locale, 'back_to_top');

    return (
        <button type="button"
                onClick={handleClick}
                aria-label={label}
                title={label}
                tabIndex={isVisible ? 0 : -1}
                aria-hidden={!isVisible}
                className={css(
                    'fixed right-4 lg:right-8 z-popup',
                    // Safe-Area auf iOS berücksichtigen, sonst klebt der Button
                    // unter dem Home-Indicator. max() sichert ein Mindest-Offset.
                    'bottom-[max(1rem,calc(1rem+env(safe-area-inset-bottom)))]',
                    'lg:bottom-[max(2rem,calc(2rem+env(safe-area-inset-bottom)))]',
                    'bottom-10',
                    'flex items-center justify-center',
                    'w-12 h-12 rounded-full',
                    'bg-primary text-gray-10 shadow-cta',
                    'motion-safe:transition-all motion-safe:duration-300',
                    'hover:bg-primary-darker hover:cursor-pointer',
                    'active:bg-primary-darkest',
                    'focus-element',
                    isVisible
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none',
                )}
        >
            <IconChevronUp className="w-6 h-6 mb-0.5" />
        </button>
    )
}