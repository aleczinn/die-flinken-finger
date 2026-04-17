import 'server-only';
import { DEFAULT_LOCALE, Locale } from '@/lib/locale/locales';
import { getGlobalConfig } from '@/lib/storyblok-queries';

export async function getSiteMeta(locale: Locale = DEFAULT_LOCALE) {
	try {
		const config = await getGlobalConfig(locale);
		return {
			name: config.site_name || process.env.NEXT_PUBLIC_SITE_NAME || 'Website',
			description: config.site_description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
		};
	} catch {
		return {
			name: process.env.NEXT_PUBLIC_SITE_NAME || 'Website',
			description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
		};
	}
}