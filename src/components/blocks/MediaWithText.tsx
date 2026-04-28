import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section, { SectionBackground } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { StoryblokMedia } from '@/components/storyblok/StoryblokMedia';
import StoryblokRichTextRenderer from '@/components/storyblok/StoryblokRichTextRenderer';
import { resolveStoryblokLink } from "@/lib/locale/links";
import { Locale } from "@/lib/locale/locales";
import { useId } from "react";
import { Tagline } from "@/components/ui/Tagline";

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
	const headingId = useId();
	const isMediaLeft = blok.layout === 'media_left';
	const href = await resolveStoryblokLink(blok.button_link, locale.language);

	const media = (
		<div className={`flex flex-col justify-center`}>
			<StoryblokMedia asset={blok.media}
							width={720}
							priority={priority}
							sizes="(min-width: 768px) 712px, calc(100vw - 32px)"
							className="rounded-2xl"
			/>
		</div>
	);

	const content = (
		<div className={`flex flex-col justify-center`}>
			{blok.tagline && (
				<Tagline alignment="left" children={blok.tagline} className="mb-2" />
			)}

			{blok.headline && (
				<Headline id={headingId} as="h2" variant="h3" alignment="left" design="line" className="mb-8">
					{blok.headline}
				</Headline>
			)}

			{blok.text && (
				<StoryblokRichTextRenderer content={blok.text} className="text-gray-70 leading-relaxed" />
			)}

			{(blok.button_text && href) && (
				<Button variant="primary" href={href} className="mt-8">
					{blok.button_text}
				</Button>
			)}
		</div>
	);

	return (
		<Section variant="capped"
				 background={background}
				 outerClassName="py-section"
				 innerClassName="grid grid-cols-1 lg:grid-cols-2 gap-8"
				 aria-labelledby={blok.headline ? headingId : undefined}
				 {...storyblokEditable(blok)}
		>
			{isMediaLeft ? (
				<>
					{media}
					{content}
				</>
			) : (
				<>
					{content}
					{media}
				</>
			)}
		</Section>
	);
};
