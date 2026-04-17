import { SITE_SHORTCUT } from '@/lib/site';

export interface Locale {
	/** ISO 639-1 Sprachcode, gleichzeitig URL-Segment (z.B. 'de', 'en') */
	language: string;
	/** ISO 3166-1 Ländercode (z.B. 'DE', 'AT', 'US') */
	country: string;
	/** Storyblok API language parameter */
	storyblokCode: string;
	/** Anzeigename */
	label: string;
}

export const locales: Locale[] = [
	{ language: 'de', country: 'DE', storyblokCode: 'default', label: 'Deutsch' },
	{ language: 'en', country: 'US', storyblokCode: 'en', label: 'English' },
];

/** Alle verfügbaren URL-Segmente (dedupliziert) */
export const availableLanguages = [...new Set(locales.map((l) => l.language))];

export const DEFAULT_LOCALE = locales[0];
export const COOKIE_LOCALE = `${SITE_SHORTCUT}_LOCALE`;

/** 'de-DE', 'de-AT', 'en-US' */
export function toLocaleTag(locale: Locale): string {
	return `${locale.language.toLowerCase()}-${locale.country.toUpperCase()}`;
}

/** 'de_DE' – für OpenGraph */
export function getOgLocale(locale: Locale): string {
	return `${locale.language.toLowerCase()}_${locale.country.toUpperCase()}`;
}

/** Alle OG-Locales außer der übergebenen */
export function getAlternateOgLocales(locale: Locale): string[] {
	return locales.filter((l) => l !== locale).map(getOgLocale);
}

/** Prüft, ob ein URL-Segment eine gültige Sprache ist */
export function isValidLanguage(value: unknown): value is string {
	return typeof value === 'string' && availableLanguages.includes(value);
}

/**
 * Default-Locale für ein URL-Segment.
 * Nimmt den ersten Eintrag mit passender language.
 */
export function getDefaultForLanguage(language: string): Locale | undefined {
	return locales.find((l) => l.language === language);
}

/**
 * Findet die beste Locale für ein URL-Segment + Accept-Language.
 * Fallback: erste Locale mit passender language.
 */
export function resolveLocale(language: string, acceptLanguage?: string): Locale | undefined {
	const group = locales.filter((l) => l.language === language);
	if (group.length === 0) return undefined;
	if (group.length === 1) return group[0];

	if (acceptLanguage) {
		const preferred = acceptLanguage
			.split(',')
			.map((part) => {
				const [lang, q] = part.trim().split(';q=');
				return { lang: lang.trim().replace('_', '-'), q: q ? parseFloat(q) : 1 };
			})
			.sort((a, b) => b.q - a.q);

		for (const { lang } of preferred) {
			const match = group.find(
				(l) => toLocaleTag(l).toLowerCase() === lang.toLowerCase(),
			);
			if (match) return match;
		}
	}

	return group[0];
}

/**
 * Findet eine Locale anhand ihres Tags (z.B. 'de-AT').
 * Wird für Cookie-Lookup und Proxy genutzt.
 */
export function findByTag(tag: string): Locale | undefined {
	return locales.find((l) => toLocaleTag(l) === tag);
}

/**
 * Findet die Locale für ein URL-Segment (z.B. 'de' -> de-DE).
 * Bei mehreren Varianten pro Sprache wird die erste genommen.
 * Identisch zu getDefaultForLanguage, aber semantisch klarer im Page-Context.
 */
export function getLocaleFromLang(language: string): Locale | undefined {
	return getDefaultForLanguage(language);
}