import { BASE_URL } from '@/lib/site';
import { DEFAULT_LOCALE } from '@/lib/locale/locales';
import { getSlugMap, getTitle, translatePath } from '@/lib/locale/slug-map';
import { getSiteMeta } from '@/lib/site-server';

export const revalidate = 3600;

export async function GET() {
	const map = await getSlugMap();
	const siteMeta = await getSiteMeta(DEFAULT_LOCALE);

	const lines: string[] = [];
	for (const entry of map.byReal.values()) {
		if (entry.realSlug === 'home') continue;

		const path = translatePath(map.byReal, entry.realSlug, DEFAULT_LOCALE.language);
		const title = getTitle(entry, DEFAULT_LOCALE.language);
		lines.push(`- [${title}](${BASE_URL}/${DEFAULT_LOCALE.language}/${path})`);
	}

	const homeEntry = map.byReal.get('home');
	const homeTitle = homeEntry ? getTitle(homeEntry, DEFAULT_LOCALE.language) : siteMeta.name;

	const content = `# ${siteMeta.name}

> ${siteMeta.description ?? ''}

## Seiten

- [${homeTitle}](${BASE_URL}/${DEFAULT_LOCALE.language})
${lines.join('\n')}

## Weitere Ressourcen

- [Sitemap](${BASE_URL}/sitemap.xml)
`;

	return new Response(content, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}