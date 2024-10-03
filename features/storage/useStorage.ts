import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKey, storageValue } from './types';

export const useStorage = () => {
  const get = async <K extends storageKey>( key: K ) => {
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

	const set = async <K extends storageKey>( key: K, value: storageValue<K> ) => {
    try {
      const serializedValue = JSON.stringify( value );
      await AsyncStorage.setItem( key, serializedValue );
    } catch ( e ) {
      console.error( e );
    }
  };

	return { get, set }
}