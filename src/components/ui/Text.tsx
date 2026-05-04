import React from 'react';
import { css } from "@/lib/utils";

type TextTag = 'div' | 'p' | 'span';
type TextAlignment = "left" | "center" | "right";

type TextProps = {
    as?: TextTag;
    children?: React.ReactNode;
    alignment?: TextAlignment;
    className?: string;
};

const alignmentClasses: Record<TextAlignment, string> = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
};

export function Text({ as = 'p', children, alignment = 'left', className }: TextProps) {
    const Tag = as;

    return (
        <Tag className={css(
            'w-full text-gray-70 leading-relaxed',
            alignmentClasses[alignment],
            className
        )}>
            {children}
        </Tag>
    );
}