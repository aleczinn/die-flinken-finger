import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary';

type BaseProps = {
	variant?: Variant
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
	const isIconOnly = !children && (!!iconLeft || !!iconRight);

	return (
		<button type="button"
						style={{ '--focus-radius': '0.9rem' } as React.CSSProperties}
						className={cn(
							'flex flex-row justify-center items-center gap-2',
							'text-sm font-normal px-6 py-2.5 rounded-md',
							'hover:cursor-pointer',
							'transition-colors duration-200',
							'disabled:cursor-not-allowed',
							'focus-visible-facelift',
							fullWidth && 'w-full',
							variantClasses[variant] ?? variantClasses.primary,
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