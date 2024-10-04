import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";
import { i18nContextProps, I18nProviderProps, LocaleString } from "./types";
import { useStorage } from "../storage/useStorage";
import Translations from "./translations";

const i18nContext = createContext<i18nContextProps>({
	__: () => '',
	languages: [],
	language: 'en_US',
	setLanguage: () => { }
});

export const useI18n = () => useContext(i18nContext);

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
	const { get, set } = useStorage();
	const [locale, setLocale] = useState<LocaleString>('en_US');
	const languages: { id: LocaleString, name: string }[] = [
		{ id: 'fi_FI', name: 'Suomi' },
		{ id: 'en_US', name: 'English US' }
	];

	const __ = useCallback((key: string) => {
		const translation
			= Translations[key.toLocaleLowerCase()]?.[locale];

		if (!translation) {
			return `${Translations.missingKey[locale]} ("${locale}"): "${key}"`;
		}

		return translation;
	}, [locale]);


	const setLanguage = useCallback((locale: LocaleString) => {
		setLocale(locale);
		set('@settings/language', locale);
	}, [locale]);

	useLayoutEffect(() => {
		get('@settings/language').then(locale => {
			locale && setLocale(locale);
		});
	}, [get]);

	return (
		<i18nContext.Provider value={{
			__,
			languages,
			language: locale,
			setLanguage
		}}>
			{children}
		</i18nContext.Provider>
	);
}