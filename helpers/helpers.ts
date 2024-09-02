import Realm from 'realm';
import { Transaction } from '../models/Transaction';
import { DataPoint } from '../models/DataPoint';
import { IntervalType } from '../hooks/useTypes';

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
		? decimalPart?.replace( /0+$/, '' )
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

export const getIntervalMap = (
	data: DataPoint[],
	interval: IntervalType = 'weekly',
	range?: number
) => {

	//TODO: Jollain pitäis saada aina vika päivä viikossa(pe), kuukaudessa tai vuodessa
	// pääteltyy ja se tuutattais sit puskien tonne intervalMappiin.
	const currentDate = new Date();
	const fromDate = (() => {
		if ( ! range ) {
			return new Date( data[0].date );
		}

		const date = new Date( currentDate );
	
		const intervals = {
			daily: () => date.setDate( date.getDate() - range ),
			weekly: () => date.setDate( date.getDate() - range * 7 ),
			monthly: () => date.setMonth( date.getMonth() - range ),
			yearly: () => date.setFullYear( date.getFullYear() - range ),
		};
	
		intervals[ interval ]?.();
	
		return date;
	})();

	const intervalMap: Date[] = [];
	const date = new Date( fromDate );

	while ( date <= currentDate ) {
		intervalMap.push( new Date( date ));
		
		switch ( interval ) {
			case 'daily':
				date.setDate( date.getDate() + 1 );
				break;
			case 'weekly':
				date.setDate( date.getDate() + 7 );
				break;
			case 'monthly':
				date.setMonth( date.getMonth() + 1 );
				break;
			case 'yearly':
				date.setFullYear( date.getFullYear() + 1 );
				break;
		}
	}

	return intervalMap;
}

export const getDateMap = ( DataPointArrays: DataPoint[][] ) => {
	const allDataPoints = JSON.parse(JSON.stringify( DataPointArrays )).flat() as DataPoint[];
	
  const allDates = allDataPoints.map(dataPoint => dataPoint.date);
	const firstDate = new Date(Math.min(...allDates));
	const lastDate = new Date(Math.max(...allDates));
	const dateMap = [] as number[];

	for (let date = new Date(firstDate); date <= lastDate; date.setDate(date.getDate() + 1)) {
		const newDate = new Date(date.setHours(23, 59, 59, 999)).getTime();
		dateMap.push(newDate);
	}

	return dateMap;
};

export const getWeekNumber = (date: Date) => {
  // Create a copy of the date object at UTC midnight
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
  // Set the date to the nearest Thursday (current date + 4 - current day number)
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

  // Get the first day of the year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

  // Calculate the week number
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);

  return weekNo;
}

export const getLastWorkingDayOfWeek = (date: Date): Date =>{
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  result.setDate(result.getDate() + daysUntilFriday);
  
  return result;
}

export const getLastDayOfMonth = ( date: Date ): Date => {
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  nextMonth.setDate(nextMonth.getDate() - 1);
  
  return nextMonth;
}

export const getLastDayOfYear = (date: Date): Date => {
  const nextYear = new Date(date.getFullYear() + 1, 0, 1);
  nextYear.setDate(nextYear.getDate() - 1);
  
  return nextYear;
}


export const getYTD = () => {
	const today = new Date();
	const startOfYear = new Date( today.getFullYear(), 0, 1 );
	const diffInMs = today - startOfYear;
	const diffInDays = Math.floor( diffInMs / ( 1000 * 60 * 60 * 24 ) );
	
	return diffInDays + 1;
};

export const buildChartData = (datasets: DataPoint[][]): DataPoint[] => {
	const copiedDatasets = datasets.map(dataset => dataset.map(dataPoint => ({ ...dataPoint })));

	const dates = copiedDatasets.reduce((acc, dataset) => {
		dataset.forEach(dataPoint => {
			acc.add(dataPoint.date);
		});
		return acc;
	}, new Set<DataPoint['date']>());

	const sortedDates = [...dates].sort();
	const chartData = sortedDates.map(date => {
    let value = 0;

    copiedDatasets.forEach( dataset => {
			if ( dataset[1]?.date <= date ) {
				dataset.splice(0, 1);
			}

			if ( dataset[0]?.date <= date ) {
				value += dataset[0]?.value ?? 0;
			}
		});

    return { date, value } as DataPoint;
  });

	return chartData;
};