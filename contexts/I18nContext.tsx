import React, {
	useState,
	createContext,
	useContext,
	useCallback,
	useLayoutEffect
} from "react";
import { useStorage } from "../hooks/useStorage";
import Translations from "../localization/translations";

export interface Languages {
  fi_FI: string;
  en_US: string;
}

interface i18nContext {
	__: ( key: string ) => string;
	languages: { id: keyof Languages, name: string }[];
	currentLang: keyof Languages;
	setLang: React.Dispatch<React.SetStateAction<keyof Languages>>
}

const i18nContext = createContext<i18nContext>( {
	__: () => '',
	languages: [],
	currentLang: 'en_US',
	setLang: () => {}
} );

export const useI18n = () => useContext( i18nContext );

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ( { children } ) => {
	const { getData, setData } = useStorage();
  const [ currentLang, setCurrentLang ] = useState<keyof Languages>('en_US');
	const languages: { id: keyof Languages, name: string }[] = [
		{ id: 'fi_FI', name: 'Suomi' },
		{ id: 'en_US', name: 'English US' }
	];
	
	const __ = useCallback( ( key: string ) => {
		const translation
			= Translations[ key.toLocaleLowerCase() ]?.[ currentLang ];
	
		if ( ! translation ) {
			return `${ Translations.missingKey[ currentLang ] } ("${ currentLang }"): "${ key }"`;
		}
	
		return translation;
	}, [ currentLang ] );


  const setLang = useCallback( ( lang: keyof Languages ) => {
    setCurrentLang(lang);
		setData( '@settings/language', lang );
  }, [ setCurrentLang ] );

  useLayoutEffect( () => {
		getData( '@settings/language' ).then( language => {
			language && setCurrentLang( language );
		} );
  }, [ getData ] );

  return (
    <i18nContext.Provider value={ {
			__,
			languages,
			currentLang,
			setLang
		} }>
      { children }
    </i18nContext.Provider>
  );
}