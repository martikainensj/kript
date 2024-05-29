import { useCallback, useMemo } from "react";
import { useRealm, useUser } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { useAccount } from "./useAccount";
import { Holding } from "../models/Holding";

interface useHoldingProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const useHolding = ( { _id, account_id }: useHoldingProps ) => {
	const realm = useRealm();
	const user: Realm.User = useUser();
	const { account, getHoldingById, addTransaction, addTransfer } = useAccount( { id: account_id } );
	const holding = useMemo( () => {
		return getHoldingById( _id );
	}, [ realm, account ] );

	const { transactions, dividends } = {
		transactions: holding.transactions,
		dividends: account.transfers
			.filtered( 'holding_id == $0', holding._id )
	}

	const getTransactionById = useCallback( ( id: Realm.BSON.UUID ) => {
		const transaction = transactions
			.filtered( '_id == $0', id )[0];
		return transaction;
	}, [ realm, holding ] );

	const saveHolding = useCallback( ( editedHolding: Holding ) => {
		const title = __( 'Save Holding' );
		const message = `${ __( 'Saving existing holding' ) }: ${ editedHolding.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						Object.assign( holding, { ...editedHolding } );
					} ) );
				}
			} );
		} );
	}, [ holding, account ] );

	const removeHolding = useCallback( () => {
		const title = __( 'Remove Holding' );
		const message = `${ __( 'Removing existing holding' ) }: ${ holding.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					resolve( realm.write( () => {
						const index = account.holdings.findIndex( holding => {
							return holding._id.equals( _id );
						} );
						
						account.holdings.remove( index );
					} ) );
				}
			} );
		} );
	}, [ holding, account ] );

	return {
		holding, saveHolding, removeHolding,
		account,
		transactions, addTransaction, getTransactionById,
		dividends, addTransfer,
	}
}