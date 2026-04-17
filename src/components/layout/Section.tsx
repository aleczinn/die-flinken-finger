import { ElementType, ComponentPropsWithoutRef } from 'react';

type Variant = 'capped' | 'full' | 'none';

type SectionProps<T extends ElementType> = {
	as?: T;
	variant?: Variant;
} & ComponentPropsWithoutRef<T>;

const variantClasses: Record<Variant, string> = {
	capped: 'max-w-bt mx-auto w-full px-4 md:px-8',
	full: 'w-full px-4 md:px-8',
	none: '',
};

export default function Section<T extends ElementType = 'section'>({
																																		 as,
																																		 variant = 'capped',
																																		 className,
																																		 children,
																																		 ...props
																																	 }: SectionProps<T>) {
	const requested = as ?? 'section';
	const hasLabel = 'aria-labelledby' in props || 'aria-label' in props;

	// Stumme <section> vermeiden: ohne Label auf div zurückfallen
	const Component: ElementType = requested === 'section' && !hasLabel ? 'div' : requested;


	return (
		<Component className={`${variantClasses[variant]} ${className || ''}`.trim()} {...props}>
			{children}
		</Component>
	);
}