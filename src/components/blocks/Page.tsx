import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import { Fragment, ReactNode } from "react";
import { Locale } from "@/lib/locale/locales";
import Section from "@/components/layout/Section";
import { Headline } from "@/components/ui/Headline";
import { findLcpBlockIndex } from "@/lib/blocks";

interface PageProps {
	locale: Locale;
	blok: SbBlokData & {
		content: SbBlokData[];
	};
	breadcrumbs?: ReactNode;
	isHomepage: boolean;
	pageHeadline: string;
}

export default function Page({ locale, blok, breadcrumbs, pageHeadline, isHomepage = false }: PageProps) {
	const lcpIndex = findLcpBlockIndex(blok.content);
	const firstBlokComponent = blok.content?.[0]?.component;
	const breadcrumbsAfterHero = firstBlokComponent === 'hero';

	return (
		<div className="flex-1 flex flex-col" {...storyblokEditable(blok)}>
			{/* Default: Breadcrumbs vor allen Blocks. Entfällt bei Hero oder Homepage. */}
			{breadcrumbs && !breadcrumbsAfterHero && breadcrumbs}

			{pageHeadline && (
				isHomepage ? (
					<h1 className="sr-only">{pageHeadline}</h1>
				) : (
					<Section variant="capped" outerClassName="">
						<Headline as="h1" variant="h2" design="line-left" className="mb-8">
							{pageHeadline}
						</Headline>
					</Section>
				)
			)}

			{blok.content?.map((nestedBlok, index) => {
				const background = index % 2 === 0 ? 'transparent' : 'white';

				return (
					<Fragment key={nestedBlok._uid}>
						<StoryblokServerComponent
							locale={locale}
							blok={nestedBlok}
							priority={index === lcpIndex}
							background={background}
						/>

						{/* Nach Hero -> Breadcrumbs einschieben */}
						{index === 0 && breadcrumbs && breadcrumbsAfterHero && breadcrumbs}
					</Fragment>
				);
			})}
		</div>
	);
};

