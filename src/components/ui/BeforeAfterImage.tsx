'use client';

import { useId, useState } from 'react';
import type { StoryblokAsset } from '@/components/storyblok/types';
import { StoryblokImage } from '@/components/storyblok/StoryblokImage';

interface BeforeAfterImageProps {
    before: StoryblokAsset;
    after: StoryblokAsset;
    /** Sichtbares Label für den Vorher-Zustand (Badges + Screenreader) */
    beforeLabel?: string;
    /** Sichtbares Label für den Nachher-Zustand (Badges + Screenreader) */
    afterLabel?: string;
    width?: number;
    sizes?: string;
    priority?: boolean;
    className?: string;
}

export function BeforeAfterImage({
                                      before,
                                      after,
                                      beforeLabel = 'Vorher',
                                      afterLabel = 'Nachher',
                                      width = 720,
                                      sizes = '(min-width: 1024px) 712px, calc(100vw - 32px)',
                                      priority,
                                      className,
                                  }: BeforeAfterImageProps) {
    const [position, setPosition] = useState(50); // 0 – 100
    const inputId = useId();
    const pct = Math.round(position);

    return (
        /*
         * touch-none: verhindert Page-Scroll während Drag auf Touch-Geräten.
         * select-none: kein Text-Selektieren beim Ziehen.
         * Der Container hat kein explizites height – die Before-Image
         * im normalen Fluss gibt die Höhe vor.
         */
        <div className={`relative rounded-2xl overflow-hidden select-none touch-none ${className ?? ''}`}>

            {/* ── Before-Image (Normal Flow → setzt Höhe des Containers) ─────── */}
            <StoryblokImage
                asset={before}
                width={width}
                sizes={sizes}
                priority={priority}
            />

            {/* ── After-Image (absolut, geclippt von rechts) ───────────────────
                clipPath inset(top right bottom left):
                  right = 100 - position → bei position=50 → 50% der rechten Seite abschneiden.
                Kein overflow-hidden nötig – clipPath schneidet sauber.
            */}
            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 0 0 ${position}%)` }}
                aria-hidden="true"
            >
                <StoryblokImage
                    asset={after}
                    width={width}
                    sizes={sizes}
                    priority={priority}
                    background
                />
            </div>

            {/* ── Divider-Linie ─────────────────────────────────────────────── */}
            <div
                className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                aria-hidden="true"
            >
                {/* Handle */}
                <div className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-10 h-10 rounded-full
                    bg-white shadow-xl
                    flex items-center justify-center
                    ring-2 ring-white/30
                ">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        aria-hidden="true"
                        focusable="false"
                    >
                        {/* Pfeil links */}
                        <path
                            d="M6.5 4L2 9l4.5 5"
                            stroke="#606369"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Pfeil rechts */}
                        <path
                            d="M11.5 4L16 9l-4.5 5"
                            stroke="#606369"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* ── Badges (visuell, aria-hidden) ────────────────────────────── */}
            <span
                className="
                    absolute bottom-3 left-3
                    bg-black/60 backdrop-blur-sm
                    text-white text-xs font-semibold
                    px-2.5 py-1 rounded-full
                    pointer-events-none
                "
                aria-hidden="true"
            >
                {beforeLabel}
            </span>
            <span
                className="
                    absolute bottom-3 right-3
                    bg-black/60 backdrop-blur-sm
                    text-white text-xs font-semibold
                    px-2.5 py-1 rounded-full
                    pointer-events-none
                "
                aria-hidden="true"
            >
                {afterLabel}
            </span>

            {/* ── Barrierefreies Range-Input ────────────────────────────────────
                Deckt die gesamte Bild-Fläche ab:
                  • Maus/Touch: Klick überall setzt Position (native Range-Verhalten)
                  • Tastatur: Pfeiltasten, Home, End (nativ vom Browser)
                  • Screen Reader: liest Label + aktuellen Wert vor
                opacity-0 macht es unsichtbar, cursor-col-resize gibt visuelles Feedback.
            */}
            <label htmlFor={inputId} className="sr-only">
                {`${beforeLabel} und ${afterLabel} vergleichen`}
            </label>
            <input
                id={inputId}
                type="range"
                min={0}
                max={100}
                step={1}
                value={pct}
                onChange={(e) => setPosition(Number(e.target.value))}
                aria-valuetext={`${pct} % ${afterLabel} sichtbar`}
                className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
            />
        </div>
    );
}