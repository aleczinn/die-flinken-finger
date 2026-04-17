import 'server-only';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';

/** Baut einen lokalisierten Link-Pfad aus einem realSlug. */
export async function buildLocalizedHref(realSlug: string, lang: string): Promise<string> {
	const map = await getSlugMap();
	const entry = map.byReal.get(realSlug);
	if (!entry) return `/${lang}`; // Fallback: Startseite, falls Slug fehlt

	const path = translatePath(map.byReal, realSlug, lang);
	return `/${lang}/${path}`;
}