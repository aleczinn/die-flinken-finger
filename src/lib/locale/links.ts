import 'server-only';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';

type StoryblokMultilink = {
	linktype?: 'story' | 'url' | 'email' | 'asset';
	cached_url?: string;
	url?: string;
	email?: string;
	anchor?: string;
};

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
	const rawSlug = link.cached_url?.replace(/\/$/, '');
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