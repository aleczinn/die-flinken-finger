import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Mode = 'light' | 'dark';
type VariantKey = `${Variant}_${Mode}`;

type BaseProps = {
	variant?: Variant
	mode?: Mode
	fullWidth?: boolean
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

type WithChildren = BaseProps & {
	children: React.ReactNode
	iconLeft?: React.ReactNode
	iconRight?: React.ReactNode
	'aria-label'?: string
}

type IconOnly = BaseProps & {
	children?: never
	iconLeft?: React.ReactNode
	iconRight?: React.ReactNode
	'aria-label': string
}

type ButtonProps = WithChildren | IconOnly

const variantClasses: Record<VariantKey, string> = {
	primary_light:   'bg-gray-10 text-gray-90 hover:bg-gray-30 active:bg-gray-40 disabled:bg-[#2B2B2B]',
	secondary_light: 'bg-[#222222] text-gray-10 hover:bg-[#2B2B2B] active:bg-[#353535] disabled:bg-[#222222] disabled:text-[#646464]',
	ghost_light:     'bg-transparent text-gray-10 hover:bg-[#2B2B2B] active:bg-[#353535] disabled:bg-transparent disabled:text-[#646464]',

	primary_dark:    'bg-gray-90 text-white hover:bg-gray-80 active:bg-gray-70 disabled:bg-gray-30',
	secondary_dark:  'bg-gray-20 text-gray-90 hover:bg-gray-30 active:bg-gray-40 disabled:bg-gray-20 disabled:text-gray-40',
	ghost_dark:      'bg-transparent text-gray-90 hover:bg-gray-30 active:bg-gray-40 disabled:bg-transparent disabled:text-gray-40',
}

export function Button({
												 variant = 'primary',
												 mode = 'dark',
												 fullWidth = false,
												 iconLeft,
												 iconRight,
												 children,
												 className,
												 ...props
											 }: ButtonProps) {
	const isIconOnly = !children && (!!iconLeft || !!iconRight);
	const key = `${variant}_${mode}` as VariantKey;

	return (
		<button type="button"
						style={{ '--focus-radius': '0.9rem' } as React.CSSProperties}
						className={cn(
							'flex flex-row justify-center items-center gap-2',
							isIconOnly ? 'min-w-10 min-h-10 w-fit p-2' : 'w-fit min-h-10 px-6 py-2',
							'text-base font-bold rounded-lg',
							'hover:cursor-pointer',
							'transition-colors duration-300 motion-reduce:transition-none',
							'disabled:cursor-not-allowed',
							'focus-visible-facelift',
							fullWidth && 'w-full',
							variantClasses[key] ?? variantClasses.primary_light,
							className,
						)}
						{...props}
		>
			{iconLeft && <span className="flex shrink-0" aria-hidden="true">{iconLeft}</span>}
			{children && <span className="whitespace-nowrap">{children}</span>}
			{iconRight && <span className="flex shrink-0" aria-hidden="true">{iconRight}</span>}
		</button>
	);
}