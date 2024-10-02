import { createContext, useContext } from "react";
import { i18nContext, I18nProviderProps } from "./Types";

const i18nContext = createContext<i18nContext>({
	__: () => '',
	languages: [],
	language: 'en_US',
	setLanguage: () => { }
});

export const useI18n = () => useContext(i18nContext);

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