import { ComponentPropsWithoutRef, ElementType } from 'react';
import { css } from '@/lib/utils';

type HeadlineTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type HeadlineAlignment = "left" | "center" | "right";
type HeadlineDesign = 'default' | 'line' | 'w-line';

type HeadlineProps<T extends HeadlineTag = 'h2'> = {
    as?: T;
    variant?: HeadlineTag;
    alignment?: HeadlineAlignment;
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

const alignmentClasses: Record<HeadlineAlignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

function computeDesign(alignment: HeadlineAlignment, design: HeadlineDesign): string {
    if (design === 'line') {
        switch (alignment) {
            case 'left':
                return `relative after:content-[''] after:block after:h-1.5 after:w-24 after:bg-linear-to-r after:from-primary after:to-transparent after:mt-4 after:rounded-2xl`;
            case 'center':
                return `relative after:content-[''] after:block after:h-1.5 after:w-48 after:bg-linear-to-r after:from-transparent after:via-primary after:to-transparent after:mt-4 after:rounded-2xl after:mx-auto`;
            case 'right':
                return `relative after:content-[''] after:block after:h-1.5 after:w-24 after:bg-linear-to-r after:from-transparent after:to-primary after:mt-4 after:rounded-2xl after:ml-auto`;
        }
    }

    if (design === 'w-line') {
        switch (alignment) {
            case 'left':
                return `relative after:content-[''] after:block after:h-1.5 after:w-24 after:bg-linear-to-r after:from-white after:to-transparent after:mt-4 after:rounded-2xl`;
            case 'center':
                return `relative after:content-[''] after:block after:h-1.5 after:w-48 after:bg-linear-to-r after:from-transparent after:via-white after:to-transparent after:mt-4 after:rounded-2xl after:mx-auto`;
            case 'right':
                return `relative after:content-[''] after:block after:h-1.5 after:w-24 after:bg-linear-to-r after:from-transparent after:to-white after:mt-4 after:rounded-2xl after:ml-auto`;
        }
    }
    return '';
}

export function Headline<T extends HeadlineTag = 'h2'>({
                                                           as,
                                                           variant,
                                                           alignment = 'left',
                                                           design = 'default',
                                                           className,
                                                           children,
                                                           ...props
                                                       }: HeadlineProps<T>) {
    const Tag = (as ?? 'h2') as ElementType;

    return (
        <Tag className={css(
            `w-full`,
            alignmentClasses[alignment],
            variantClasses[variant ?? as ?? 'h2'],
            computeDesign(alignment, design),
            className
        )}
             {...props}
        >
            {children}
        </Tag>
    );
}