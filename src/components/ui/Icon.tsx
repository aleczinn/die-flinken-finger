// src/components/ui/Icon.tsx
import { iconMap, IconName } from "@/components/icons/map";

interface IconProps {
    name: IconName | string | undefined;
    className?: string;
}

export function Icon({ name, className }: IconProps) {
    if (!name || !(name in iconMap)) return null;
    const Component = iconMap[name as IconName];
    return <Component className={className} />;
}