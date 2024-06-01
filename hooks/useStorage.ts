import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';
import { Languages } from '../components/contexts/I18nContext';


interface storageKeys {
  '@settings/colorMode': { type: ColorSchemeName };
  '@settings/language': { type: keyof Languages };
}

type storageKey = keyof storageKeys;
type storageValue<K extends storageKey> = storageKeys[K]['type'];

export const useStorage = () => {
	const setData = async <K extends storageKey>( key: K, value: storageValue<K> ) => {
    try {
      const serializedValue = JSON.stringify( value );
      await AsyncStorage.setItem( key, serializedValue );
    } catch ( e ) {
      console.error( e );
    }
  };

  const getData = async <K extends storageKey>( key: K ) => {
    try {
      const serializedValue = await AsyncStorage.getItem( key );

      return serializedValue !== null
				? JSON.parse( serializedValue ) as storageValue<K>
				: null;
    } catch ( e ) {
      console.error( e );
      return null;
    }
  };

	return { setData, getData }
}