export interface Language {
  fi_FI: string;
  en_US: string;
}

export interface Translation extends Partial<Language> {}

export interface i18nContext {
	__: ( key: string ) => string;
	languages: { id: keyof Language, name: string }[];
	language: keyof Language;
	setLanguage: React.Dispatch<React.SetStateAction<keyof i18nContext['language']>>
}

export interface I18nProviderProps {
  children: React.ReactNode;
}