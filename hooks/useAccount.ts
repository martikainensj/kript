import { useCallback } from "react";
import { useObject, useQuery, useRealm, useUser } from "@realm/react"
import { router } from "expo-router";

import { Account } from "../models/Account"
import Realm, { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";
import { Holding } from "../models/Holding";
import { Transaction } from "../models/Transaction";

interface useAccountProps {
	id: BSON.ObjectID
}

export const useAccount = ( { id }: useAccountProps ) => {
	const user: User = useUser();
	const realm = useRealm();
	const account = useObject<Account>( 'Account', id );

	const getHoldingId = useCallback( ( name: string ) => {
		return account.holdings.findIndex( holding => {
			return name === holding.name;
		} );
	}, [ realm ] );

	const getHolding = useCallback( ( name: string ) => {
		const existingHolding = account.holdings[ getHoldingId( name ) ];

		if ( ! existingHolding ) {
			account.holdings.push( {
				name,
				owner_id: user.id,
				account_id: account._id
			} );

			return account.holdings[ account.holdings.length - 1 ];
		}

		return existingHolding;
	}, [ realm ] );

	const addTransaction = useCallback( ( transaction: Transaction ) => {
		const title = __( 'Add Transaction' );
		const message = `${ __( 'Adding a new transaction' ) }\n`
			+ __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					resolve( realm.write( async () => {
						const holding = getHolding( transaction.holding_name );

						holding.transactions.push( transaction );

						return holding.transactions[ holding.transactions.length - 1 ];
					} ) );
				}
			} );
		} );
	}, [] );

	const saveAccount = useCallback( ( editedAccount: Account ) => {
		const title = `${ editedAccount._id
			? __( 'Update Account' )
			: __( 'Add Account' ) }`;
		const message = ( `${ editedAccount._id
			? __( 'Updating existing account' )
			: __( 'Adding a new account' )}` )
			+ `: ${ editedAccount.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					resolve( realm.write( () => {
						return realm.create( 'Account', editedAccount, UpdateMode.Modified );
					} ) );
				}
			} );
		} )
	}, [] );

	const removeAccount = useCallback( () => {
		const title = __( 'Remove Account' );
		const message = `${ __( 'Removing existing account' ) }: ${ account.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					router.navigate( 'accounts/' );

					realm.write( () => {
						realm.delete( account );
					} );

					resolve( true );
				}
			} );
		} );
	}, [ account ] );

	return {
		account, saveAccount, removeAccount,
		getHoldingId, getHolding,
		addTransaction
	}
}