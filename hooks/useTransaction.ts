import { useCallback, useEffect, useState } from "react";
import { useObject, useRealm, useUser } from "@realm/react"

import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";
import { router } from "expo-router";
import { Transaction } from "../models/Transaction";

interface useTransactionProps {
	id?: BSON.ObjectID
}

export const useTransaction = ( { id }: useTransactionProps = {} ) => {
	const user: User = useUser();
	const realm = useRealm();
	const realmTransaction = id && useObject( Transaction, id );
	const [ transaction, setTransaction ] = useState<Transaction>();
	
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
						realm.create( Transaction, editedTransaction, UpdateMode.Modified );
					} );

					resolve( editedTransaction );
				}
			} );
		} )
	}, [] );

	const removeTransaction = useCallback( () => {
		const title = __( 'Remove Transaction' );
		const message = `${ __( 'Removing existing transaction' ) }: ${ realmTransaction._id }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					router.navigate( 'transactions/' );

					realm.write( () => {
						realm.delete( transaction );
					} );

					setTransaction( null );
					resolve( true );
				}
			} );
		} );
	}, [ transaction ] );

	useEffect( () => {
		realmTransaction?.isValid() && setTransaction( realmTransaction );
	}, [ realmTransaction ] );
	
	return { transaction, setTransaction, saveTransaction, removeTransaction }
}