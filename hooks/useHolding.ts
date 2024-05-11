import { useCallback, useEffect, useState } from "react";
import { useObject, useRealm } from "@realm/react"

import { BSON, UpdateMode } from "realm";
import { __, confirmation } from "../helpers";
import { router } from "expo-router";
import { Holding } from "../models/Holding";
import { Transaction } from "../models/Transaction";

interface useHoldingProps {
	id?: BSON.ObjectID
}

export const useHolding = ( { id }: useHoldingProps = {} ) => {
	const realm = useRealm();
	const realmHolding = id && useObject( Holding, id );
	const [ holding, setHolding ] = useState<Holding>();

	const addTransaction = useCallback( ( transaction: Transaction ) => {
		const title = __( 'Add Transaction' );
		const message = `${ __( 'Adding a new transaction' ) }\n`
			+ __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					realm.write( () => {
						if ( ! realmHolding ) {
							realm.write( () => {
								realm.create(
									Holding,
									transaction.holding,
									UpdateMode.Modified
								);
							} );
						} 

						realm.create( Transaction, transaction, UpdateMode.Modified );
					} );
					resolve( transaction );
				}
			} );
		} );
	}, [] );
	
	const saveHolding = useCallback( ( editedHolding: Holding ) => {
		const title = __( 'Update Holding' );
		const message =  `${ __( 'Updating existing holding' ) }\n`
			+ __( 'Are you sure?' );

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
		} );
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
	
	return { holding, setHolding, saveHolding, removeHolding, addTransaction }
}