import { useCallback, useEffect, useMemo } from "react";
import Realm from "realm";
import { useQuery, useRealm } from "@realm/react"
import { router } from "expo-router";

import { Account, AccountKey, AccountValue } from "../models/Account"
import { confirmation } from "../helpers";
import { Transaction, TransactionKey, TransactionValue } from "../models/Transaction";
import { Holding, HoldingKey, HoldingValue } from "../models/Holding";
import { useI18n } from "../contexts/I18nContext";
import { useUser } from "./useUser";

interface useAccountProps {
	_id: Realm.BSON.UUID
}

export const useAccount = ( { _id }: useAccountProps ) => {
	const { user } = useUser();
	const { __ } = useI18n();
	const realm = useRealm();
	const account = useQuery<Account>( 'Account' )
		.filtered( '_id == $0', _id )[0];

	const getTransactionBy = useCallback( <K extends TransactionKey>( key: K, value: TransactionValue<K> ) => {
		const transaction = account?.transactions
			.filtered( `${key} == $0`, value )[0];

		return transaction;
	}, [ account ] );

	const getHoldingBy = useCallback( <K extends HoldingKey>( key: K, value: HoldingValue<K> ) => {
		const holding = account?.holdings
			.filtered( `${key} == $0`, value )[0];

		return holding;
	}, [ account ] );

	const addHolding = useCallback( ( name: string ) => {
		const holding: Holding = {
			_id: new Realm.BSON.UUID,
			name,
			owner_id: user.id,
			account_id: account._id
		}

		account.holdings.push( holding );

		return account.holdings[ account.holdings.length - 1 ];
	}, [ account ] );

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
						const { _id } = transaction.holding_name && (
							getHoldingBy( 'name', transaction.holding_name )
								?? addHolding( transaction.holding_name )
						);

						account.transactions.push( {
							...transaction,
							_id: new Realm.BSON.UUID(),
							holding_id: _id
					 	} );

						return account.transactions[ account.transactions.length - 1 ];
					} ) );
				}
			} );
		} );
	}, [ account ] );

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
						return realm.create( 'Account', editedAccount, Realm.UpdateMode.Modified );
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

	const updateVariables = useCallback( ( variables: Partial<Record<AccountKey, AccountValue<AccountKey>>> ) => {
			const hasChanges = Object.keys( variables )
				.some( key => account[ key ] !== variables[ key ] );
				
			if ( ! hasChanges ) return;

			realm.write( () => {
				Object.entries( variables ).forEach( ( [ key, value ] ) => {
					account[ key ] = value;
				} );
			} );
		}, [ realm, account ]
	);

	// Variables

	const total = useMemo( () => {
		const total = account.holdings.reduce( ( total, holding ) => {
			return total + holding.total;
		}, 0 );

		return total;
	}, [ account ] );

	const cashAmount = useMemo( () => {
		const cashAmount = account.transactions.reduce( ( cashAmount, transaction ) => {
			if ( transaction.type !== 'cash' ) {
				return cashAmount;
			}

			return cashAmount + transaction.amount
		}, 0 );

		return cashAmount;
	}, [ account ] );

	const balance = cashAmount - total;

	const value = useMemo( () => {
		const value = account.holdings.reduce( ( value, holding ) => {
			return value + holding.value;
		}, balance );

		return value;
	}, [ account ] );

	const returnValue = value - balance - total;
	const returnPercentage = value
		? ( value - balance - total ) / Math.abs( total ) * 100
		: 0;

	useEffect( () => {
		updateVariables( {
			total,
			cashAmount,
			balance,
			value,
			returnValue,
			returnPercentage
		} );
	}, [ account ] )

	return {
		account, saveAccount, removeAccount,
		addHolding, getHoldingBy,
		addTransaction, getTransactionBy,
	}
}