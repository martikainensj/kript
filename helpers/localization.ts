import { Translations } from "../constants";

/**
 * Get translation string
 * @param { string } key
 * @returns 
 */
export const __ = ( key: string ) => {
	// TODO: Tee language context
	const lang = "en_US";

	const translation = Translations[key.toLocaleLowerCase()]?.[lang];

	// Missing translation
	if ( ! translation ) {
		return `${ Translations.missingKey[lang] } ("${ lang }"): "${ key }"`;
	}

	return translation;
}