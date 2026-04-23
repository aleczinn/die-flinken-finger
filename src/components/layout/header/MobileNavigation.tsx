'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ResolvedNavigationItem } from '@/lib/locale/navigation';
import { IconMenuOff, IconMenuOn } from '@/components/icons';
import { Locale } from "@/lib/locale/locales";
import { t } from "@/lib/i18n";

interface MobileMenuProps {
    locale: Locale;
    items: ResolvedNavigationItem[];
    localeSwitcher?: React.ReactNode;
}

export default function MobileNavigation({ locale, items, localeSwitcher }: MobileMenuProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const labels = {
        mainNav: t(locale, 'header.main_navigation'),
        open: t(locale, 'header.open_menu'),
        close: t(locale, 'header.close_menu'),
    };

    const open = () => {
        dialogRef.current?.showModal();
        setIsOpen(true);
    };

    const close = () => {
        dialogRef.current?.close();
    };

    // Dialog kann durch Escape oder form-submit geschlossen werden — State synchron halten
    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;

        const onClose = () => {
            setIsOpen(false);
            triggerRef.current?.focus();
        };

        el.addEventListener('close', onClose);
        return () => el.removeEventListener('close', onClose);
    }, []);

    // Backdrop-Click schließt (natives <dialog> schließt nicht automatisch bei Klick außerhalb)
    const onDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
        if (event.target === dialogRef.current) {
            close();
        }
    };

    return (
        <>
            <button ref={triggerRef}
                    type="button"
                    onClick={open}
                    aria-expanded={isOpen}
                    aria-label={labels.open}
                    className="lg:hidden flex items-center p-2 text-gray-90 hover:text-primary focus-visible-facelift hover:cursor-pointer"
            >
                <IconMenuOff />
            </button>

            <dialog ref={dialogRef}
                    aria-label={labels.mainNav}
                    onClick={onDialogClick}
                    className="m-0 ml-auto h-[100dvh] max-h-none w-[min(90vw,22rem)] max-w-none bg-white shadow-2xl backdrop:bg-black/60 p-0 open:translate-x-0 translate-x-full transition-transform duration-200 ease-out"
            >
                <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end p-4 border-b border-gray-20">
                        <button type="button"
                                onClick={close}
                                aria-label={labels.close}
                                className="flex items-center p-2 text-gray-90 hover:text-primary focus-visible-facelift hover:cursor-pointer"
                        >
                            <IconMenuOn />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto">
                        <ul className="flex flex-col">
                            {items.map((item) => (
                                <MobileMenuItem key={item.uid}
                                                item={item}
                                                onNavigate={close}
                                />
                            ))}
                        </ul>
                    </nav>

                    {localeSwitcher && (
                        <div className="p-4 border-t border-gray-20">
                            {localeSwitcher}
                        </div>
                    )}
                </div>
            </dialog>
        </>
    );
}

function MobileMenuItem({ item, onNavigate }: {
    item: ResolvedNavigationItem;
    onNavigate: () => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = item.children.length > 0;

    if (!hasChildren) {
        if (!item.href) return null;

        return (
            <li {...item.editable}>
                <Link href={item.href}
                      onClick={onNavigate}
                      className="block px-6 py-4 text-gray-90 font-medium border-b border-gray-20 hover:text-primary focus-visible-facelift"
                >
                    {item.label}
                </Link>
            </li>
        );
    }

    const panelId = `mobile-panel-${item.uid}`;

    return (
        <li className="border-b border-gray-20" {...item.editable}>
            <button type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-6 py-4 text-gray-90 font-medium hover:text-primary focus-visible-facelift hover:cursor-pointer"
            >
                <span>{item.label}</span>
                <svg width="20" height="20" viewBox="0 0 24 24"
                     aria-hidden="true"
                     className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <ul id={panelId}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
                <li className="overflow-hidden min-h-0">
                    <ul className="bg-gray-10">
                        {item.children.map((child) => {
                            if (!child.href) return null;

                            return (
                                <li key={child.uid} {...child.editable}>
                                    <Link href={child.href}
                                          onClick={onNavigate}
                                          className="block px-8 py-3 text-gray-90 hover:text-primary focus-visible-facelift"
                                    >
                                        {child.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </li>
            </ul>
        </li>
    );
}