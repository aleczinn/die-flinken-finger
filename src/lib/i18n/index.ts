import {
	DEFAULT_LOCALE,
	locales,
	getDefaultForLanguage,
	toLocaleTag,
	Locale,
} from '@/lib/locale/locales';

/**
 * Translations dynamisch laden – neue JSON-Dateien werden automatisch erkannt,
 * kein manueller Import nötig. Fehlende Dateien werden übersprungen.
 *
 * Dateinamen entsprechen dem Locale-Tag: de-DE.json, de-AT.json, en-US.json
 */
const translationMap = new Map<string, Record<string, unknown>>();

for (const locale of locales) {
	const tag = toLocaleTag(locale);

	try {
		translationMap.set(tag, require(`./translations/${tag}.json`));
	} catch {
		// Keine JSON für diese Locale -> Fallback greift
	}
}

function resolve(obj: Record<string, unknown>, key: string): string | undefined {
	let current: unknown = obj;
	for (const part of key.split('.')) {
		if (current == null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'string' ? current : undefined;
}

/**
 * Übersetzt einen Key für die gegebene Locale.
 *
 * Fallback-Kette:
 *   1. Exakte Locale (z.B. de-AT.json)
 *   2. Sprach-Default (z.B. de-DE.json als Fallback für alle /de/-Varianten)
 *   3. App-Default (erster Eintrag in locales, normalerweise de-DE)
 *   4. Key selbst (macht fehlende Übersetzungen sofort sichtbar)
 */
export function t(locale: Locale, key: string, ...args: (string | number)[]): string {
	const tag = toLocaleTag(locale);
	let result: string | undefined;

	// Exakte Locale
	const exact = translationMap.get(tag);
	if (exact) result = resolve(exact, key);

	// Sprach-Default (de-AT -> de-DE)
	if (!result) {
		const langDefault = getDefaultForLanguage(locale.language);
		if (langDefault && langDefault !== locale) {
			const fallback = translationMap.get(toLocaleTag(langDefault));
			if (fallback) result = resolve(fallback, key);
		}
	}

	// App-Default
	if (!result) {
		const langDefault = getDefaultForLanguage(locale.language);
		if (DEFAULT_LOCALE !== locale && DEFAULT_LOCALE !== langDefault) {
			const appDefault = translationMap.get(toLocaleTag(DEFAULT_LOCALE));
			if (appDefault) result = resolve(appDefault, key);
		}
	}

	// Platzhalter ersetzen, Fallback auf Key
	return (result ?? key).replace(/\{(\d+)}/g, (_, i) => String(args[Number(i)] ?? ''));
}