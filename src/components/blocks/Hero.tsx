import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';

interface HeroProps {
	blok: SbBlokData & {
		headline: string;
		text: string;
	};
	priority?: boolean;
}

export default function Hero({ blok, priority = false }: HeroProps) {
	const headingId = `h-${blok._uid}`;

	return (
		<Section variant="none"
						 className="bg-amber-600 w-full min-h-80 flex flex-col justify-center items-center"
						 aria-labelledby={blok.headline ? headingId : undefined}
						 {...storyblokEditable(blok)}
		>
			<h1 id={headingId}>{blok.headline}</h1>
			<p>{blok.text}</p>
		</Section>
	);
};
