// src/components/ui/FileUpload.tsx
'use client';

import { useId, useRef, useState, DragEvent, ChangeEvent } from 'react';
import { css } from '@/lib/utils';
import { IconPlus, IconUpload } from '@/components/icons';

interface FileUploadProps {
    label: string;
    labelHidden?: boolean;
    description?: string;
    /** z.B. ['image/*', 'application/pdf'] oder ['.pdf', '.jpg'] */
    accept?: string[];
    /** Max-Größe pro Datei in Bytes */
    maxSize?: number;
    multiple?: boolean;
    files: File[];
    onChange: (files: File[]) => void;
    error?: string;
    disabled?: boolean;
    name?: string;
    className?: string;
}

export function FileUpload({
                               label,
                               labelHidden = false,
                               description,
                               accept,
                               maxSize,
                               multiple = false,
                               files,
                               onChange,
                               error: externalError,
                               disabled = false,
                               name,
                               className,
                           }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    const baseId = useId();
    const fieldId = `${baseId}-field`;
    const descriptionId = `${baseId}-description`;
    const errorId = `${baseId}-error`;

    const error = externalError ?? internalError;
    const acceptAttr = accept?.join(',');

    const validate = (file: File): string | null => {
        if (maxSize && file.size > maxSize) {
            return `Datei "${file.name}" ist zu groß (max. ${formatBytes(maxSize)})`;
        }

        if (accept?.length) {
            const matches = accept.some((pattern) => {
                if (pattern.startsWith('.')) {
                    return file.name.toLowerCase().endsWith(pattern.toLowerCase());
                }
                if (pattern.endsWith('/*')) {
                    return file.type.startsWith(pattern.slice(0, -1));
                }
                return file.type === pattern;
            });

            if (!matches) {
                return `Dateityp von "${file.name}" wird nicht unterstützt`;
            }
        }

        return null;
    };

    const addFiles = (newFiles: File[]) => {
        setInternalError(null);

        for (const file of newFiles) {
            const err = validate(file);
            if (err) {
                setInternalError(err);
                return;
            }
        }

        onChange(multiple ? [...files, ...newFiles] : newFiles.slice(0, 1));
    };

    const removeFile = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const list = Array.from(e.target.files ?? []);
        if (list.length) addFiles(list);
        // Reset, damit dieselbe Datei nochmal gewählt werden kann
        e.target.value = '';
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const list = Array.from(e.dataTransfer.files);
        if (list.length) addFiles(list);
    };

    return (
        <div className={css('flex flex-col gap-1 w-full', className)}>
            <span id={`${baseId}-label`} className={css(
                'text-sm text-gray-90 mb-2',
                labelHidden && 'sr-only',
            )}>
                {label}
            </span>

            <div onDragOver={(e) => { e.preventDefault(); !disabled && setIsDragging(true); }}
                 onDragLeave={() => setIsDragging(false)}
                 onDrop={onDrop}
                 onClick={() => !disabled && inputRef.current?.click()}
                 onKeyDown={(e) => {
                     if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                         e.preventDefault();
                         inputRef.current?.click();
                     }
                 }}
                 role="button"
                 tabIndex={disabled ? -1 : 0}
                 aria-labelledby={`${baseId}-label`}
                 aria-describedby={[description && descriptionId, error && errorId].filter(Boolean).join(' ') || undefined}
                 aria-invalid={error ? true : undefined}
                 aria-disabled={disabled || undefined}
                 className={css(
                     'flex flex-col items-center justify-center gap-3 px-6 py-12',
                     'border-2 border-dashed rounded-md',
                     'transition-colors focus-element',
                     disabled
                         ? 'opacity-50 cursor-not-allowed bg-gray-10'
                         : 'cursor-pointer hover:bg-gray-10',
                     isDragging && 'bg-primary/10 border-primary',
                     error ? 'border-primary' : 'border-gray-30',
                 )}
            >
                <input ref={inputRef}
                       type="file"
                       name={name}
                       accept={acceptAttr}
                       multiple={multiple}
                       disabled={disabled}
                       onChange={onInputChange}
                       className="sr-only"
                       tabIndex={-1}
                />

                {/*<IconPlus className="w-6 h-6 text-gray-80" />*/}
                <IconUpload className="w-12 h-auto text-gray-80" />

                <span className="text-sm text-center text-gray-90">
                    {description ?? 'Klicken oder Datei hierher ziehen'}
                </span>
            </div>

            {files.length > 0 && (
                <ul className="flex flex-col gap-1 mt-2">
                    {files.map((file, i) => (
                        <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-10 rounded-md text-sm">
                            <span className="truncate">
                                {file.name} <span className="text-gray-80 ml-2">({formatBytes(file.size)})</span>
                            </span>
                            <button type="button"
                                    onClick={() => removeFile(i)}
                                    aria-label={`${file.name} entfernen`}
                                    className="text-gray-80 hover:text-primary focus-element shrink-0"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {error && (
                <span id={errorId} role="alert" className="text-xs text-primary mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}