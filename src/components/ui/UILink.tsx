import React from 'react';
import { css } from "@/lib/utils";
import { IconExternalLink } from "@/components/icons";
import Link from "next/link";

type LinkDesign = 'primary' | 'secondary';
type LinkExternal = 'auto' | 'yes' | 'no';

type LinkProps = {
    href: string;
    design?: LinkDesign;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    external?: LinkExternal;
    className?: string;
    'aria-label'?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'aria-label'>;

/** Protokolle die immer ein natives <a> brauchen, aber nie als "extern" gelten */
const SPECIAL_PROTOCOLS = /^(mailto:|tel:)/;

function detectExternal(href: string, external: LinkExternal): boolean {
    if (external === 'yes') return true;
    if (external === 'no') return false;
    // 'auto': extern wenn absolute URL, aber nie für mailto/tel
    return /^https?:/.test(href);
}

const variantClasses: Record<LinkDesign, string> = {
    primary: css(
        'text-sm text-white hover:text-primary'
    ),

    secondary: css(
        'text-sm text-primary hover:text-primary-darker'
    )
}

export function UILink({
                           href,
                           design = 'primary',
                           icon,
                           children,
                           external = 'auto',
                           className,
                           'aria-label': ariaLabel,
                           ...props
                       }: LinkProps) {
    const hasIcon = Boolean(icon);
    const isExternal = detectExternal(href, external);
    const isSpecial = SPECIAL_PROTOCOLS.test(href);
    const useNativeAnchor = /^(https?:|mailto:|tel:)/.test(href);

    // External-Icon nur wenn: kein eigenes Icon gesetzt, extern, kein mailto/tel
    const showExternalIcon = !hasIcon && isExternal && !isSpecial;

    const classes = css(
        'inline-flex flex-row items-center gap-2',
        'transition-colors duration-200',
        'hover:cursor-pointer focus-element',
        variantClasses[design],
        className,
    );

    const content = (
        <>
            {icon && (
                <span className="flex shrink-0" aria-hidden="true">
                    {icon}
                </span>
            )}
            {children && (
                <span>{children}</span>
            )}
            {showExternalIcon && (
                <IconExternalLink className="w-3 h-3 shrink-0"/>
            )}
        </>
    );


    if (useNativeAnchor) {
        return (
            <a href={href}
               className={classes}
               aria-label={ariaLabel}
               target={isExternal && !isSpecial ? '_blank' : undefined}
               rel={isExternal && !isSpecial ? 'noopener noreferrer' : undefined}
               {...props}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href}
              className={classes}
              aria-label={ariaLabel}
              {...(props as any)}
        >
            {content}
        </Link>
    );
}