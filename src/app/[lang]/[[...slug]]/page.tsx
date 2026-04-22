import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getConfig, getStory } from '@/lib/storyblok-queries';
import { BASE_URL } from '@/lib/site';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import {
	availableLanguages,
	DEFAULT_LOCALE,
	getAlternateOgLocales,
	getLocaleFromLang,
	getOgLocale,
	Locale, locales, toLocaleTag,
} from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import { getSlugMap, PageEntry, translatePath } from '@/lib/locale/slug-map';
import { Headline } from "@/components/ui/Headline";

interface PageProps {
	params: Promise<{
		lang: string;
		slug?: string[]
	}>;
}

/** Resolved einen übersetzten URL-Pfad zur PageEntry oder null. */
export async function resolveEntry(segments: string[] | undefined, lang: string): Promise<PageEntry | null> {
	const translatedPath = (segments ?? []).join('/');
	const map = await getSlugMap();
	const key = translatedPath || 'home';
	const realSlug = map.byTranslated[lang]?.get(key) ?? (key === 'home' ? 'home' : null);
	return realSlug ? map.byReal.get(realSlug) ?? null : null;
}

function get404Object(locale: Locale): Metadata {
	return {
		title: t(locale, '404.title'),
		robots: { index: false, follow: false },
	};
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang, slug } = await params;
	const locale = getLocaleFromLang(lang) ?? DEFAULT_LOCALE;

	const [entry, config] = await Promise.all([
		resolveEntry(slug, locale.language),
		getConfig(locale),
	]);

	if (!entry) {
		return get404Object(locale);
	}

	const result = await getStory(locale, entry.realSlug);
	if (!result?.data?.story) {
		return get404Object(locale);
	}

	const story = result.data.story;
	const content = story.content;
	const isHomepage = entry.realSlug === 'home';

	const map = await getSlugMap();
	const pathFor = (lang: string) => isHomepage ? '' : translatePath(map.byReal, entry.realSlug, lang);

	const canonical = content.seo_canonical || `${BASE_URL}/${locale.language}/${pathFor(locale.language)}`.replace(/\/+$/, '');

	// hreflang URLs für alle Locales + x-default
	const languages: Record<string, string> = {
		'x-default': `${BASE_URL}/${DEFAULT_LOCALE.language}/${pathFor(DEFAULT_LOCALE.language)}`.replace(/\/+$/, ''),
		...Object.fromEntries(
			locales.map((locale) => [
				toLocaleTag(locale), // 'de-DE', 'en-US'
				`${BASE_URL}/${locale.language}/${pathFor(locale.language)}`.replace(/\/+$/, ''),
			]),
		),
	};

	const resolvedTitle = content.seo_title || content.title || story.name;
	const title = isHomepage ? config.site_name : `${resolvedTitle} – ${config.site_name}`;
	const description = content.seo_description || config.site_description;
	const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;

	const isPageLegal = content.component === 'page_legal';
	const robotsNoIndex = { index: false, follow: false };

	return {
		title: title,
		description,
		alternates: {
			canonical,
			languages,
		},
		robots: isPageLegal ? robotsNoIndex : {
			index: !content.seo_no_index,
			follow: !content.seo_no_index,
		},
		openGraph: {
			locale: getOgLocale(locale),
			alternateLocale: getAlternateOgLocales(locale),
			title: resolvedTitle,
			siteName: config.site_name,
			description: description,
			url: canonical,
			type: content.seo_og_type || 'website',
			images: [{ url: ogImage, width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title: resolvedTitle,
			description: description,
			images: [ogImage],
		},
	};
}

export async function generateStaticParams() {
	const map = await getSlugMap();
	const params: { lang: string; slug: string[] }[] = [];

	for (const lang of availableLanguages) {
		for (const translated of map.byTranslated[lang].keys()) {
			const parts = translated === 'home' ? [] : translated.split('/');
			params.push({ lang, slug: parts });
		}
	}
	return params;
}

export default async function Page({ params }: PageProps) {
	const { lang, slug } = await params;
	const locale = getLocaleFromLang(lang);

	if (!locale) {
		return notFound();
	}

	const entry = await resolveEntry(slug, locale.language);
	if (!entry) {
		return notFound();
	}

	const result = await getStory(locale, entry.realSlug);
	if (!result?.data?.story) {
		return notFound();
	}

	const isHomepage = entry.realSlug === 'home';
	const config = await getConfig(locale);
	const story = result.data.story;
	const content = story.content;

	// Hero rendert eigene h1 — keine zusätzliche nötig
	const firstBlockIsHero = content.content?.[0]?.component === 'hero';

	// H1-Inhalt bestimmen, wenn kein Hero vorhanden ist
	let pageHeadline: string | null = null;
	if (!firstBlockIsHero) {
		pageHeadline = isHomepage ? config.site_description || config.site_name : content.title || story.name;
	}

	// Homepage: keine Breadcrumbs. Sonst vorrendern (inkl. Schema) und durchreichen.
	const breadcrumbs = isHomepage ? null : <Breadcrumbs locale={locale} entry={entry} includeSchema />;

	return (
		<main id="main-content" className="grow flex flex-col bg-gray-10 min-h-[50svh]">
			<StoryblokStory locale={locale}
							story={result.data.story}
							breadcrumbs={breadcrumbs}
							isHomepage={isHomepage}
							pageHeadline={pageHeadline}
			/>
		</main>
	)
}
