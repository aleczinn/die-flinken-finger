import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText, SbBlokData } from '@storyblok/react';
import Section, { SectionBackground } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { StoryblokMedia } from '@/components/storyblok/StoryblokMedia';
import StoryblokRichTextRenderer from '@/components/storyblok/StoryblokRichTextRenderer';
import { resolveStoryblokLink } from "@/lib/locale/links";
import { Locale } from "@/lib/locale/locales";

type MediaWithTextLayout = 'media_left' | 'media_right';

interface MediaWithTextProps {
	blok: SbBlokData & {
		layout: MediaWithTextLayout;
		media: any;
		tagline?: string;
		headline: string;
		text: any;
		button_text?: string;
		button_link?: any;
	};
	priority?: boolean;
	locale: Locale;
	background?: SectionBackground;
}

export default async function MediaWithText({ blok, priority = false, locale, background }: MediaWithTextProps) {
	const headingId = `mwt-${blok._uid}`;
	const isMediaLeft = blok.layout === 'media_left';
	const href = await resolveStoryblokLink(blok.button_link, locale.language);

	return (
		<Section variant="capped"
				 background={background}
				 outerClassName="py-section"
				 innerClassName="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
					<Headline id={headingId} as="h2" variant="h3" design="line-left" className="mb-8">
						{blok.headline}
					</Headline>
				)}

				{blok.text && (
					<StoryblokRichTextRenderer content={blok.text} />
				)}

				{(blok.button_text && href) && (
					<Button variant="primary" href={href} className="mt-8">
						{blok.button_text}
					</Button>
				)}
			</div>
		</Section>
	);
};
