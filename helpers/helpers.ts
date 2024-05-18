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
  const editedProps = <Type>{ ...object };

  for ( const key in object ) {
		if ( object[key] instanceof Realm.List ) {
			console.log(key)
			delete object[key];
		}
  }

  return object;
}