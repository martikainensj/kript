import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { Transaction } from "../models/Transaction";
import { useHolding } from "./useHolding";
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
	const { getHoldingById, getTransactionById, account, transactions } = useAccount( { id: account_id } );
	
	const transaction = useMemo( () => {
		const transaction = getTransactionById( _id );
		return transaction;
	}, [ account ] );

	const holding = useMemo( () => {
		const holding = getTransactionById( transaction.holding_id );
		return holding;
	}, [ transaction ] );

	const { TradingTypes, CashTypes, AdjustmentTypes } = useTypes();

	const type = useMemo( () => {
		switch ( transaction.type) {
			case 'trading':
				return TradingTypes.find(type => type.id === transaction.sub_type )
			case 'cash':
				return CashTypes.find(type => type.id === transaction.sub_type )
			case 'adjustment':
				return AdjustmentTypes.find(type => type.id === transaction.sub_type )
		}
	}, [] )

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