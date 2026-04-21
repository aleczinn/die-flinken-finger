import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import { Fragment, ReactNode } from "react";
import { Locale } from "@/lib/locale/locales";
import Section from "@/components/layout/Section";
import { Headline } from "@/components/ui/Headline";

interface PageProps {
	locale: Locale;
	blok: SbBlokData & {
		content: SbBlokData[];
	};
	breadcrumbs?: ReactNode;
	isHomepage: boolean;
	pageHeadline: string;
}

// Nur in den ersten N Blocks nach einem LCP-Kandidaten suchen.
// 1 = ausschließlich Block 0. 2 = auch Block 1 (falls Hero fehlt, aber früh ein Bild kommt).
// Alles darüber ist unterhalb des Folds und verschwendet den priority hint.
const LCP_SEARCH_LIMIT = 2;
const COMPONENTS_WITH_LCP_IMAGE = new Set(['hero', 'media_with_text']);

export default function Page({ locale, blok, breadcrumbs, pageHeadline, isHomepage = false }: PageProps) {
	let lcpAssigned = false;
	const firstBlokComponent = blok.content?.[0]?.component;
	const breadcrumbsAfterHero = firstBlokComponent === 'hero';

	return (
		<div className="flex flex-col" {...storyblokEditable(blok)}>
			{/* Default: Breadcrumbs vor allen Blocks. Entfällt bei Hero oder Homepage. */}
			{breadcrumbs && !breadcrumbsAfterHero && breadcrumbs}

			{pageHeadline && (
				isHomepage ? (
					<h1 className="sr-only">{pageHeadline}</h1>
				) : (
					<Section variant="capped" outerClassName="">
						<Headline as="h1" variant="h2" design="line">
							{pageHeadline}
						</Headline>
					</Section>
				)
			)}

			{blok.content?.map((nestedBlok, index) => {
				const isLcpCandidate =
					!lcpAssigned &&
					index < LCP_SEARCH_LIMIT &&
					COMPONENTS_WITH_LCP_IMAGE.has(nestedBlok.component ?? '');

				if (isLcpCandidate) {
					lcpAssigned = true;
				}

				return (
					<Fragment key={nestedBlok._uid}>
						<div className={index % 2 !== 0 ? 'bg-white' : 'bg-transparent'}>
							<StoryblokServerComponent locale={locale} blok={nestedBlok} priority={isLcpCandidate} />
						</div>

						{/* Nach Hero → Breadcrumbs einschieben */}
						{index === 0 && breadcrumbs && breadcrumbsAfterHero && breadcrumbs}
					</Fragment>
				);
			})}
		</div>
	);
};

