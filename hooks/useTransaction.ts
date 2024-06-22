import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { Transaction } from "../models/Transaction";
import { useI18n } from "../components/contexts/I18nContext";
import { useTypes } from "./useTypes";
import { useAccount } from "./useAccount";

interface useTransactionProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const useTransaction = ( { _id, account_id }: useTransactionProps ) => {
	const { __ } = useI18n();
	const realm = useRealm();
	const { getTransactionBy, getHoldingBy, account } = useAccount( { _id: account_id } );
	
	const transaction = useMemo( () => {
		const transaction = getTransactionBy( '_id', _id );
		return transaction;
	}, [ account ] );

	const holding = useMemo( () => {
		const holding = transaction && getHoldingBy( '_id', transaction.holding_id );
		return holding;
	}, [ transaction ] );

	const { TradingTypes, CashTypes, AdjustmentTypes } = useTypes();

	const type = useMemo( () => {
		switch ( transaction?.type) {
			case 'trading':
				return TradingTypes.find(type => type.id === transaction.sub_type )
			case 'cash':
				return CashTypes.find(type => type.id === transaction.sub_type )
			case 'adjustment':
				return AdjustmentTypes.find(type => type.id === transaction.sub_type )
		}
	}, [ transaction ] )

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
	}, [ transaction, account ] );

	const removeTransaction = useCallback( () => {
		const title = __( 'Remove Transaction' );
		const message = __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						const index = account.transactions.findIndex( transaction => {
							return transaction._id.equals( _id );
						} );
						
						account.transactions.remove( index );
					} ) );
				}
			} );
		} );
	}, [ transaction, account ] );

	return {
		transaction, saveTransaction, removeTransaction,
		holding,
		type
	}
}