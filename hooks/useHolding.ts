import { useCallback, useMemo } from "react";
import { useRealm, useUser } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { useAccount } from "./useAccount";
import { Holding } from "../models/Holding";

interface useHoldingProps {
	id: number,
	account_id: Realm.BSON.ObjectID
}

export const useHolding = ( { id, account_id }: useHoldingProps ) => {
	const realm = useRealm();
	const user: Realm.User = useUser();
	const { account, getHoldingById, addTransaction, addTransfer } = useAccount( { id: account_id } );
	const holding = useMemo( () => {
		return getHoldingById( id );
	}, [] );

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
						account.holdings.remove( id );
					} ) );
				}
			} );
		} );
	}, [ holding, account ] );

	return {
		holding, saveHolding, removeHolding,
		account,
		addTransaction,
		addTransfer
	}
}