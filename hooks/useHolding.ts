import { useCallback, useMemo } from "react";
import { useRealm, useUser } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { useAccount } from "./useAccount";
import { Holding } from "../models/Holding";
import { router } from "expo-router";

interface useHoldingProps {
	holding: Holding,
}

export const useHolding = ( props: useHoldingProps ) => {
	const realm = useRealm();
	const user: Realm.User = useUser();
	const { account, getHoldingId, getHolding, addTransaction, addTransfer } = useAccount( { id: props.holding.account_id } );
	const holding = useMemo( () => {
		console.log( props.holding.name );
		return getHolding( props.holding.name )
	}, [ props ] );

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
						console.log( editedHolding );
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
						const holdingId = getHoldingId( holding.name )
						account.holdings.remove( holdingId );
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