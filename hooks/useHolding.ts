import { useCallback, useEffect, useMemo, useState } from "react";
import { useObject, useQuery, useRealm, useUser } from "@realm/react"

import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";
import { router } from "expo-router";
import { Holding } from "../models/Holding";
import { Transaction } from "../models/Transaction";

interface useHoldingProps {
	id: BSON.ObjectID
}

export const useHolding = ( { id }: useHoldingProps ) => {
	const realm = useRealm();
	const user: User = useUser();

	const holding = useMemo( () => {
		const holding = realm.objectForPrimaryKey<Holding>( 'Holding', id );
		return holding;
	}, [ realm ] ); 

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
						if ( ! holding ) {
							realm.create(
								'Holding',
								{
									...holding,
									owner_id: user.id
								},
								UpdateMode.Modified
							);
						} 

						realm.create( 'Transaction', transaction, UpdateMode.Modified );
					} );
					resolve( transaction );
				}
			} );
		} );
	}, [ holding ] );
	
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
						realm.create( 'Holding', editedHolding, UpdateMode.Modified );
					} );

					resolve( editedHolding );
				}
			} );
		} );
	}, [] );

	const removeHolding = useCallback( () => {
		const title = __( 'Remove Holding' );
		const message = `${ __( 'Removing existing holding' ) }: ${ holding._id }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					router.dismiss( 1 );

					realm.write( () => {
						realm.delete( holding );
					} );

					resolve( true );
				}
			} );
		} );
	}, [ holding ] );

	return { holding, saveHolding, removeHolding, addTransaction }
}