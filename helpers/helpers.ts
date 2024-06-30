import Realm from 'realm';

export const addTimeToDateTimestamp = ( timestamp: number ) => {
	const date = new Date( timestamp );
	const currentDate = new Date();
	
	date.setHours( currentDate.getHours() );
	date.setMinutes( currentDate.getMinutes() );
	date.setSeconds( currentDate.getSeconds() );
	date.setMilliseconds( currentDate.getMilliseconds() );
 
	return date.valueOf();
}

export const stripRealmListsFromObject = <Type>( object: Type ) => {
  for ( const key in object ) {
		if ( object[key] instanceof Realm.List ) {
			delete object[key];
		}
  }

  return object;
}

export const peak = <Type>( array: Type[] ) => {
  return array[array.length - 1];
}

export const truncateString = ( string: string, limit = 24 ) => {
	const trimmedTitle = string?.length >= limit
		?	string?.slice(0, limit) + "..."
		:	string;

	return trimmedTitle;
}

export const allSet = ( ...params: any[] ): boolean => {
  return params.every( param => !! param );
}

export const prettifyNumber = (
	value: number,
	fractionDigits: number = 2,
	locales: Intl.LocalesArgument = 'fi-FI'
): string => {
	if ( ! value && value !== 0 ) return null;

  const parts = value.toFixed( fractionDigits ).split('.');
  const integerPart = parseInt( parts[0] ).toLocaleString( locales );
  const decimalPart = parts[1];
  const trimmedDecimalPart = decimalPart
		? decimalPart.replace( /0+$/, '' )
		: '';

  return trimmedDecimalPart
		? `${ integerPart }.${ trimmedDecimalPart }`
		: integerPart;
}

export const generateChecksum = ( objectString: string ) => {
	return objectString.split( '' ).reduce(( checksum, char ) => {
    return ( checksum + char.charCodeAt( 0 )) % 65535;
  }, 0 ).toString( 16 );
};