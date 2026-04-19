import { ElementType, ComponentPropsWithoutRef } from 'react';

type Variant = 'capped' | 'full' | 'none';

type SectionProps<T extends ElementType> = {
	as?: T;
	variant?: Variant;
	/** Klassen für den äußeren Wrapper (nur bei variant="capped"). Nutze für Full-Width-Styles wie Background-Color. */
	outerClassName?: string;
	/** Klassen für den gecappten Inner-Container (nur bei variant="capped"). */
	innerClassName?: string;
} & ComponentPropsWithoutRef<T>;

const innerClasses = 'max-w-bt mx-auto w-full px-4 sm:px-6 md:px-8';

const variantClasses: Record<Exclude<Variant, 'capped'>, string> = {
	full: 'w-full px-4 md:px-8',
	none: '',
};

export default function Section<T extends ElementType = 'section'>({
																	   as,
																	   variant = 'capped',
																	   className,
																	   outerClassName,
																	   innerClassName,
																	   children,
																	   ...props
																   }: SectionProps<T>) {
	const requested = as ?? 'section';
	const hasLabel = 'aria-labelledby' in props || 'aria-label' in props;

	// Stumme <section> vermeiden: ohne Label auf div zurückfallen
	const Component: ElementType = requested === 'section' && !hasLabel ? 'div' : requested;

	if (variant === 'capped') {
		return (
			<Component className={`w-full ${className ?? ''} ${outerClassName ?? ''}`.trim()}
					   {...props}
			>
				<div className={`${innerClasses} ${innerClassName ?? ''}`.trim()}>
					{children}
				</div>
			</Component>
		);
	}

	return (
		<Component className={`${variantClasses[variant]} ${className || ''}`.trim()}
				   {...props}
		>
			{children}
		</Component>
	);
}