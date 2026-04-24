'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ResolvedNavigationItem } from '@/lib/locale/navigation';
import { IconChevronDown, IconMenuOff, IconMenuOn } from '@/components/icons';
import { Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';

interface MobileNavigationProps {
    locale: Locale;
    items: ResolvedNavigationItem[];
    localeSwitcher?: React.ReactNode;
}

const LG_BREAKPOINT_PX = 1024;

export default function MobileNavigation({ locale, items, localeSwitcher }: MobileNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [headerBottom, setHeaderBottom] = useState(0);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const panelId = 'mobile-navigation-panel';

    const labels = {
        mainNav: t(locale, 'header.main_navigation'),
        open: t(locale, 'header.open_menu'),
        close: t(locale, 'header.close_menu'),
    };

    const close = useCallback(() => setIsOpen(false), []);

    // Escape schließt, Fokus zurück auf Trigger
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
                triggerRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, close]);

    // Klick außerhalb schließt
    useEffect(() => {
        if (!isOpen) return;

        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
            close();
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [isOpen, close]);

    // Breakpoint-Wechsel zu lg+ schließt — Desktop-Nav übernimmt
    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${LG_BREAKPOINT_PX}px)`);
        const onChange = (e: MediaQueryListEvent) => {
            if (e.matches) setIsOpen(false);
        };
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    // Route-Wechsel schließt (inkl. Back-Button)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Scroll-Lock — iOS-sicher über html + touchmove-Prevent außerhalb des Panels
    useEffect(() => {
        if (!isOpen) return;

        const html = document.documentElement;
        const originalOverflow = html.style.overflow;
        html.style.overflow = 'hidden';

        const preventTouchMove = (event: TouchEvent) => {
            if (panelRef.current?.contains(event.target as Node)) return;
            event.preventDefault();
        };
        document.addEventListener('touchmove', preventTouchMove, { passive: false });

        return () => {
            html.style.overflow = originalOverflow;
            document.removeEventListener('touchmove', preventTouchMove);
        };
    }, [isOpen]);

// Focus-Trap: Cycle zwischen Trigger (Close) und Panel-Inhalt
    useEffect(() => {
        if (!isOpen) return;

        const panel = panelRef.current;
        const trigger = triggerRef.current;
        if (!panel || !trigger) return;

        const getFocusable = (): HTMLElement[] =>
            Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            ).filter((el) => el.offsetParent !== null);

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            const focusable = getFocusable();
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement as HTMLElement | null;
            if (!active) return;

            // Fokus ist weder im Panel noch auf Trigger → zurückholen
            if (!panel.contains(active) && active !== trigger) {
                event.preventDefault();
                first.focus();
                return;
            }

            if (event.shiftKey) {
                if (active === trigger) {
                    event.preventDefault();
                    last.focus();
                } else if (active === first) {
                    event.preventDefault();
                    trigger.focus();
                }
            } else {
                if (active === trigger) {
                    event.preventDefault();
                    first.focus();
                } else if (active === last) {
                    event.preventDefault();
                    trigger.focus();
                }
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!isOpen) return;

        const update = () => {
            const header = triggerRef.current?.closest('header');
            if (!header) return;
            const bottom = Math.max(header.getBoundingClientRect().bottom, 0);
            setHeaderBottom(bottom);
        };

        update();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, { passive: true });
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, [isOpen]);

    return (
        <>
            <button ref={triggerRef}
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={isOpen ? labels.close : labels.open}
                    className="lg:hidden flex items-center p-2 text-gray-90 transition-colors hover:text-primary focus-visible-facelift hover:cursor-pointer rounded-md"
            >
                {isOpen ? <IconMenuOn /> : <IconMenuOff />}
            </button>

            {/* Backdrop unter dem Header — Panel überdeckt ihn wo es ist */}
            <div aria-hidden="true"
                 onClick={close}
                 style={{ top: `${headerBottom}px` }}
                 className={`
         lg:hidden fixed left-0 right-0 bottom-0
         bg-black/40 backdrop-blur-sm
         transition-opacity duration-300 ease-out
         ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
     `}
            />

            {/* Full-width Panel direkt unter dem Header */}
            <div ref={panelRef}
                 id={panelId}
                 inert={!isOpen}
                 aria-label={labels.mainNav}
                 className={`
                     lg:hidden absolute top-full left-0 right-0
                     bg-white shadow-2xl shadow-gray-90/10
                     border-t border-gray-20
                     grid overflow-hidden
                     transition-[grid-template-rows,opacity] duration-300 ease-out
                     ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}
                 `}
                 style={{ maxHeight: `calc(100dvh - ${headerBottom}px)` }}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="overflow-y-auto overscroll-contain">
                        <nav aria-label={labels.mainNav}>
                            <ul className="flex flex-col">
                                {items.map((item) => (
                                    <MobileMenuItem key={item.uid} item={item} onNavigate={close} />
                                ))}
                            </ul>
                        </nav>

                        {localeSwitcher && (
                            <div className="px-4 py-4 border-t border-gray-20">
                                {localeSwitcher}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function MobileMenuItem({ item, onNavigate }: {
    item: ResolvedNavigationItem;
    onNavigate: () => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children.length > 0;
    const hasHref = Boolean(item.href);
    const submenuId = `mobile-submenu-${item.uid}`;

    // Fall 1: Reiner Link
    if (!hasChildren) {
        if (!item.href) return null;

        return (
            <li {...item.editable}>
                <Link href={item.href}
                      onClick={onNavigate}
                      className="block px-4 py-4 text-gray-90 font-semibold transition-colors hover:text-primary focus-visible-facelift"
                >
                    {item.label}
                </Link>
            </li>
        );
    }

    // Fall 2: Link + separater Toggle-Button
    if (hasHref) {
        return (
            <li className="" {...item.editable}>
                <div className="flex items-stretch">
                    <Link href={item.href!}
                          onClick={onNavigate}
                          className="flex-1 block pl-4 py-4 text-gray-90 font-semibold transition-colors hover:text-primary focus-visible-facelift"
                    >
                        {item.label}
                    </Link>

                    <button type="button"
                            aria-expanded={isExpanded}
                            aria-controls={submenuId}
                            aria-label={`Untermenü ${item.label} ${isExpanded ? 'schließen' : 'öffnen'}`}
                            onClick={() => setIsExpanded((prev) => !prev)}
                            className="flex items-center pl-12 pr-4 py-4 text-gray-90 transition-colors hover:text-primary hover:cursor-pointer focus-visible-facelift"
                    >
                        <IconChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <Submenu id={submenuId} isOpen={isExpanded} items={item.children} onNavigate={onNavigate} />
            </li>
        );
    }

    // Fall 3: Kein Link, nur Kinder → kompletter Toggle-Button
    return (
        <li className="" {...item.editable}>
            <button type="button"
                    aria-expanded={isExpanded}
                    aria-controls={submenuId}
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-4 text-gray-90 font-semibold transition-colors hover:text-primary hover:cursor-pointer focus-visible-facelift"
            >
                <span>{item.label}</span>
                <IconChevronDown className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <Submenu id={submenuId} isOpen={isExpanded} items={item.children} onNavigate={onNavigate} />
        </li>
    );
}

function Submenu({ id, isOpen, items, onNavigate }: {
    id: string;
    isOpen: boolean;
    items: ResolvedNavigationItem['children'];
    onNavigate: () => void;
}) {
    return (
        <div id={id}
             inert={!isOpen}
             className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
            <ul className="min-h-0 overflow-hidden bg-gray-10">
                {items.map((child) => {
                    if (!child.href) return null;

                    return (
                        <li key={child.uid} {...child.editable}>
                            <Link href={child.href}
                                  onClick={onNavigate}
                                  className="block pl-8 pr-4 py-3 text-sm text-gray-90 transition-colors hover:text-primary focus-visible-facelift"
                            >
                                {child.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}