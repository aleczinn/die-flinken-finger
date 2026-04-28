'use client';

import { useId, useRef, useState } from 'react';
import type { StoryblokAsset } from '@/components/storyblok/types';
import { StoryblokImage } from '@/components/storyblok/StoryblokImage';

interface BeforeAfterImageProps {
    before: StoryblokAsset;
    after: StoryblokAsset;
    beforeLabel?: string;
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
                                     sizes = '(min-width: 1024px) 712px, calc(100vw - 2rem)',
                                     priority,
                                     className,
                                 }: BeforeAfterImageProps) {
    const [position, setPosition] = useState(50);
    const [isFocused, setIsFocused] = useState(false);
    const inputId = useId();
    const pct = Math.round(position);
    const isPointerFocus = useRef(false);

    return (
        /*
         * Kein overflow-hidden hier!
         * Der Handle darf an den Rändern visuell überstehen –
         * das ist der Kern des Mobile-Fixes: der Nutzer sieht und
         * erreicht den Handle auch bei Position 0 % / 100 %.
         */
        <div className={`relative select-none touch-none ${className ?? ''}`}>

            {/* ── Bild-Wrapper: overflow-hidden + Rounding nur hier ─────────── */}
            <div className="relative rounded-2xl overflow-hidden">

                {/* Before-Image – Normal Flow → gibt Container-Höhe vor */}
                <StoryblokImage asset={before}
                                width={width}
                                sizes={sizes}
                                priority={priority}
                />

                {/* After-Image – absolut, von links geclipt
                    inset(top right bottom left):
                    left = position% → alles links davon abschneiden
                    → After-Bild ist auf der rechten Seite des Sliders sichtbar */}
                <div className="absolute inset-0"
                     style={{ clipPath: `inset(0 0 0 ${position}%)` }}
                     aria-hidden="true"
                >
                    <StoryblokImage asset={after}
                                    width={width}
                                    sizes={sizes}
                                    priority={priority}
                                    background
                    />
                </div>

                {/* Badges */}
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none"
                      aria-hidden="true"
                >
                    {beforeLabel}
                </span>
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none"
                      aria-hidden="true"
                >
                    {afterLabel}
                </span>
            </div>

            {/* ── Divider-Linie + Handle ────────────────────────────────────────
                Sibling des Bild-Wrappers → kein overflow-hidden → übersteht an Rändern.
                inset-y-0 bezieht sich auf den äußeren Container,
                der dieselbe Höhe hat wie der Bild-Wrapper. */}
            <div
                className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                aria-hidden="true"
            >
                {/* Handle-Kreis – w-12/h-12 für bessere Greifbarkeit auf Mobile */}
                <div className="
                    absolute top-1/2 left-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-12 h-12 rounded-full
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
                        <path d="M6.5 4L2 9l4.5 5" stroke="#606369" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M11.5 4L16 9l-4.5 5" stroke="#606369" strokeWidth="2" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            {/* ── Focus-Ring ────────────────────────────────────────────────────
                Eigener Overlay statt :focus-visible auf dem opacity-0 Input –
                Browser zeigen den nativen Fokus-Ring unsichtbarer Elemente nicht.
                Wir tracken den State via onFocus/onBlur und zeichnen den Ring
                manuell, konsistent mit dem bestehenden focus-element-Stil
                (gepunktet, --color-focus, Offset über CSS-Variablen). */}
            {isFocused && (
                <div
                    className="absolute rounded-2xl pointer-events-none z-10"
                    style={{
                        inset: 'var(--focus-y-offset, -0.5rem)',
                        border: '0.3rem dotted var(--color-focus)',
                    }}
                    aria-hidden="true"
                />
            )}

            {/* ── Barrierefreies Range-Input ────────────────────────────────────
                Deckt den gesamten Bild-Bereich ab. Keyboard (Pfeiltasten,
                Home, End), Touch und Maus funktionieren nativ über den Browser.
                onFocus/onBlur schalten den Focus-Ring oben ein und aus. */}
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
                onPointerDown={() => { isPointerFocus.current = true; }}
                onFocus={() => {
                    if (isPointerFocus.current) {
                        isPointerFocus.current = false;
                        return;
                    }
                    setIsFocused(true);
                }}
                onBlur={() => setIsFocused(false)}
                aria-valuetext={`${pct} % ${afterLabel} sichtbar`}
                className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
            />
        </div>
    );
}