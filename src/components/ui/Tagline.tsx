import { ReactNode } from "react";
import { css } from "@/lib/utils";

type TaglineAlignment = "left" | "center" | "right";

interface TaglineProps {
    alignment?: TaglineAlignment;
    children: ReactNode;
    className?: string;
}

const alignmentClasses: Record<TaglineAlignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

export function Tagline({ alignment = 'left', children, className }: TaglineProps) {
    return (
        <span className={css(
            'block w-full text-sm font-medium tracking-[0.2rem] text-primary uppercase',
            alignmentClasses[alignment],
            className
        )}>
            {children}
        </span>
    );
}