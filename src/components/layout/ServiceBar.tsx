import Link from 'next/link';
import { IconEasy, IconSign } from '@/components/icons';
import LocaleSwitcher from '@/components/layout/LocaleSwitcher';
import { availableLanguages, Locale } from '@/lib/locale/locales';
import { t } from '@/lib/i18n';
import Section from '@/components/layout/Section';
import { getSlugMap, translatePath } from '@/lib/locale/slug-map';
import { buildLocalizedHref } from '@/lib/locale/links';

interface ServiceBarProps {
	locale: Locale;
}

export default async function ServiceBar({ locale }: ServiceBarProps) {
	const isPageGerman = locale.language === 'de';

	// Slug-Map serialisieren für Client
	const map = await getSlugMap();
	const byTranslated: Record<string, Record<string, string>> = {};
	for (const lang of availableLanguages) {
		byTranslated[lang] = Object.fromEntries(map.byTranslated[lang]);
	}
	const pathsByReal: Record<string, Record<string, string>> = {};
	for (const entry of map.byReal.values()) {
		pathsByReal[entry.realSlug] = {};
		for (const lang of availableLanguages) {
			pathsByReal[entry.realSlug][lang] = translatePath(map.byReal, entry.realSlug, lang);
		}
	}

	const titleSignLanguage = t(locale, 'header.sign_language');
	const titleSimpleLanguage = t(locale, 'header.simple_language');
	const titleBackToGerman = t(locale, 'header.back_to_german');

	const isGebaerdensprache = false;
	const isLeichteSprache = false;

	const lang = locale?.language;

	// Alle Links zentral als realSlugs definiert
	const [
		gebaerdenspracheHref,
		leichteSpracheHref,
	] = await Promise.all([
		buildLocalizedHref('gebaerdensprache', lang),
		buildLocalizedHref('leichte_sprache', lang),
	]);

	return (
		<Section as="nav" variant="full" className="h-10 bg-gray-10" aria-label="Servicenavigation">
			<ul className="h-full flex flex-row justify-end items-center gap-8">
				{(isPageGerman || isLeichteSprache) && (
					<li>
						<Link href={gebaerdenspracheHref}
									title={titleSignLanguage}
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
						>
							<IconSign />
							<span className="hidden md:block text-sm underlineAnimation">{titleSignLanguage}</span>
						</Link>
					</li>
				)}

				{(isPageGerman || isGebaerdensprache) && (
					<li>
						<Link href={leichteSpracheHref}
									title={titleSimpleLanguage}
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
						>
							<IconEasy />
							<span className="hidden md:block text-sm underlineAnimation">{titleSimpleLanguage}</span>
						</Link>
					</li>
				)}

				{(!isPageGerman || isGebaerdensprache || isLeichteSprache) && (
					<li>
						<a href="/de"
									title={titleBackToGerman}
									className="h-full flex flex-row items-center gap-1 text-gray-90 hover:cursor-pointer"
						>
							<span className="hidden md:block text-sm underlineAnimation">{titleBackToGerman}</span>
						</a>
					</li>
				)}

				<li>
					<LocaleSwitcher locale={locale} alternates={{ byTranslated, pathsByReal }} />
				</li>
			</ul>
		</Section>
	);
}