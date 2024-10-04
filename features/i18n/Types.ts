export type LocaleString = 'fi_FI' | 'en_US';

export type LocaleTranslations = {
	[key in LocaleString]?: string;
};

export interface i18nContextProps {
	__: (key: string) => string;
	languages: { id: LocaleString, name: string }[];
	language: LocaleString;
	setLanguage: React.Dispatch<React.SetStateAction<i18nContextProps['language']>>
}

export interface I18nProviderProps {
	children: React.ReactNode;
}