import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/site';
import { availableLanguages } from '@/lib/locale/locales';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const map = await getSlugMap();
	const entries: MetadataRoute.Sitemap = [];

	for (const entry of map.byReal.values()) {
		const isHome = entry.realSlug === 'home';

		for (const lang of availableLanguages) {
			const path = isHome ? '' : translatePath(map.byReal, entry.realSlug, lang);
			entries.push({
				url: `${BASE_URL}/${lang}/${path}`.replace(/\/+$/, ''),
				changeFrequency: 'weekly',
				priority: isHome ? 1 : 0.8,
				alternates: {
					languages: Object.fromEntries(
						availableLanguages.map((alt) => [
							alt,
							`${BASE_URL}/${alt}/${isHome ? '' : translatePath(map.byReal, entry.realSlug, alt)}`.replace(/\/+$/, ''),
						]),
					),
				},
			});
		}
	}
	return entries;
}