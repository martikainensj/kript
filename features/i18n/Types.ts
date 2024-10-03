export type LocaleString = 'fi_FI' | 'en_US';

export type LocaleTranslations = {
	[key in LocaleString]?: string;
};

export interface i18nContext {
	__: (key: string) => string;
	languages: { id: LocaleString, name: string }[];
	language: LocaleString;
	setLanguage: React.Dispatch<React.SetStateAction<i18nContext['language']>>
}

export interface I18nProviderProps {
	children: React.ReactNode;
}