'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ResolvedNavigationItem } from '@/lib/locale/navigation';
import { IconArrowRight, IconChevronDown, IconChevronRight, IconChevronUp } from '@/components/icons';
import { t } from "@/lib/i18n";
import { Locale } from "@/lib/locale/locales";

interface HeaderNavigationProps {
    locale: Locale;
    items: ResolvedNavigationItem[];
}

export default function DesktopNavigation({ locale, items }: HeaderNavigationProps) {
    const label = t(locale, 'header.navigation');

    return (
        <nav id="main-navigation" className="hidden lg:block" aria-label={label}>
            <ul className="flex flex-row items-center gap-2">
                {items.map((item) => (
                    <HeaderNavigationItem key={item.uid} locale={locale} item={item} />
                ))}
            </ul>
        </nav>
    );
}

function HeaderNavigationItem({ locale, item }: { locale: Locale, item: ResolvedNavigationItem }) {
    const hasChildren = item.children.length > 0;
    const hasHref = Boolean(item.href);

    // Fall 1: Nur Link, keine Kinder -> einfacher Link
    if (hasHref && !hasChildren) {
        return (
            <li {...item.editable}>
                <Link href={item.href!}
                      className="block font-semibold px-2 py-2 text-gray-90 transition-colors duration-150 hover:text-primary focus-visible-facelift"
                >
                    {item.label}
                </Link>
            </li>
        );
    }

    // Fall 2 & 3: Hat Kinder -> Dropdown (mit oder ohne eigenen Link)
    if (hasChildren) {
        return <HeaderNavigationDropdown locale={locale} item={item} />;
    }

    // Fall 4: Weder Link noch Kinder -> redaktioneller Unfug, nicht rendern
    return null;
}

function HeaderNavigationDropdown({ locale, item }: { locale: Locale, item: ResolvedNavigationItem }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLLIElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef<number | null>(null);
    const hasHref = Boolean(item.href);

    const open = () => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setIsOpen(true);
    };

    // Leichtes Close-Delay, damit der Dropdown nicht flackert, wenn die Maus
    // kurz zwischen Trigger und Panel durchrutscht
    const close = () => {
        if (closeTimer.current !== null) {
            window.clearTimeout(closeTimer.current);
        }
        closeTimer.current = window.setTimeout(() => setIsOpen(false), 120);
    };

    // Escape schließt, Fokus zurück zum Trigger
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        };

        const onFocusOut = (event: FocusEvent) => {
            if (!containerRef.current?.contains(event.relatedTarget as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', onKey);
        containerRef.current?.addEventListener('focusout', onFocusOut);

        return () => {
            document.removeEventListener('keydown', onKey);
            containerRef.current?.removeEventListener('focusout', onFocusOut);
        };
    }, [isOpen]);

    const panelId = useId();
    const labelTrigger = hasHref ? t(locale, 'header.open_submenu_for', item.label) : item.label;
    const labelPanel = t(locale, 'header.submenu_for', item.label);

    return (
        <li ref={containerRef}
            onMouseEnter={open}
            onMouseLeave={close}
            className="static flex flex-row items-center group/trigger"
            {...item.editable}
        >
            {hasHref ? (
                // Fall 2: Label ist Link, separater Toggle-Button daneben
                <>
                    <Link href={item.href!}
                          className={`block font-semibold pl-2 py-2 transition-colors duration-150 focus-visible-facelift ${
                              isOpen ? 'text-primary' : 'text-gray-90 group-hover/trigger:text-primary'
                          }`}
                    >
                        {item.label}
                    </Link>

                    <button ref={buttonRef}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            aria-label={labelTrigger}
                            onClick={() => setIsOpen((prev) => !prev)}
                            className={`flex items-center pl-1 pr-2 py-2 transition-colors duration-150 focus-visible-facelift hover:cursor-pointer ${
                                isOpen ? 'text-primary' : 'text-gray-90 group-hover/trigger:text-primary'
                            }`}
                    >
                        <IconChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </>
            ) : (
                // Fall 3: Kein Link, komplett Button
                <button ref={buttonRef}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setIsOpen((prev) => !prev)}
                        className={`flex items-center gap-1 px-2 py-2 font-semibold transition-colors duration-150 focus-visible-facelift hover:cursor-pointer ${
                            isOpen ? 'text-primary' : 'text-gray-90 hover:text-primary'
                        }`}
                >
                    <span>{item.label}</span>
                    <IconChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            )}

            {/* Panel - absolut positioniert relativ zum Header (nicht zur <li>) */}
            <div id={panelId}
                 inert={!isOpen}
                 onMouseEnter={open}
                 onMouseLeave={close}
                 aria-label={labelPanel}
                 className={`
                     absolute top-full left-0 right-0 mt-0
                     flex justify-center
                     transition-opacity duration-200 ease-in-out
                     ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                 `}
            >
                <div className="flex flex-row bg-white shadow-2xl shadow-gray-90/25 rounded-lg overflow-hidden mx-4">
                    {/* Linke Sidebar */}
                    <div className="bg-gray-90 text-white p-12 py-6 w-full flex flex-col">
                        <span className="text-primary-light font-bold text-fluid-h5">
                            {item.label}
                        </span>

                        {item.description && (
                            <p className="mt-3 text-sm text-gray-20 max-w-[30ch]">
                                {item.description}
                            </p>
                        )}
                    </div>

                    {/* Items - 4 pro Spalte, Flow nach unten dann rechts */}
                    <ul className="grid grid-rows-[repeat(4,auto)] grid-flow-col auto-cols-max gap-x-6 gap-y-1 p-6">
                        {item.children.map((child) => {
                            if (!child.href) return null;

                            return (
                                <li key={child.uid} {...child.editable} className="border-b-1 border-gray-20 px-4 h-fit">
                                    <Link href={child.href}
                                          onClick={() => setIsOpen(false)}
                                          className="flex flex-row items-center gap-3 py-2 text-gray-90 font-medium transition-all duration-200 hover:text-primary hover:translate-x-2 focus-visible-facelift"
                                    >
                                        <IconArrowRight className="w-4 h-4 rotate-45" />
                                        <span className="whitespace-nowrap">{child.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </li>
    );
}