import React, { ElementType } from 'react';
import { cn } from "@/lib/utils";

type TextTag = 'div' | 'p' | 'span';

type TextProps = {
    as?: TextTag;
    children?: React.ReactNode;
    className?: string;
};

export function Text({ as = 'p', children, className }: TextProps) {
    const Tag = as;

    return (
        <Tag className={cn(
            'text-gray-70 leading-relaxed',
            className
        )}>
            {children}
        </Tag>
    );
}