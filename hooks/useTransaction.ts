import { useCallback, useEffect, useState } from "react";
import { useObject, useRealm, useUser } from "@realm/react"

import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";
import { router } from "expo-router";
import { Transaction, TransactionType } from "../models/Transaction";
import { Account } from "../models/Account";
import { Holding } from "../models/Holding";

interface useTransactionProps {
	id?: BSON.ObjectID,
	account?: Account,
	holding?: Holding
}

export const useTransaction = ( { id, account, holding }: useTransactionProps = {} ) => {
	const user: User = useUser();
	const realm = useRealm();
	const existingTransaction = id && useObject( Transaction, id );
	const [ transaction, setTransaction ] = useState<TransactionType>( {
		owner_id: user.id,
		account,
		holding,
		amount: 0,
		price: 0,
		total: 0,
		date: Date.now(),
	} );
	
	const saveTransaction = useCallback( ( editedTransaction: Transaction ) => {
		const title = `${ editedTransaction._id
			? __( 'Update Transaction' )
			: __( 'Add Transaction' ) }`;
		const message = ( `${ editedTransaction._id
			? __( 'Updating existing transaction' )
			: __( 'Adding a new transaction' )}` )
			+ `: ${ editedTransaction.holding.objectType.name }`
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
		const message = `${ __( 'Removing existing transaction' ) }: ${ existingTransaction.holding.objectType.name }`
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
		existingTransaction?.isValid() && setTransaction( existingTransaction );
	}, [ existingTransaction ] );
	
	return { transaction, setTransaction, saveTransaction, removeTransaction }
}