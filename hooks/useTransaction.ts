import { useCallback, useMemo } from "react";
import { useRealm, useUser } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { useAccount } from "./useAccount";
import { Transaction } from "../models/Transaction";
import { useHolding } from "./useHolding";
import { TransactionTypes } from "../constants";
import { Holding } from "../models/Holding";

interface useTransactionProps {
	_id: Realm.BSON.UUID,
	holding_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const useTransaction = ( { _id, holding_id, account_id }: useTransactionProps ) => {
	const realm = useRealm();
	const user: Realm.User = useUser();
	const {
		holding, 
		transactions, getTransactionById
	} = useHolding( { _id: holding_id, account_id: account_id } );
	const transaction = useMemo( () => {
		const transaction = getTransactionById( _id );
		return transaction;
	}, [ realm, holding ] );
	const type = useMemo( () => {
		const [ buy, sell ] = TransactionTypes;

		return transaction?.total > 0 ? buy : sell;
	}, [ realm, transaction ] );

	const saveTransaction = useCallback( ( editedTransaction: Transaction ) => {
		const title = __( 'Save Transaction' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						Object.assign( transaction, { ...editedTransaction } );
					} ) );
				}
			} );
		} );
	}, [ transaction, holding ] );

	const removeTransaction = useCallback( () => {
		const title = __( 'Remove Transaction' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						const index = transactions.findIndex( transaction => {
							return transaction._id.equals( _id );
						} );
						
						transactions.remove( index );
					} ) );
				}
			} );
		} );
	}, [ transaction, transactions ] );

	return {
		transaction, saveTransaction, removeTransaction,
		holding,
		type
	}
}