'use client';

import { ComponentPropsWithoutRef, Ref, useId } from 'react';
import { css } from '@/lib/utils';

type InputType = 'text' | 'email' | 'tel' | 'url' | 'password' | 'search' | 'number';

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'onChange' | 'size'> {
    label: string;
    labelHidden?: boolean;
    value: string;
    onChange: (value: string) => void;
    type?: InputType;
    description?: string;
    error?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    ref?: Ref<HTMLInputElement>;
    className?: string;
}

export function Input({
                          label,
                          labelHidden = false,
                          value,
                          onChange,
                          type = 'text',
                          placeholder,
                          description,
                          error,
                          disabled = false,
                          required = false,
                          name,
                          autoComplete,
                          maxLength,
                          iconLeft,
                          iconRight,
                          ref,
                          className,
                          ...props
                      }: InputProps) {
    const fieldId = useId();
    const descriptionId = useId();
    const errorId = useId();
    const counterId = useId();

    const charsLeft = maxLength ? maxLength - value.length : null;
    const nearLimit = charsLeft !== null && charsLeft <= 20;

    return (
        <div className={css('flex flex-col gap-1 w-full', className)}>
            <label htmlFor={fieldId}
                   className={css('text-sm text-gray-90 mb-2', labelHidden && 'sr-only')}
            >
                {label}
                {required && <span aria-hidden="true" className="text-primary"> *</span>}
            </label>

            {description && (
                <span id={descriptionId} className="text-xs text-gray-80 mb-1">
                    {description}
                </span>
            )}

            <div className={css(
                'relative flex items-center rounded-md border-1 bg-white',
                'transition-colors',
                'focus-within:border-primary',
                error ? 'border-primary' : 'border-gray-30 hover:border-gray-80',
                disabled && 'opacity-50 bg-gray-10',
            )}>
                {iconLeft && (
                    <span className="absolute left-3 text-gray-70 pointer-events-none flex" aria-hidden="true">
                        {iconLeft}
                    </span>
                )}

                <input ref={ref}
                       id={fieldId}
                       type={type}
                       name={name}
                       value={value}
                       onChange={(event) => onChange(event.target.value)}
                       placeholder={placeholder}
                       disabled={disabled}
                       required={required}
                       maxLength={maxLength}
                       autoComplete={autoComplete}
                       aria-invalid={error ? true : undefined}
                       aria-describedby={[
                           description && descriptionId,
                           error && errorId,
                           maxLength && counterId,
                       ].filter(Boolean).join(' ') || undefined}
                       className={css(
                           'w-full px-3 py-2 bg-transparent rounded-md',
                           'disabled:cursor-not-allowed',
                           iconLeft && 'pl-10',
                           iconRight && 'pr-10',
                       )}
                       {...props}
                />

                {iconRight && (
                    <span className="absolute right-3 text-gray-70 pointer-events-none flex" aria-hidden="true">
                        {iconRight}
                    </span>
                )}
            </div>

            <div className="flex items-start justify-between gap-2 min-h-4">
                {error ? (
                    <span id={errorId} role="alert" className="text-xs text-primary">
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