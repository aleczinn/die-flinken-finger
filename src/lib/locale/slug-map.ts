import { cache } from 'react';
import { draftMode } from 'next/headers';
import { getStoryblokApi } from '@/lib/storyblok';
import {
	availableLanguages,
	DEFAULT_LOCALE,
	locales,
} from '@/lib/locale/locales';
import { getVersion } from '@/lib/storyblok-queries';

export interface PageEntry {
	realSlug: string;                    // "abgeordnete/wahlkreissuche"
	title: Record<string, string>;       // lang -> Titel
	segments: Record<string, string>;    // lang -> übersetztes Segment
}

export interface SlugMap {
	byReal: Map<string, PageEntry>;
	byTranslated: Record<string, Map<string, string>>; // lang -> translatedPath -> realSlug
}

const BLOCKED_PREFIXES = ['config'];

export const getSlugMap = cache(async (): Promise<SlugMap> => {
	const api = getStoryblokApi();
	const version = await getVersion();
	const byReal = new Map<string, PageEntry>();

	for (const locale of locales) {
		// Storyblok paginiert; bei < 100 Seiten reicht ein Call.
		const { data } = await api.get('cdn/stories', {
			version,
			language: locale.storyblokCode,
			per_page: 100,
			excluding_fields: 'body,seo_og_image', // body ist teuer, hier nicht nötig
		});

		for (const story of data.stories) {
			// Language-Präfix strippen: "en/abgeordnete/" -> "abgeordnete/"
			let realSlug: string = story.full_slug;
			const prefix = `${locale.storyblokCode}/`;
			if (locale.storyblokCode !== 'default' && realSlug.startsWith(prefix)) {
				realSlug = realSlug.slice(prefix.length);
			}

			// Trailing-Slash bei Startpages entfernen: "abgeordnete/" -> "abgeordnete"
			realSlug = realSlug.replace(/\/$/, '');

			if (!realSlug) continue; // Sprach-Root-"Seite" überspringen, falls vorhanden

			if (BLOCKED_PREFIXES.some((p) => realSlug === p || realSlug.startsWith(`${p}/`))) {
				continue;
			}

			const content = story.content ?? {};

			// Fallback-Kette:
			// 1. content.slug (übersetztes Feld)
			// 2. story.slug (Storyblok-Slug der Story selbst)
			// 3. letztes Pfad-Segment (Notnagel)
			const segment =
				(content.slug && String(content.slug).trim()) ||
				story.slug ||
				realSlug.split('/').pop()!;

			const title = content.title || story.name;

			const entry = byReal.get(realSlug) ?? ({ realSlug, title: {}, segments: {} } as PageEntry);
			entry.title[locale.language] = title;
			entry.segments[locale.language] = segment;
			byReal.set(realSlug, entry);
		}
	}

	const byTranslated: Record<string, Map<string, string>> = {};
	for (const lang of availableLanguages) {
		const map = new Map<string, string>();
		for (const entry of byReal.values()) {
			map.set(translatePath(byReal, entry.realSlug, lang), entry.realSlug);
		}
		byTranslated[lang] = map;
	}

	return { byReal, byTranslated };
});

/** Baut den übersetzten Pfad für einen realSlug in einer Sprache. */
export function translatePath(byReal: Map<string, PageEntry>, realSlug: string, lang: string): string {
	const parts = realSlug.split('/');
	return parts
		.map((part, i) => {
			const parentReal = parts.slice(0, i + 1).join('/');
			const parent = byReal.get(parentReal);
			return parent?.segments[lang] ?? part;
		})
		.join('/');
}

/** Liefert localized title mit Fallback-Kette. */
export function getTitle(entry: PageEntry, lang: string): string {
	return (
		entry.title[lang] ||
		entry.title[DEFAULT_LOCALE.language] ||
		entry.realSlug.split('/').pop()!
	);
}