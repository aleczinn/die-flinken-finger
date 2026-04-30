'use client';

import { ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { IconChevronDown } from '@/components/icons';
import { css } from '@/lib/utils';

export interface SelectOption<T extends string = string> {
    value: T;
    label: string;
    disabled?: boolean;
}

interface SelectProps<T extends string = string> {
    /** Optionen — Wert "" für leere Auswahl ist erlaubt */
    options: SelectOption<T>[];
    /** Aktuell ausgewählter Wert (controlled) */
    value: T | '';
    /** Wird aufgerufen, wenn ein Item gewählt wird */
    onChange: (value: T | '') => void;
    /** Sichtbares Label für Screenreader und Klick-Ziel */
    label: string;
    /** Wenn true: Label visuell verstecken (nur SR) */
    labelHidden?: boolean;
    /** Platzhalter, wenn nichts ausgewählt ist */
    placeholder?: string;
    /** Optional: Hilfetext */
    description?: string;
    /** Optional: Fehlermeldung — setzt aria-invalid */
    error?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    className?: string;
    /** Optional: Custom Render für Trigger-Inhalt (z.B. Icons vor Label) */
    renderTrigger?: (option: SelectOption<T> | null) => ReactNode;
}

export function Select<T extends string = string>({
                                                      options,
                                                      value,
                                                      onChange,
                                                      label,
                                                      labelHidden = false,
                                                      placeholder = 'Bitte wählen',
                                                      description,
                                                      error,
                                                      disabled = false,
                                                      required = false,
                                                      name,
                                                      className,
                                                      renderTrigger,
                                                  }: SelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [search, setSearch] = useState('');
    const searchTimeoutRef = useRef<number | null>(null);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    const baseId = useId();
    const labelId = `${baseId}-label`;
    const triggerId = `${baseId}-trigger`;
    const listboxId = `${baseId}-listbox`;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;
    const optionId = (i: number) => `${baseId}-option-${i}`;

    const selectedIndex = useMemo(
        () => options.findIndex((o) => o.value === value),
        [options, value],
    );
    const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

    const findNextEnabled = useCallback(
        (start: number, direction: 1 | -1): number => {
            const n = options.length;
            for (let step = 0; step < n; step++) {
                const i = (start + direction * (step + 1) + n) % n;
                if (!options[i].disabled) return i;
            }
            return -1;
        },
        [options],
    );

    const findFirstEnabled = useCallback((): number => {
        return options.findIndex((o) => !o.disabled);
    }, [options]);

    const findLastEnabled = useCallback((): number => {
        for (let i = options.length - 1; i >= 0; i--) {
            if (!options[i].disabled) return i;
        }
        return -1;
    }, [options]);

    const open = useCallback(() => {
        if (disabled) return;
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : findFirstEnabled());
        setIsOpen(true);
    }, [disabled, selectedIndex, findFirstEnabled]);

    const close = useCallback((focusTrigger = true) => {
        setIsOpen(false);
        setActiveIndex(-1);
        if (focusTrigger) triggerRef.current?.focus();
    }, []);

    const selectIndex = useCallback(
        (index: number) => {
            const opt = options[index];
            if (!opt || opt.disabled) return;
            onChange(opt.value);
            close();
        },
        [options, onChange, close],
    );

    // Klick außerhalb schließt
    useEffect(() => {
        if (!isOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            const target = event.target as Node;
            if (triggerRef.current?.contains(target)) return;
            if (listboxRef.current?.contains(target)) return;
            close(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [isOpen, close]);

    // Aktive Option beim Öffnen / Navigation in den View scrollen
    useEffect(() => {
        if (!isOpen || activeIndex < 0) return;
        const el = listboxRef.current?.querySelector<HTMLLIElement>(
            `#${CSS.escape(optionId(activeIndex))}`,
        );
        el?.scrollIntoView({ block: 'nearest' });
    }, [isOpen, activeIndex]);

    // Type-ahead: Tastenanschläge sammeln und passende Option suchen
    const handleTypeAhead = useCallback(
        (char: string) => {
            const next = search + char.toLowerCase();
            setSearch(next);

            if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = window.setTimeout(() => setSearch(''), 500);

            const startIndex = isOpen ? activeIndex : selectedIndex;
            const n = options.length;
            for (let step = 1; step <= n; step++) {
                const i = ((startIndex < 0 ? -1 : startIndex) + step + n) % n;
                const opt = options[i];
                if (opt.disabled) continue;
                if (opt.label.toLowerCase().startsWith(next)) {
                    if (isOpen) {
                        setActiveIndex(i);
                    } else {
                        onChange(opt.value);
                    }
                    return;
                }
            }
        },
        [search, isOpen, activeIndex, selectedIndex, options, onChange],
    );

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        const key = event.key;

        // Bei geschlossenem Listbox: nur diese Keys öffnen
        if (!isOpen) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
                event.preventDefault();
                open();
                return;
            }
            if (key === 'Home') {
                event.preventDefault();
                const first = findFirstEnabled();
                if (first >= 0) onChange(options[first].value);
                return;
            }
            if (key === 'End') {
                event.preventDefault();
                const last = findLastEnabled();
                if (last >= 0) onChange(options[last].value);
                return;
            }
            if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
                event.preventDefault();
                handleTypeAhead(key);
            }
            return;
        }

        // Bei offenem Listbox
        switch (key) {
            case 'Escape':
                event.preventDefault();
                close();
                break;
            case 'Tab':
                // Tab schließt und bestätigt aktive Option (APG-Empfehlung)
                if (activeIndex >= 0 && !options[activeIndex].disabled) {
                    onChange(options[activeIndex].value);
                }
                close(false);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (activeIndex >= 0) selectIndex(activeIndex);
                break;
            case 'ArrowDown':
                event.preventDefault();
                setActiveIndex((i) => findNextEnabled(i < 0 ? -1 : i, 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                setActiveIndex((i) => findNextEnabled(i < 0 ? options.length : i, -1));
                break;
            case 'Home':
                event.preventDefault();
                setActiveIndex(findFirstEnabled());
                break;
            case 'End':
                event.preventDefault();
                setActiveIndex(findLastEnabled());
                break;
            default:
                if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
                    event.preventDefault();
                    handleTypeAhead(key);
                }
        }
    };

    const triggerContent = renderTrigger
        ? renderTrigger(selectedOption)
        : selectedOption?.label || (
        <span className="text-gray-30">{placeholder}</span>
    );

    return (
        <div className={css('flex flex-col gap-1 w-full', className)}>
            <span id={labelId}
                  className={css(
                      'text-sm text-gray-90 mb-2',
                      labelHidden && 'sr-only',
                  )}
            >
                {label}
                {required && <span aria-hidden="true" className="text-primary"> *</span>}
            </span>

            {description && (
                <span id={descriptionId} className="text-xs text-gray-80">
                    {description}
                </span>
            )}

            <div className="relative">
                <button ref={triggerRef}
                        id={triggerId}
                        type="button"
                        role="combobox"
                        aria-haspopup="listbox"
                        aria-expanded={isOpen}
                        aria-controls={listboxId}
                        aria-labelledby={labelId}
                        aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
                        aria-required={required || undefined}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={
                            [description && descriptionId, error && errorId]
                                .filter(Boolean)
                                .join(' ') || undefined
                        }
                        disabled={disabled}
                        onClick={() => (isOpen ? close(false) : open())}
                        onKeyDown={onKeyDown}
                        className={css(
                            'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border-1 bg-white text-left',
                            'transition-colors focus-visible-facelift hover:cursor-pointer',
                            error
                                ? 'border-primary'
                                : 'border-gray-30 hover:border-gray-80',
                            disabled && 'opacity-50 cursor-not-allowed hover:cursor-not-allowed bg-gray-10',
                        )}
                >
                    <span className="truncate">{triggerContent}</span>
                    <IconChevronDown className={css(
                        'w-4 h-4 shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )} />
                </button>

                {/* Listbox — nur wenn offen, dann mit role=listbox */}
                {isOpen && (
                    <ul ref={listboxRef}
                        id={listboxId}
                        role="listbox"
                        aria-labelledby={labelId}
                        tabIndex={-1}
                        className="absolute left-0 right-0 top-full mt-1 z-50 max-h-64 overflow-y-auto bg-white border-1 border-gray-30 rounded-md shadow-lg py-1"
                    >
                        {options.map((option, index) => {
                            const isSelected = option.value === value;
                            const isActive = index === activeIndex;

                            return (
                                <li key={`${option.value}-${index}`}
                                    id={optionId(index)}
                                    role="option"
                                    aria-selected={isSelected}
                                    aria-disabled={option.disabled || undefined}
                                    onClick={() => !option.disabled && selectIndex(index)}
                                    onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                                    className={css(
                                        'px-3 py-2 text-sm select-none',
                                        option.disabled
                                            ? 'text-gray-30 cursor-not-allowed'
                                            : 'text-gray-90 hover:cursor-pointer',
                                        isActive && !option.disabled && 'bg-gray-10',
                                        isSelected && !option.disabled && 'font-semibold text-primary',
                                    )}
                                >
                                    {option.label}
                                </li>
                            );
                        })}

                        {options.length === 0 && (
                            <li role="option" aria-disabled className="px-3 py-2 text-sm text-gray-30">
                                Keine Optionen
                            </li>
                        )}
                    </ul>
                )}

                {/* Hidden input für Form-Submit */}
                {name && <input type="hidden" name={name} value={value} />}
            </div>

            {error && (
                <span id={errorId} role="alert" className="text-xs text-primary">
                    {error}
                </span>
            )}
        </div>
    );
}