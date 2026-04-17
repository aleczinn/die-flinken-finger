import { StoryblokStory } from '@storyblok/react/rsc';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getStory } from '@/lib/storyblok-queries';
import { BASE_URL } from '@/lib/site';
import { getSiteMeta } from '@/lib/site-server';
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

	const [entry, siteMeta] = await Promise.all([
		resolveEntry(slug, locale.language),
		getSiteMeta(locale),
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
	const description = content.seo_description || siteMeta.description;
	const ogImage = content.seo_og_image?.filename || `${BASE_URL}/og-default.jpg`;

	return {
		title: isHomepage ? siteMeta.name : `${browserTitle} – ${siteMeta.name}`,
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
			siteName: siteMeta.name,
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

	const breadcrumbs = await buildBreadcrumbs(locale, entry);
	const isHomepage = entry.realSlug === 'home';
	const siteMeta = await getSiteMeta(locale);

	return (
		<main id="main-content" className="flex-1 flex flex-col">
			<Breadcrumbs locale={locale} entry={entry} items={breadcrumbs} includeSchema={true} />
			<div className="flex-1">
				{isHomepage && (
					<div className="sr-only">
						<h1>{siteMeta.name}</h1>
					</div>
				)}

				<StoryblokStory story={result.data.story} />
			</div>
			<Breadcrumbs locale={locale} entry={entry} items={breadcrumbs} />
		</main>
	)
}
