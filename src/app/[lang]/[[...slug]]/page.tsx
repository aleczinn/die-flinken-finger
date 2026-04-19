import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getConfig, getStory } from '@/lib/storyblok-queries';
import { BASE_URL } from '@/lib/site';
import Breadcrumbs, { buildBreadcrumbs } from '@/components/layout/Breadcrumbs';
import {
	availableLanguages,
	DEFAULT_LOCALE,
	getAlternateOgLocales,
	getLocaleFromLang,
	getOgLocale,
	Locale,
} from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import { getSlugMap, PageEntry, translatePath } from '@/lib/locale/slug-map';

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
			availableLanguages.map((lang) => [
				lang,
				`${BASE_URL}/${lang}/${pathFor(lang)}`.replace(/\/+$/, ''),
			]),
		),
	};

	const browserTitle = content.title || story.name; // Browser-Tab: kurz, UI-orientiert
	const socialTitle = content.seo_title || content.title || story.name; // Social Sharing: ausführlich, SEO-optimiert (Fallback auf title)
	const description = content.seo_description || config.site_description;
	const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;

	return {
		title: isHomepage ? config.site_name : `${browserTitle} – ${config.site_name}`,
		description,
		alternates: {
			canonical,
			languages,
		},
		robots: {
			index: !content.seo_no_index,
			follow: !content.seo_no_index,
		},
		openGraph: {
			locale: getOgLocale(locale),
			alternateLocale: getAlternateOgLocales(locale),
			title: socialTitle,
			siteName: config.site_name,
			description: description,
			url: canonical,
			type: content.seo_og_type || 'website',
			images: [{ url: ogImage, width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title: socialTitle,
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

	return (
		<main id="main-content" className="grow flex flex-col bg-gray-10">
			<Breadcrumbs locale={locale} entry={entry} includeSchema={true} />
			<div className="flex-1 min-h-80">
				{isHomepage && (
					<div className="sr-only">
						<h1>{config.site_name}</h1>
					</div>
				)}

				<StoryblokStory story={result.data.story} />
			</div>
		</main>
	)
}
