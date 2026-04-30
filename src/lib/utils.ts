/**
 * Diese Methode kombiniert sämtliche Objekte, strings, etc. zu einem finalen String zusammen, welcher dann als
 * className genutzt werden kann
 * @param classes
 */
export function css(...classes: (string | false | null | undefined)[]) {
	return classes.filter(Boolean).join(' ');
}