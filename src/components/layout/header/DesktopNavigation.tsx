'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ResolvedNavigationItem } from '@/lib/locale/navigation';
import { IconArrowRight, IconChevronDown, IconChevronRight, IconChevronUp } from '@/components/icons';
import { t } from "@/lib/i18n";
import { Locale } from "@/lib/locale/locales";
import SharedNavigationPanel from "@/components/layout/header/SharedNavigationPanel";

interface DesktopNavigationProps  {
    locale: Locale;
    items: ResolvedNavigationItem[];
}

interface NavigationItemProps {
    locale: Locale;
    item: ResolvedNavigationItem;
    panelId: string;
    isActive: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
    registerRef: (el: HTMLLIElement | null) => void;
}

/** Max. Items pro Spalte: Bestimmt Panel-Mindesthöhe. Bei mehr Items wird in neue Spalte umgebrochen. */
const ITEMS_PER_COLUMN = 3;

/** Delay vor dem Schließen, damit Maus zwischen Trigger und Panel durchrutschen kann. */
const CLOSE_DELAY_MS = 120;

export default function DesktopNavigation({ locale, items }: DesktopNavigationProps ) {
    const label = t(locale, 'header.navigation');
    const [activeUid, setActiveUid] = useState<string | null>(null);
    const triggerRefs = useRef<Map<string, HTMLElement>>(new Map());
    const closeTimer = useRef<number | null>(null);
    const panelId = useId();

    const registerTrigger = useCallback((uid: string, el: HTMLElement | null) => {
        if (el) {
            triggerRefs.current.set(uid, el);
        } else {
            triggerRefs.current.delete(uid);
        }
    }, []);

    const cancelClose = useCallback(() => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    const openItem = useCallback((uid: string) => {
        cancelClose();
        setActiveUid(uid);
    }, [cancelClose]);

    const scheduleClose = useCallback(() => {
        cancelClose();
        closeTimer.current = window.setTimeout(() => {
            setActiveUid(null);
            closeTimer.current = null;
        }, CLOSE_DELAY_MS);
    }, [cancelClose]);

    const forceClose = useCallback(() => {
        cancelClose();
        setActiveUid(null);
    }, [cancelClose]);

    const activeItem = activeUid
        ? items.find((i) => i.uid === activeUid) ?? null
        : null;

    return (
        <nav id="main-navigation" className="hidden lg:block" aria-label={label}>
            <ul className="flex flex-row items-center gap-2">
                {items.map((item) => (
                    <NavigationItem key={item.uid}
                                    locale={locale}
                                    item={item}
                                    panelId={panelId}
                                    isActive={activeUid === item.uid}
                                    onOpen={() => item.children.length > 0 && openItem(item.uid)}
                                    onClose={scheduleClose}
                                    onToggle={() => activeUid === item.uid ? forceClose() : openItem(item.uid)}
                                    registerRef={(el) => registerTrigger(item.uid, el)}
                    />
                ))}
            </ul>

            <SharedNavigationPanel locale={locale}
                                   panelId={panelId}
                                   activeItem={activeItem}
                                   triggerRefs={triggerRefs.current}
                                   itemsPerColumn={ITEMS_PER_COLUMN}
                                   onMouseEnter={cancelClose}
                                   onMouseLeave={scheduleClose}
                                   onClose={forceClose}
            />
        </nav>
    );
}

function NavigationItem({ locale, item, panelId, isActive, onOpen, onClose, onToggle, registerRef }: NavigationItemProps) {
    const liRef = useRef<HTMLLIElement>(null);
    const hasChildren = item.children.length > 0;
    const hasHref = Boolean(item.href);

    useEffect(() => {
        registerRef(liRef.current);
        return () => registerRef(null);
    }, [registerRef]);

    // Fall 1: Nur Link, keine Kinder
    if (hasHref && !hasChildren) {
        return (
            <li ref={liRef} {...item.editable}>
                <Link href={item.href!}
                      className="block font-semibold px-2 py-2 text-gray-90 transition-colors duration-150 hover:text-primary focus-visible-facelift"
                >
                    {item.label}
                </Link>
            </li>
        );
    }

    // Weder Link noch Kinder -> redaktioneller nicht korrekt gepflegt
    if (!hasChildren) {
        return null;
    }

    const triggerLabel = hasHref
        ? t(locale, 'header.open_submenu_for', item.label)
        : item.label;

    // Fall 2 & 3: Hat Kinder → Teil des Shared-Panel-Systems
    return (
        <li ref={liRef}
            onMouseEnter={onOpen}
            onMouseLeave={onClose}
            className="flex flex-row items-center"
            {...item.editable}
        >
            {hasHref ? (
                <>
                    <Link href={item.href!}
                          className={`block font-semibold pl-2 py-2 transition-colors duration-150 focus-visible-facelift ${
                              isActive ? 'text-primary' : 'text-gray-90 hover:text-primary'
                          }`}
                    >
                        {item.label}
                    </Link>

                    <button type="button"
                            aria-expanded={isActive}
                            aria-controls={panelId}
                            aria-haspopup="true"
                            aria-label={triggerLabel}
                            onClick={onToggle}
                            className={`flex items-center pl-1 pr-2 py-2 transition-colors duration-150 focus-visible-facelift hover:cursor-pointer ${
                                isActive ? 'text-primary' : 'text-gray-90 hover:text-primary'
                            }`}
                    >
                        <IconChevronDown className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                    </button>
                </>
            ) : (
                <button type="button"
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        aria-haspopup="true"
                        onClick={onToggle}
                        className={`flex items-center gap-1 px-2 py-2 font-semibold transition-colors duration-150 focus-visible-facelift hover:cursor-pointer ${
                            isActive ? 'text-primary' : 'text-gray-90 hover:text-primary'
                        }`}
                >
                    <span>{item.label}</span>
                    <IconChevronDown className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                </button>
            )}
        </li>
    );
}