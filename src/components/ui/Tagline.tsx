import { ReactNode } from "react";

type TaglineAlignment = "left" | "center" | "right";

interface TaglineProps {
    alignment?: TaglineAlignment;
    children: ReactNode;
}

export function Tagline({ alignment = 'left', children }: TaglineProps) {
    return (
        <span className={`block font-inter w-full text-${alignment} text-sm font-medium tracking-[0.2rem] text-primary uppercase mb-1`}>
            {children}
        </span>
    );
}