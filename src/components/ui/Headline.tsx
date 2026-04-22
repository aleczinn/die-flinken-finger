import { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

type HeadlineTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type HeadlineDesign = 'default' | 'line-left' | 'line-right';

type HeadlineProps<T extends HeadlineTag = 'h2'> = {
    as?: T;
    variant?: HeadlineTag;
    design?: HeadlineDesign;
} & ComponentPropsWithoutRef<T>;

const variantClasses: Record<HeadlineTag, string> = {
    h1: 'font-display text-fluid-h1 font-semibold',
    h2: 'font-display text-fluid-h2 font-semibold',
    h3: 'font-display text-fluid-h3 font-semibold',
    h4: 'font-display text-fluid-h4 font-semibold',
    h5: 'font-display text-fluid-h5 font-semibold',
    h6: 'font-display text-fluid-h6 font-semibold',
    p: 'font-display text-base',
    span: 'font-display text-sm',
};

const designClasses: Record<HeadlineDesign, string> = {
    default: '',
    "line-left": 'relative after:content-[\'\'] after:block after:h-1.5 after:w-24 after:bg-linear-to-r after:from-primary after:to-transparent after:mt-4 after:rounded-2xl',
    "line-right": 'relative after:content-[\'\'] after:block after:h-1.5 after:w-24 after:bg-linear-to-r after:from-transparent after:to-primary after:mt-4 after:rounded-2xl after:ml-auto'
};

export function Headline<T extends HeadlineTag = 'h2'>({
                                                           as,
                                                           variant,
                                                           design = 'default',
                                                           className,
                                                           children,
                                                           ...props
                                                       }: HeadlineProps<T>) {
    const Tag = (as ?? 'h2') as ElementType;

    return (
        <Tag className={cn(
            'w-fit',
            variantClasses[variant ?? as ?? 'h2'],
            designClasses[design],
            className
        )}
             {...props}
        >
            {children}
        </Tag>
    );
}