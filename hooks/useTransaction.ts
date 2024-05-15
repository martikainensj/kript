import { useCallback } from "react";
import { useObject, useRealm, useUser } from "@realm/react"

import { BSON, UpdateMode, User } from "realm";
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { router } from "expo-router";
import { Transaction } from "../models/Transaction";

interface useTransactionProps {
	id: BSON.ObjectID
}

export const useTransaction = ( { id }: useTransactionProps ) => {
	const user: User = useUser();
	const realm = useRealm();
	const transaction = useObject<Transaction>( 'Transaction', id );

	const saveTransaction = useCallback( ( editedTransaction: Transaction ) => {
		const title = `${ editedTransaction._id
			? __( 'Update Transaction' )
			: __( 'Add Transaction' ) }`;
		const message = ( `${ editedTransaction._id
			? __( 'Updating existing transaction' )
			: __( 'Adding a new transaction' )}` )
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					realm.write( () => {
						realm.create( 'Transaction', editedTransaction, UpdateMode.Modified );
					} );

					resolve( editedTransaction );
				}
			} );
		} )
	}, [] );

	const removeTransaction = useCallback( () => {
		const title = __( 'Remove Transaction' );
		const message = `${ __( 'Removing existing transaction' ) }: ${ transaction._id }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					router.dismiss( 1 );

					realm.write( () => {
						realm.delete( transaction );
					} );

					resolve( true );
				}
			} );
		} );
	}, [ transaction ] );
	
	return { transaction, saveTransaction, removeTransaction }
}