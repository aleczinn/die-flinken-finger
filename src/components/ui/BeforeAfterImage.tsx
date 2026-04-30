'use client';

import { memo, useEffect, useId, useRef, useState } from 'react';
import type { StoryblokAsset } from '@/components/storyblok/types';
import { StoryblokImage } from '@/components/storyblok/StoryblokImage';
import { cn } from "@/lib/utils";
import { Locale } from "@/lib/locale/locales";
import { t } from "@/lib/i18n";

interface BeforeAfterImageProps {
    locale: Locale;
    before: StoryblokAsset;
    after: StoryblokAsset;
    beforeLabel?: string;
    afterLabel?: string;
    /** Initial-Position 0 – 100 (Default: 50) */
    initialPosition?: number;
    /** Callback bei Positionswechsel — z.B. für Analytics */
    onChange?: (position: number) => void;

    width?: number;
    sizes?: string;
    priority?: boolean;
    className?: string;
}

/** Vorher/Nachher Badges */
function renderBadges(beforeLabel: string, afterLabel: string) {
    return (
        <>
            <span
                className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none"
                aria-hidden="true"
            >
                    {beforeLabel}
                </span>
            <span
                className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none"
                aria-hidden="true"
            >
                    {afterLabel}
                </span>
        </>
    )
}

/** Divider-Linie + Handle */
function renderDivider(isDragging: boolean, position: number) {
    return (
        <div className={cn(
            'absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none text-gray-70',
            !isDragging && 'motion-safe:transition-[left] motion-safe:duration-100',
        )}
             style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
             aria-hidden="true"
        >
            {/* Handle – während Drag größer + stärkerer Schatten = taktiles Feedback */}
            <div className={cn(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'rounded-full bg-white flex items-center justify-center',
                'ring-2 ring-white/30',
                'motion-safe:transition-[transform,box-shadow,width,height] motion-safe:duration-150',
                isDragging
                    ? 'w-14 h-14 shadow-2xl'
                    : 'w-12 h-12 shadow-xl',
            )}
            >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
                    <path d="M6.5 4L2 9l4.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                    <path d="M11.5 4L16 9l-4.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            </div>
        </div>
    )
}

/**
 * Memoisiertes Before-Bild — re-rendert nur, wenn sich die Asset-Props ändern.
 * Während des Drags ändert sich nur `position`, also bleibt dieses Bild stabil.
 * Spart bei 60 FPS Drag spürbar Render-Zeit.
 */
const MemoizedBeforeImage = memo(function MemoizedBeforeImage({ asset, width, sizes, priority }: {
    asset: StoryblokAsset;
    width: number;
    sizes: string;
    priority?: boolean;
}) {
    return <StoryblokImage asset={asset} width={width} sizes={sizes} priority={priority}/>;
});

const MemoizedAfterImage = memo(function MemoizedAfterImage({ asset, width, sizes, priority }: {
    asset: StoryblokAsset;
    width: number;
    sizes: string;
    priority?: boolean;
}) {
    return <StoryblokImage asset={asset} width={width} sizes={sizes} priority={priority} background/>;
});

export function BeforeAfterImage({
                                     locale,
                                     before,
                                     after,
                                     beforeLabel,
                                     afterLabel,
                                     initialPosition = 50,
                                     onChange,
                                     width = 720,
                                     sizes = '(min-width: 1024px) 712px, calc(100vw - 2rem)',
                                     priority,
                                     className,
                                 }: BeforeAfterImageProps) {
    const inputId = useId();
    const clampedInitial = Math.min(100, Math.max(0, initialPosition));
    const [position, setPosition] = useState(clampedInitial);

    const [isFocused, setIsFocused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    /**
     * Focus-visible Pattern: Tastatur-Fokus zeigt den Ring, Pointer-Fokus nicht.
     * onPointerDown setzt das Flag → onFocus prüft & resettet.
     */
    const isPointerFocus = useRef(false);

    const hasMedia = Boolean(before?.filename && after?.filename);

    /**
     * Range-Inputs schlucken intern PointerUp-Events während des Drags.
     * Globaler Listener auf window ist die zuverlässigste Variante,
     * den Drag-State korrekt zurückzusetzen.
     */
    useEffect(() => {
        if (!isDragging) return;

        const stopDragging = () => setIsDragging(false);
        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        return () => {
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        };
    }, [isDragging]);

    /**
     * Sync mit externer initialPosition — z.B. wenn Storyblok Live-Editing
     * den Wert ändert. useState ignoriert spätere Änderungen am Initial-Wert.
     */
    useEffect(() => {
        setPosition(Math.min(100, Math.max(0, initialPosition)));
    }, [initialPosition]);

    if (!hasMedia) {
        return null;
    }

    const labelBefore = beforeLabel || t(locale, 'before_after.before');
    const labelAfter = afterLabel || t(locale, 'before_after.after');
    const labelCompare = t(locale, 'before_after.compare', labelBefore, labelAfter);
    const labelValue = t(locale, 'before_after.value', position, labelAfter);

    const handleChange = (value: number) => {
        setPosition(value);
        onChange?.(value);
    };

    const handlePointerDown = () => {
        isPointerFocus.current = true;
        setIsDragging(true);
    };

    const handleFocus = () => {
        if (isPointerFocus.current) {
            isPointerFocus.current = false;
            return;
        }
        setIsFocused(true);
    };

    return (
        <div className={cn('relative select-none touch-pan-y', className)}>
            <div className="relative rounded-2xl overflow-hidden">
                {/* Before-Image — memoisiert, re-rendert nicht bei Drag */}
                <MemoizedBeforeImage asset={before}
                                     width={width}
                                     sizes={sizes}
                                     priority={priority}
                />


                {/* After-Image: absolut positioniert; von links geclipped
                    After-Bild ist auf der rechten Seite des Sliders sichtbar.
                    Transition, nur wenn nicht gezogen wird (sonst läuft der
                    Slider dem Mauszeiger hinterher) und reduce-motion respektieren. */}
                <div className={cn(
                    'absolute inset-0',
                    !isDragging && 'motion-safe:transition-[clip-path] motion-safe:duration-100',
                )}
                     style={{ clipPath: `inset(0 0 0 ${position}%)` }}
                     aria-hidden="true"
                >
                    <MemoizedAfterImage asset={after}
                                        width={width}
                                        sizes={sizes}
                                        priority={priority}
                    />

                </div>

                {renderBadges(labelBefore, labelAfter)}
            </div>

            {renderDivider(isDragging, position)}

            {/* Focus-Ring (nur bei Tastatur-Navigation) */}
            {isFocused && (
                <div className="absolute rounded-2xl pointer-events-none z-10"
                     style={{
                         inset: 'var(--focus-y-offset, -0.5rem)',
                         border: '0.3rem dotted var(--color-focus)',
                     }}
                     aria-hidden="true"
                />
            )}

            {/* Barrierefreies Range-Input:
                Nativ: Pfeiltasten (1%-Schritte), Page Up/Down (10%), Home/End,
                Touch und Maus. aria-valuetext gibt SR den semantischen Kontext. */}
            <label htmlFor={inputId} className="sr-only">
                {labelCompare}
            </label>

            <input id={inputId}
                   type="range"
                   min={0}
                   max={100}
                   step={1}
                   value={position}
                   onChange={(e) => handleChange(Number(e.target.value))}
                   onPointerDown={handlePointerDown}
                   onFocus={handleFocus}
                   onBlur={() => setIsFocused(false)}
                   aria-valuetext={labelValue}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
            />
        </div>
    );
}