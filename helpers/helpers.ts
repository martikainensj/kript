import Realm from 'realm';
import { Transaction } from '../models/Transaction';
import { DataPoint } from '../models/DataPoint';

export const addTimeToDateTimestamp = ( timestamp: number ) => {
	const date = new Date( timestamp );
	const currentDate = new Date();
	
	date.setHours( currentDate.getHours() );
	date.setMinutes( currentDate.getMinutes() );
	date.setSeconds( currentDate.getSeconds() );
	date.setMilliseconds( currentDate.getMilliseconds() );
 
	return date.valueOf();
}

export const getTransactionEndOfDayTimestamp = ( transaction: Transaction ) => {
	const date = new Date( transaction.date );
	date.setHours( 23, 59, 59, 999 );
	const timestamp = date.valueOf();

	return timestamp;
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

export const generateChecksum = ( object: object ) => {
	const objectString = JSON.stringify( object );
	
	return objectString.split( '' ).reduce(( checksum, char ) => {
    return ( checksum + char.charCodeAt( 0 )) % 65535;
  }, 0 ).toString( 16 );
};

/*export const getDateMap = ( ...DataPointArrays: DataPoint[][] ) => {
	const allDataPoints = DataPointArrays.flat();
	const uniqueDatesSet = new Set( allDataPoints.map( dataPoint => dataPoint.date ));
	const uniqueDatesArray = [ ...uniqueDatesSet ].sort(( a, b ) => a - b );

	return uniqueDatesArray;
}*/

export const getDateMap = (...DataPointArrays: DataPoint[][]) => {
	const allDataPoints = DataPointArrays.flat();  
  const allDates = allDataPoints.map(dataPoint => dataPoint.date);
	const firstDate = new Date(Math.min(...allDates));
	const lastDate = new Date(Math.max(...allDates));
	const dateMap = [];

	for (let date = new Date(firstDate); date <= lastDate; date.setDate(date.getDate() + 1)) {
		const newDate = new Date(date.setHours(23, 59, 59, 999)).getTime();
		dateMap.push(newDate.valueOf());
	}
	console.log( dateMap );

	return dateMap;
};