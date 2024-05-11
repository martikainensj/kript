import { useCallback, useEffect, useState } from "react";
import { useObject, useRealm, useUser } from "@realm/react"

import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";
import { router } from "expo-router";
import { Holding } from "../models/Holding";

interface useHoldingProps {
	id?: BSON.ObjectID
}

export const useHolding = ( { id }: useHoldingProps = {} ) => {
	const user: User = useUser();
	const realm = useRealm();
	const realmHolding = id && useObject( Holding, id );
	const [ holding, setHolding ] = useState<Holding>();
	
	const saveHolding = useCallback( ( editedHolding: Holding ) => {
		const title = `${ editedHolding._id
			? __( 'Update Holding' )
			: __( 'Add Holding' ) }`;
		const message = ( `${ editedHolding._id
			? __( 'Updating existing holding' )
			: __( 'Adding a new holding' )}` )
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					realm.write( () => {
						realm.create( Holding, editedHolding, UpdateMode.Modified );
					} );

					resolve( editedHolding );
				}
			} );
		} )
	}, [] );

	const removeHolding = useCallback( () => {
		const title = __( 'Remove Holding' );
		const message = `${ __( 'Removing existing holding' ) }: ${ realmHolding._id }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					router.navigate( `accounts/${holding.account._id}` );

					realm.write( () => {
						realm.delete( holding );
					} );

					setHolding( null );
					resolve( true );
				}
			} );
		} );
	}, [ holding ] );

	useEffect( () => {
		realmHolding?.isValid() && setHolding( realmHolding );
	}, [ realmHolding ] );
	
	return { holding, setHolding, saveHolding, removeHolding }
}