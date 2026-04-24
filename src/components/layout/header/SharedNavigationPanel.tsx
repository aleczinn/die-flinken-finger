'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ResolvedNavigationItem } from '@/lib/locale/navigation';
import { IconArrowRight } from '@/components/icons';
import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';

interface SharedNavigationPanelProps {
    locale: Locale;
    panelId: string;
    activeItem: ResolvedNavigationItem | null;
    triggerRefs: Map<string, HTMLElement>;
    itemsPerColumn: number;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClose: () => void;
}

// === Layout-Konstanten ===
// Einheit: Pixel. Wenn sich das Styling ändert, müssen die Werte angepasst werden
// damit die Panel-Position bündig zum Trigger bleibt.
const SIDEBAR_WIDTH = 320;    // w-80
const COLUMN_WIDTH = 240;     // feste Spaltenbreite im Item-Grid
const GRID_PADDING_X = 48;    // px-12 auf dem <ul>
const GRID_GAP_X = 24;        // gap-x-6 im Grid
const LI_PADDING_X = 16;      // px-4 auf <li>
const ICON_WIDTH = 16;        // IconArrowRight w-4
const ICON_GAP = 12;          // gap-3 zwischen Icon und Label
const TRIGGER_TEXT_PADDING_LEFT = 8; // pl-2 am Trigger
const VIEWPORT_MARGIN = 16;   // Mindestabstand zum Viewport-Rand

/** Offset vom Panel-Left zum Text des ersten Items. */
const FIRST_ITEM_TEXT_OFFSET =
    SIDEBAR_WIDTH + GRID_PADDING_X + LI_PADDING_X + ICON_WIDTH + ICON_GAP;

function calculatePanelWidth(childrenCount: number, itemsPerColumn: number): number {
    const cols = Math.max(1, Math.ceil(childrenCount / itemsPerColumn));
    const gridContent = cols * COLUMN_WIDTH + (cols - 1) * GRID_GAP_X;
    return SIDEBAR_WIDTH + GRID_PADDING_X * 2 + gridContent;
}

export default function SharedNavigationPanel({
                                                  locale,
                                                  panelId,
                                                  activeItem,
                                                  triggerRefs,
                                                  itemsPerColumn,
                                                  onMouseEnter,
                                                  onMouseLeave,
                                                  onClose,
                                              }: SharedNavigationPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [panelLeft, setPanelLeft] = useState(0);
    const [panelWidth, setPanelWidth] = useState(0);
    const [displayItem, setDisplayItem] = useState<ResolvedNavigationItem | null>(null);
    const isOpen = activeItem !== null;

    // Inhalt aktualisieren, wenn ein neuer Trigger aktiv wird.
    // Beim Schließen behalten wir den letzten Inhalt, damit das Fade-out
    // nicht auf leerem Panel passiert.
    useEffect(() => {
        if (activeItem) {
            setDisplayItem(activeItem);
        }
    }, [activeItem]);

    const targetWidth = displayItem
        ? calculatePanelWidth(displayItem.children.length, itemsPerColumn)
        : 0;

    // Position berechnen: Erstes Item unter dem Trigger-Text.
    useLayoutEffect(() => {
        if (!activeItem) return;

        const trigger = triggerRefs.get(activeItem.uid);
        const panel = panelRef.current;
        if (!trigger || !panel) return;

        const calcPosition = () => {
            const offsetParent = panel.offsetParent as HTMLElement | null;
            if (!offsetParent) return;

            const triggerRect = trigger.getBoundingClientRect();
            const parentRect = offsetParent.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            // Trigger-Text beginnt nach pl-2.
            const triggerTextLeft = triggerRect.left + TRIGGER_TEXT_PADDING_LEFT;

            // Panel-Left so wählen, dass der erste Item-Text unter dem Trigger-Text sitzt.
            let desiredLeft = triggerTextLeft - FIRST_ITEM_TEXT_OFFSET;

            // Viewport-Clamping
            const maxLeft = viewportWidth - targetWidth - VIEWPORT_MARGIN;
            desiredLeft = Math.max(VIEWPORT_MARGIN, Math.min(desiredLeft, maxLeft));

            setPanelLeft(desiredLeft - parentRect.left);
            setPanelWidth(targetWidth);
        };

        calcPosition();
        window.addEventListener('resize', calcPosition);
        return () => window.removeEventListener('resize', calcPosition);
    }, [activeItem, targetWidth, triggerRefs]);

    // Escape schließt
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!displayItem) return null;

    const columnCount = Math.max(1, Math.ceil(displayItem.children.length / itemsPerColumn));

    return (
        <div ref={panelRef}
             id={panelId}
             role="region"
             aria-label={t(locale, 'header.submenu_for', displayItem.label)}
             inert={!isOpen}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
             style={{
                 left: `${panelLeft}px`,
                 width: `${panelWidth}px`,
             }}
             className={`
                 absolute top-full
                 transition-[left,width,opacity] duration-200 ease-out
                 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
             `}
        >
            <div className="flex flex-row bg-white shadow-2xl shadow-gray-90/25 rounded-lg overflow-hidden">
                {/* Sidebar */}
                <div className="bg-gray-90 text-white px-12 py-6 shrink-0 flex flex-col"
                     style={{ width: `${SIDEBAR_WIDTH}px` }}
                >
                    <span className="text-primary-light font-bold text-fluid-h5">
                        {displayItem.label}
                    </span>

                    {displayItem.description && (
                        <p className="mt-3 text-sm text-gray-20">
                            {displayItem.description}
                        </p>
                    )}
                </div>

                {/* Items */}
                <ul className="grid grid-flow-col gap-x-6 gap-y-1 px-12 py-6"
                    style={{
                        gridTemplateRows: `repeat(${itemsPerColumn}, auto)`,
                        gridTemplateColumns: `repeat(${columnCount}, ${COLUMN_WIDTH}px)`,
                    }}
                >
                    {displayItem.children.map((child) => {
                        if (!child.href) return null;

                        return (
                            <li key={child.uid}
                                {...child.editable}
                                className="not-last:border-b-1 w-full border-gray-20 px-4 h-fit"
                            >
                                <Link href={child.href}
                                      onClick={onClose}
                                      className="flex flex-row items-center gap-3 py-2 text-gray-90 font-medium transition-all duration-200 hover:text-primary hover:translate-x-2 focus-visible-facelift"
                                >
                                    <IconArrowRight className="w-4 h-4 rotate-45"/>
                                    <span className="whitespace-nowrap">{child.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}