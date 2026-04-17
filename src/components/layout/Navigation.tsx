import Link from 'next/link';
import { IconMenuOff, IconSearch } from '@/components/icons';
import { availableLanguages, Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Section from '@/components/layout/Section';
import { getGlobalConfig, NavigationItem } from '@/lib/storyblok-queries';
import { getSlugMap, getTitle, translatePath } from '@/lib/locale/slug-map';
import { buildLocalizedHref } from '@/lib/locale/links';

interface NavigationProps {
	locale: Locale;
}

async function resolveNavItem(item: NavigationItem, lang: string) {
	let slug = item.link.cached_url
		.replace(/^\//, '')
		.replace(/\/$/, '');

	// Storyblok-Sprachpräfix entfernen: "en/abgeordnete" → "abgeordnete"
	for (const language of availableLanguages) {
		if (slug.startsWith(`${language}/`)) {
			slug = slug.slice(language.length + 1);
			break;
		}
	}

	const map = await getSlugMap();
	const entry = map.byReal.get(slug || 'home');

	return {
		_uid: item._uid,
		label: item.label || (entry ? getTitle(entry, lang) : slug) || 'no-label-found',
		href: await buildLocalizedHref(slug, lang)
	}
}

export default async function Navigation({ locale }: NavigationProps) {
	const titleSearch = t(locale, 'generic.search');
	const titleMenu = t(locale, 'generic.menu');

	const config = await getGlobalConfig(locale);
	const navItems = config.navigation ?? [];

	// Hrefs parallel auflösen
	const items = await Promise.all(
		navItems.map((item) => resolveNavItem(item, locale.language))
	);

	return (
		<Section id="main-navigation" as="nav" variant="full" className="h-16 bg-gray-20" aria-label={t(locale, 'header.navigation.flyout')}>
			<ul className="flex flex-row gap-6 justify-end items-center h-full lg:justify-between lg:gap-0">
				{/* Desktop-Navigation */}
				{items.map((item) => (
					<li key={item._uid} className="hidden lg:flex flex-row items-center gap-6 h-full">
						<Link href={item.href} className="text-gray-90 text-lg hover:cursor-pointer">
							{item.label}
						</Link>
					</li>
				))}

				<li className="flex flex-col items-center">
					<button title={titleSearch} className="text-gray-90 text-lg hover:cursor-pointer">
						<span className="sr-only">{titleSearch}</span>
						<IconSearch />
					</button>
				</li>

				<li className="flex lg:hidden flex-col items-center">
					<button title={titleMenu} className="text-gray-90 text-lg hover:cursor-pointer">
						<span className="sr-only">{titleMenu}</span>
						<IconMenuOff />
					</button>
				</li>
			</ul>
		</Section>
	);
}