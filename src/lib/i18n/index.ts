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
export function t(locale: Locale, key: string): string {
	const tag = toLocaleTag(locale);

	// Exakte Locale
	const exact = translationMap.get(tag);
	if (exact) {
		const value = resolve(exact, key);
		if (value) return value;
	}

	// Sprach-Default (de-AT → de-DE)
	const langDefault = getDefaultForLanguage(locale.language);
	if (langDefault && langDefault !== locale) {
		const fallback = translationMap.get(toLocaleTag(langDefault));
		if (fallback) {
			const value = resolve(fallback, key);
			if (value) return value;
		}
	}

	// App-Default
	if (DEFAULT_LOCALE !== locale && DEFAULT_LOCALE !== langDefault) {
		const appDefault = translationMap.get(toLocaleTag(DEFAULT_LOCALE));
		if (appDefault) {
			const value = resolve(appDefault, key);
			if (value) return value;
		}
	}

	return key;
}