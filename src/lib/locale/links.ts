import 'server-only';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';
import { locales } from "@/lib/locale/locales";

type StoryblokMultilink = {
	linktype?: 'story' | 'url' | 'email' | 'asset';
	cached_url?: string;
	url?: string;
	email?: string;
	anchor?: string;
};

/**
 * Normalisiert eine Storyblok cached_url zu einem reinen realSlug.
 *
 * Storyblok liefert das Format abhängig von der abgefragten Sprache:
 * - Default-Sprache: "kontakt"
 * - Übersetzte Sprache: "/en/kontakt"
 *
 * Dieser Helper glättet beide Varianten auf "kontakt", damit die
 * nachfolgende SlugMap-Suche deterministisch funktioniert.
 */
function normalizeCachedUrl(cachedUrl: string): string {
	const slug = cachedUrl.replace(/^\/+|\/+$/g, '');
	if (!slug) return '';

	const [first, ...rest] = slug.split('/');
	const isLangPrefix = locales.some(
		(l) => l.storyblokCode === first || l.language === first,
	);
	return isLangPrefix ? rest.join('/') : slug;
}

/** Baut einen lokalisierten Link-Pfad aus einem realSlug. */
export async function buildLocalizedHref(realSlug: string, lang: string): Promise<string> {
	const map = await getSlugMap();
	const entry = map.byReal.get(realSlug);
	if (!entry) return `/${lang}`; // Fallback: Startseite, falls Slug fehlt

	const path = translatePath(map.byReal, realSlug, lang);
	return `/${lang}/${path}`;
}

/**
 * Löst ein Storyblok-Multilink-Objekt zu einem fertigen href auf.
 * - Story-Links werden in die aktuelle Sprache übersetzt.
 * - Externe URLs, Mails, Assets werden durchgereicht.
 * - Gibt null zurück, wenn kein Link gesetzt ist – Komponente entscheidet, ob sie den CTA rendert.
 */
export async function resolveStoryblokLink(
	link: StoryblokMultilink | undefined | null,
	lang: string,
): Promise<string | null> {
	if (!link) return null;

	const anchor = link.anchor ? `#${link.anchor}` : '';

	if (link.linktype === 'email' && link.email) {
		return `mailto:${link.email}`;
	}

	if (link.linktype === 'url' && link.url) {
		return `${link.url}${anchor}`;
	}

	// Story (Default – greift auch, wenn linktype fehlt, aber cached_url gesetzt ist)
	const rawSlug = normalizeCachedUrl(link.cached_url ?? '');
	if (rawSlug) {
		const map = await getSlugMap();
		// Unbekannter Slug? Dann wie eingegeben, damit Redaktion nicht stillschweigend kaputte Links kriegt.
		const path = map.byReal.has(rawSlug)
			? translatePath(map.byReal, rawSlug, lang)
			: rawSlug;
		return `/${lang}/${path}${anchor}`;
	}
	return link.url ?? null;
}