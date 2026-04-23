import 'server-only';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';
import { locales } from "@/lib/locale/locales";
import { StoryblokLink } from "@/lib/storyblok-queries";

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
 * Prüft, ob ein Multilink praktisch leer ist.
 * Storyblok liefert für ungesetzte Felder ein Objekt mit leeren Strings.
 */
function isEmptyLink(link: StoryblokLink): boolean {
	switch (link.linktype) {
		case 'email':
			return !link.email;
		case 'url':
		case 'asset':
			return !link.url;
		case 'story':
			return !link.cached_url && !link.url;
	}
}

/**
 * Löst ein Storyblok-Multilink-Objekt zu einem fertigen href auf.
 * - Story-Links werden in die aktuelle Sprache übersetzt.
 * - Externe URLs, Mails, Assets werden durchgereicht.
 * - Gibt null zurück, wenn kein Link gesetzt ist – Komponente entscheidet, ob sie den CTA rendert.
 */
export async function resolveStoryblokLink(
	link: StoryblokLink | undefined | null,
	lang: string,
): Promise<string | null> {
	if (!link || isEmptyLink(link)) {
		return null;
	}

	if (link.linktype === 'email') {
		return `mailto:${link.email}`;
	}

	if (link.linktype === 'url') {
		const anchor = link.anchor ? `#${link.anchor}` : '';
		return `${link.url}${anchor}`;
	}

	if (link.linktype === 'asset') {
		return link.url;
	}

	// Ab hier: linktype === 'story'
	const anchor = link.anchor ? `#${link.anchor}` : '';
	const rawSlug = normalizeCachedUrl(link.cached_url ?? '');

	if (rawSlug) {
		const map = await getSlugMap();
		const path = map.byReal.has(rawSlug)
			? translatePath(map.byReal, rawSlug, lang)
			: rawSlug;
		return `/${lang}/${path}${anchor}`;
	}

	return link.url || null;
}