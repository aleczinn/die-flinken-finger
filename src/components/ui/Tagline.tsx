import { ReactNode } from "react";

type TaglineAlignment = "left" | "center" | "right";

interface TaglineProps {
    alignment?: TaglineAlignment;
    children: ReactNode;
    className?: string;
}

export function Tagline({ alignment = 'left', children, className }: TaglineProps) {
    return (
        <span className={`block font-inter w-full text-${alignment} text-sm font-medium tracking-[0.2rem] text-primary uppercase ${className}`}>
            {children}
        </span>
    );
}