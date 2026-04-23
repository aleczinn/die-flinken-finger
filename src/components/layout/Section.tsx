import { ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from "@/lib/utils";

type SectionVariant = 'capped' | 'full' | 'none';
export type SectionBackground = 'none' | 'primary' | 'white' | 'transparent';


type SectionProps<T extends ElementType> = {
    as?: T;
    variant?: SectionVariant;
    background?: SectionBackground;
    /** Klassen für den äußeren Wrapper (nur bei variant="capped"). Nutze für Full-Width-Styles wie Background-Color. */
    outerClassName?: string;
    /** Klassen für den gecappten Inner-Container (nur bei variant="capped"). */
    innerClassName?: string;
} & ComponentPropsWithoutRef<T>;

const innerClasses = 'max-w-bt mx-auto w-full px-4 sm:px-6 md:px-8';

const variantClasses: Record<Exclude<SectionVariant, 'capped'>, string> = {
    full: 'w-full px-4 md:px-8',
    none: '',
};

const backgroundClasses: Record<SectionBackground, string> = {
    none: '',
    primary: 'bg-primary',
    white: 'bg-white',
    transparent: 'bg-transparent',
}

export default function Section<T extends ElementType = 'section'>({
                                                                       as,
                                                                       variant = 'capped',
                                                                       background = 'none',
                                                                       className,
                                                                       outerClassName,
                                                                       innerClassName,
                                                                       children,
                                                                       ...props
                                                                   }: SectionProps<T>) {
    const requested = as ?? 'section';
    const hasLabel = 'aria-labelledby' in props || 'aria-label' in props;

    // Stumme <section> vermeiden: ohne Label auf div zurückfallen
    const Component: ElementType = requested === 'section' && !hasLabel ? 'div' : requested;

    const bgClass = backgroundClasses[background];

    if (variant === 'capped') {
        return (
            <Component className={cn(
                'w-full',
                bgClass,
                className,
                outerClassName
            )}
                       {...props}
            >
                <div className={`${innerClasses} ${innerClassName ?? ''}`.trim()}>
                    {children}
                </div>
            </Component>
        );
    }

    return (
        <Component className={`${variantClasses[variant]} ${bgClass} ${className || ''}`.trim()}
                   {...props}
        >
            {children}
        </Component>
    );
}