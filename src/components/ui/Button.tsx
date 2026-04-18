import React from 'react';
import { cn } from '@/lib/utils';
import Link from "next/link";

type Variant = 'primary' | 'secondary';

type BaseProps = {
	variant?: Variant;
	fullWidth?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
};

type AsButton = BaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
	href?: never;
	target?: never;
	children?: React.ReactNode;
	'aria-label'?: string;
};

type AsLink = BaseProps &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
	href: string;
	target?: '_blank' | '_self';
	children?: React.ReactNode;
	'aria-label'?: string;
};

type ButtonProps = AsButton | AsLink;

const baseClasses = [
	'flex flex-row justify-center items-center gap-2',
	'font-medium px-6 py-2.5 rounded-md',
	'hover:cursor-pointer',
	'transition-colors duration-200',
	'focus-visible-facelift',
].join(' ');

const variantClasses: Record<Variant, string> = {
	primary: 'bg-primary text-gray-10 hover:bg-primary-darker active:bg-primary-darkest disabled:bg-white disabled:text-gray-20',
	secondary: 'bg-transparent border-2 border-solid border-gray-90 text-gray-10 hover:bg-[#111111] active:bg-black disabled:bg-white disabled:text-gray-20'
}

export function Button({
												 variant = 'primary',
												 fullWidth = false,
												 iconLeft,
												 iconRight,
												 children,
												 className,
												 ...props
											 }: ButtonProps) {
	const classes = cn(
		baseClasses,
		!('href' in props) && 'disabled:cursor-not-allowed',
		fullWidth && 'w-full',
		variantClasses[variant],
		className,
	);

	const content = (
		<>
			{iconLeft && <span className="flex shrink-0" aria-hidden="true">{iconLeft}</span>}
			{children && <span className="whitespace-nowrap">{children}</span>}
			{iconRight && <span className="flex shrink-0" aria-hidden="true">{iconRight}</span>}
		</>
	);

	if ('href' in props && props.href) {
		const { href, target, ...rest } = props as AsLink;
		const isExternal = href.startsWith('http');

		return (
			<Link href={href}
				  target={target ?? (isExternal ? '_blank' : undefined)}
				  rel={isExternal ? 'noopener noreferrer' : undefined}
				  style={{ '--focus-radius': '0.9rem' } as React.CSSProperties}
				  className={classes}
				  {...(rest as any)}
			>
				{content}
			</Link>
		);
	}

	const { ...rest } = props as AsButton;

	return (
		<button type="button"
				style={{ '--focus-radius': '0.9rem' } as React.CSSProperties}
				className={classes}
				{...rest}
		>
			{content}
		</button>
	);
}