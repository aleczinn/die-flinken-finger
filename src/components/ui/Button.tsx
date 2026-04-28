import React from 'react';
import { cn } from '@/lib/utils';
import Link from "next/link";

type Variant = 'primary' | 'secondary';

type BaseProps = {
	variant?: Variant;
	fullWidth?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	hollow?: boolean;
	disabled?: boolean;
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
	'w-fit px-6 py-3.5 rounded-lg font-semibold',
	'hover:cursor-pointer',
	'transition-colors duration-200',
	'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
	'disabled:pointer-events-none aria-disabled:pointer-events-none',
	'disabled:pointer-events-none aria-disabled:pointer-events-none',
	'focus-element',
].join(' ');

const variantClasses: Record<Variant, string> = {
	primary: cn(
		'bg-primary text-white shadow-[var(--shadow-cta)]',
		'hover:bg-primary-darker',
		'active:bg-primary-darkest',
		'disabled:bg-gray-20 disabled:text-gray-40',
		'aria-disabled:bg-gray-20 aria-disabled:text-gray-40'
	),

	secondary: cn(
		'bg-white text-gray-80',
		'hover:bg-gray-20',
		'active:bg-gray-30',
		'disabled:bg-gray-30 disabled:text-gray-40',
		'aria-disabled:bg-gray-30 aria-disabled:text-gray-40'
	)
}

const variantClassesHollow: Record<Variant, string> = {
	primary: cn(
		'bg-transparent border-1 border-solid border-primary text-primary',
		'hover:border-primary-darker hover:text-primary-darker',
		'active:border-primary-darkest active:text-primary-darkest',
		'disabled:border-gray-20 disabled:text-gray-40',
		'aria-disabled:border-gray-20 aria-disabled:text-gray-40'
	),
	secondary: cn(
		'bg-transparent border-1 border-solid border-white text-white',
		'hover:bg-white/10',
		'active:bg-white/30',
		'disabled:opacity-40',
		'aria-disabled:opacity-40'
	)
}

export function Button({
						   variant = 'primary',
						   fullWidth = false,
						   hollow = false,
						   iconLeft,
						   iconRight,
						   children,
						   className,
						   disabled,
						   ...props
					   }: ButtonProps) {
	const classes = cn(
		baseClasses,
		fullWidth && 'w-full',
		hollow ? variantClassesHollow[variant] : variantClasses[variant],
		className,
	);

	const content = (
		<>
			{iconLeft && <span className="flex shrink-0" aria-hidden="true">{iconLeft}</span>}
			{children && <span className="whitespace-nowrap">{children}</span>}
			{iconRight && <span className="flex shrink-0" aria-hidden="true">{iconRight}</span>}
		</>
	);

	const style = {
		'--focus-radius': '0.9rem',
	} as React.CSSProperties;

	if ('href' in props) {
		if (!props.href) {
			return null;
		}

		const { href, target, ...rest } = props as AsLink;
		const isExternal = href.startsWith('http');

		return (
			<Link href={href}
				  target={target ?? (isExternal ? '_blank' : undefined)}
				  rel={isExternal ? 'noopener noreferrer' : undefined}
				  aria-disabled={disabled || undefined}
				  tabIndex={disabled ? -1 : undefined}
				  style={style}
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
				style={style}
				disabled={disabled}
				className={classes}
				{...rest}
		>
			{content}
		</button>
	);
}