'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { IconGlobe } from '@/components/icons';
import { availableLanguages, locales, Locale } from '@/lib/locale/locales';

interface AlternateMap {
	/** translatedPath (ohne führenden Slash, "" für Home) -> realSlug */
	byTranslated: Record<string, Record<string, string>>;
	/** realSlug -> { lang -> translatedPath } */
	pathsByReal: Record<string, Record<string, string>>;
}

interface LocaleSwitcherProps {
	locale: Locale;
	alternates: AlternateMap;
}

const uniqueLanguages = availableLanguages.map(
	(lang) => locales.find((l) => l.language === lang)!,
);

export default function LocaleSwitcher({ locale, alternates }: LocaleSwitcherProps) {
	const pathname = usePathname();

	const currentIndex = uniqueLanguages.findIndex((l) => l.language === locale.language);
	const nextLocale = uniqueLanguages[(currentIndex + 1) % uniqueLanguages.length];

	const targetHref = useMemo(() => {
		// pathname: "/de/abgeordnete/wahlkreissuche"
		const translatedPath = pathname.split('/').filter(Boolean).slice(1).join('/');
		const key = translatedPath || 'home';
		const realSlug = alternates.byTranslated[locale.language]?.[key];

		if (!realSlug) return `/${nextLocale.language}`;

		const translated = alternates.pathsByReal[realSlug]?.[nextLocale.language] ?? '';
		const isHome = realSlug === 'home';
		return isHome ? `/${nextLocale.language}` : `/${nextLocale.language}/${translated}`;
	}, [pathname, locale.language, nextLocale.language, alternates]);

	const title = `Switch language to ${nextLocale.label}`;

	return (
		<a href={targetHref}
			 title={title}
			 aria-label={title}
			 hrefLang={nextLocale.language}
			 className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
		>
			<IconGlobe />
			<span className="text-sm">{locale.language.toUpperCase()}</span>
		</a>
	);
}