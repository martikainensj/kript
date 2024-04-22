import { Translations } from "../constants";

/**
 * Get translation string
 * @param { string } key
 * @returns 
 */
export const getTranslation = ( key: string ) => {
	// TODO: Tee language context
	const lang = "en_US";

	const string = Translations[ key.toLocaleLowerCase() ]?.[ lang ];

	return string ?? `${Translations.missingKey[ lang ]}: ${key}`;
}