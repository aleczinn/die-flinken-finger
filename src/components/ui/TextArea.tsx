// src/components/ui/Textarea.tsx
'use client';

import { useId } from 'react';
import { css } from '@/lib/utils';

interface TextareaProps {
    label: string;
    labelHidden?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    description?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    rows?: number;
    maxLength?: number;
    className?: string;
    onBlur?: () => void;
}

export function Textarea({
                             label,
                             labelHidden = false,
                             value,
                             onChange,
                             placeholder,
                             description,
                             error,
                             disabled = false,
                             required = false,
                             name,
                             rows = 6,
                             maxLength,
                             className,
                             onBlur
                         }: TextareaProps) {
    const baseId = useId();
    const fieldId = `${baseId}-field`;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;
    const counterId = `${baseId}-counter`;

    const charsLeft = maxLength ? maxLength - value.length : null;
    const nearLimit = charsLeft !== null && charsLeft <= 20;

    return (
        <div className={css('flex flex-col gap-1 w-full', className)}>
            <label htmlFor={fieldId} className={css(
                'text-sm text-gray-90 mb-2',
                labelHidden && 'sr-only',
            )}>
                {label}
                {required && <span aria-hidden="true" className="text-primary"> *</span>}
            </label>

            {description && (
                <span id={descriptionId} className="text-xs text-gray-80">
                    {description}
                </span>
            )}

            <textarea id={fieldId}
                      name={name}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onBlur={onBlur}
                      placeholder={placeholder}
                      disabled={disabled}
                      required={required}
                      rows={rows}
                      maxLength={maxLength}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={[
                          description && descriptionId,
                          error && errorId,
                          maxLength && counterId,
                      ].filter(Boolean).join(' ') || undefined}
                      className={css(
                          'w-full px-3 py-2 rounded-md border-1 bg-white resize-none',
                          'transition-colors',
                          'focus:border-primary focus-visible:shadow-form',
                          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-10',
                          error ? 'border-error' : 'border-gray-30 hover:border-gray-80',
                      )}
            />

            <div className="flex items-start justify-between gap-2 min-h-4">
                {error ? (
                    <span id={errorId} role="alert" className="text-xs text-error">
                        {error}
                    </span>
                ) : <span />}

                {maxLength && (
                    <span id={counterId}
                          aria-live="polite"
                          className={css(
                              'text-xs tabular-nums shrink-0',
                              nearLimit ? 'text-primary' : 'text-gray-80',
                          )}
                    >
                        {value.length} / {maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}