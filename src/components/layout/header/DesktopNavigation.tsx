'use client';

import { useEffect, useRef, useState } from 'react';
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
    const navLabel = t(locale, 'header.navigation');

    return (
        <nav id="main-navigation"
             className="hidden lg:block"
             aria-label={navLabel}
        >
            <ul className="flex flex-row items-center gap-2">
                {items.map((item) => (
                    <HeaderNavigationItem key={item.uid} item={item} />
                ))}
            </ul>
        </nav>
    );
}

function HeaderNavigationItem({ item }: { item: ResolvedNavigationItem }) {
    const hasChildren = item.children.length > 0;

    if (!hasChildren) {
        if (!item.href) return null;

        return (
            <li {...item.editable}>
                <Link href={item.href}
                      className="block font-semibold px-2 py-2 text-gray-90 transition-colors duration-150 hover:text-primary focus-visible-facelift"
                >
                    {item.label}
                </Link>
            </li>
        );
    }

    return <HeaderNavigationDropdown item={item} />;
}

function HeaderNavigationDropdown({ item }: { item: ResolvedNavigationItem }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLLIElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef<number | null>(null);

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

    const panelId = `nav-panel-${item.uid}`;

    return (
        <li ref={containerRef}
            onMouseEnter={open}
            onMouseLeave={close}
            className="static"
            {...item.editable}
        >
            <button ref={buttonRef}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
                    className={`flex items-center gap-1 px-2 py-2 font-semibold text-gray-90 transition-colors duration-200 hover:text-primary focus-visible-facelift hover:cursor-pointer ${
                        isOpen ? 'text-primary' : 'text-gray-90 hover:text-primary'
                    }`}
            >
                <span>{item.label}</span>
                <IconChevronDown className="w-4 h-4" />
            </button>

            {/* Panel — absolut positioniert relativ zum Header (nicht zur <li>) */}
            <div id={panelId}
                 inert={!isOpen}
                 onMouseEnter={open}
                 onMouseLeave={close}
                 className={`
                     absolute top-full left-0 right-0 mt-0
                     flex justify-center
                     transition-all duration-300 ease-in-out
                     ${isOpen
                     ? 'opacity-100 translate-y-0'
                     : 'opacity-0 -translate-y-4 pointer-events-none'
                 }
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
                                          className="flex flex-row items-center gap-3 py-2 pr-4 text-gray-90 font-medium transition-all duration-200 hover:text-primary hover:translate-x-2 focus-visible-facelift"
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