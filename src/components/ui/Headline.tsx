import { ComponentPropsWithoutRef, ElementType } from 'react';
import { cn } from '@/lib/utils';

type HeadlineTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type HeadlineDesign = 'default' | 'line';

type HeadlineProps<T extends HeadlineTag = 'h2'> = {
	as?: T;
	variant?: HeadlineTag;
	design?: HeadlineDesign;
} & ComponentPropsWithoutRef<T>;

const variantClasses: Record<HeadlineTag, string> = {
	h1: 'font-display text-5xl text-gray-90',
	h2: 'font-display text-4xl text-gray-90',
	h3: 'font-display text-3xl text-gray-90',
	h4: 'font-display text-2xl text-gray-90',
	h5: 'font-display text-xl text-gray-90',
	h6: 'font-display text-lg text-gray-90',
	p: 'font-display text-base text-gray-90',
	span: 'font-display text-sm text-gray-90',
};

const designClasses: Record<HeadlineDesign, string> = {
	default: '',
	line: 'pt-1 border-t-2 border-solid border-gray-90',
};

export function Headline<T extends HeadlineTag = 'h2'>({
																												 as,
																												 variant,
																												 design = 'default',
																												 className,
																												 children,
																												 ...props
																											 }: HeadlineProps<T>) {
	const Tag = (as ?? 'h2') as ElementType;

	return (
		<Tag className={cn(
			'w-fit text-gray-90',
			variantClasses[variant ?? as ?? 'h2'],
			designClasses[design],
			className,
		)}
				 {...props}
		>
			{children}
		</Tag>
	);
}