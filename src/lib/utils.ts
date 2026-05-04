type Falsy = false | null | undefined | 0 | 0n | '';

/**
 * Diese Methode kombiniert sämtliche Objekte, strings, etc. zu einem finalen String zusammen, welcher dann als
 * className genutzt werden kann
 * @param classes
 */
export function css(...classes: (string | Falsy)[]) {
	return classes.filter(Boolean).join(' ');
}