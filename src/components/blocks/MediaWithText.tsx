import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText, SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { StoryblokMedia } from '@/components/storyblok/StoryblokMedia';
import StoryblokRichText from '@/components/storyblok/StoryblokRichText';

type Layout = 'media_left' | 'media_right';

interface MediaWithTextProps {
	blok: SbBlokData & {
		layout: Layout;
		media: any;
		tagline?: string;
		headline: string;
		text: any;
		button_text?: string;
		button_link?: any;
	};
	priority?: boolean;
}

export default function MediaWithText({ blok, priority = false }: MediaWithTextProps) {
	const headingId = `mwt-${blok._uid}`;
	const isMediaLeft = blok.layout === 'media_left';
	const href = blok.button_link?.cached_url || blok.button_link?.url;

	return (
		<Section variant="capped"
				 outerClassName="py-section"
				 innerClassName="grid grid-cols-1 md:grid-cols-2 gap-8"
				 aria-labelledby={blok.headline ? headingId : undefined}
				 {...storyblokEditable(blok)}
		>
			<div className={`flex flex-col justify-center ${isMediaLeft ? 'order-1' : 'order-2'}`}>
				<StoryblokMedia asset={blok.media}
												width={720}
												priority={priority}
												sizes="(min-width: 768px) 712px, calc(100vw - 32px)"
												className="rounded-2xl"
				/>
			</div>

			<div className={`flex flex-col justify-center ${isMediaLeft ? 'order-2' : 'order-1'}`}>
				{blok.tagline && (
					<span className="font-display text-gray-80 mb-1">{blok.tagline}</span>
				)}

				{blok.headline && (
					<Headline id={headingId} as="h2" variant="h3" className="mb-4">
						{blok.headline}
					</Headline>
				)}

				{blok.text && (
					<StoryblokRichText content={blok.text} />
				)}

				{blok.button_text && (
					<Button variant="primary" href={href} className="mt-8">
						{blok.button_text}
					</Button>
				)}
			</div>
		</Section>
	);
};
