/**
 * E-Mail-Validierung nach pragmatischem Schema.
 * Echtes RFC-5322-Regex ist unhandlich und in der Praxis nicht nötig.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿẞßÄÖÜäöü\s'-]+$/;

export type Validator = (value: string) => string | null;

export function required(message = 'Pflichtfeld'): Validator {
    return (value) => (value.trim() === '' ? message : null);
}

export function email(message = 'Bitte eine gültige E-Mail-Adresse eingeben'): Validator {
    return (value) => {
        if (value.trim() === '') return null; // leer = kein Email-Fehler (required ist separat)
        return EMAIL_REGEX.test(value) ? null : message;
    };
}

export function personName(message = 'Bitte einen gültigen Namen ohne Zahlen & Sonderzeichen eingeben'): Validator {
    return (value) => {
        const trimmed = value.trim();

        if (trimmed === '') return null;

        return NAME_REGEX.test(trimmed) ? null : message;
    };
}

/** Führt mehrere Validatoren der Reihe nach aus, gibt den ersten Fehler zurück. */
export function validate(value: string, ...validators: Validator[]): string | null {
    for (const v of validators) {
        const error = v(value);
        if (error) return error;
    }
    return null;
}