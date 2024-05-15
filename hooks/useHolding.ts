import { useCallback, useMemo } from "react";
import { useRealm, useUser } from "@realm/react"

import Realm from "realm";
import { __, confirmation } from "../helpers";
import { useAccount } from "./useAccount";
import { Holding } from "../models/Holding";
import { router } from "expo-router";

interface useHoldingProps {
	holding: Holding,
}

export const useHolding = ( props: useHoldingProps ) => {
	const realm = useRealm();
	const user: Realm.User = useUser();
	const { account, getHoldingId, getHolding, addTransaction } = useAccount( { id: props.holding.account_id } );
	const holding = getHolding( props.holding.name );

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
		holding, removeHolding,
		account,
		addTransaction
	}
}