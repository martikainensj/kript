import { useCallback, useMemo } from "react";
import Realm from "realm";
import { useQuery, useRealm } from "@realm/react"
import { router } from "expo-router";

import { Account } from "../models/Account"
import { confirmation } from "../helpers";
import { Transaction } from "../models/Transaction";
import { Holding } from "../models/Holding";
import { useI18n } from "../components/contexts/I18nContext";
import { useUser } from "./useUser";

interface useAccountProps {
	id: Realm.BSON.UUID
}

export const useAccount = ( { id }: useAccountProps ) => {
	const { user } = useUser();
	const { __ } = useI18n();
	const realm = useRealm();
	const account = useQuery<Account>( 'Account' )
		.filtered( '_id == $0', id )[0];

	const { _id, name, holdings, transactions } = account;

	const getHoldingById = useCallback( ( id: Realm.BSON.UUID ) => {
		const holding = holdings
			.filtered( '_id == $0', id )[0];

		return holding;
	}, [ holdings ] );

	const getTransactionById = useCallback( ( id: Realm.BSON.UUID ) => {
		const transaction = transactions
			.filtered( '_id == $0', id )[0];
		return transaction;
	}, [ transactions ] );

	const getHoldingByName = useCallback( ( name: string ) => {
		const holding = holdings.filtered( 'name == $0', name )[0];

		return holding;
	}, [ holdings ] );

	const addHolding = useCallback( ( name: string ) => {
		const holding: Holding = {
			_id: new Realm.BSON.UUID,
			name,
			owner_id: user.id,
			account_id: _id
		}

		holdings.push( holding );

		return holdings[ holdings.length - 1 ];
	}, [ holdings, _id ] );

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
							getHoldingByName( transaction.holding_name )
								?? addHolding( transaction.holding_name )
						);

						transactions.push( {
							...transaction,
							_id: new Realm.BSON.UUID(),
							holding_id: _id
					 	} );

						return transactions[ transactions.length - 1 ];
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
		const message = `${ __( 'Removing existing account' ) }: ${ name }`
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

	// Variables

	const total = useMemo( () => {
		const total = transactions.reduce( ( total, transaction ) => {
			if ( transaction.type !== 'trading' ) {
				return total;
			}

			return total + transaction.total;
		}, 0 );

		return total;
	}, [ holdings ] );

	const cashAmount = useMemo( () => {
		const amount = transactions.reduce( ( amount, transaction ) => {
			if ( transaction.type !== 'cash' ) {
				return amount;
			}

			return amount + transaction.amount
		}, 0 );

		return amount;
	}, [ transactions ] );

	const balance = useMemo( () => {
		const balance = cashAmount - total;

		return balance;
	}, [ cashAmount, total ] );

	const value = useMemo( () => {
		const value = holdings.reduce( ( value, holding ) => {
			const _transactions = transactions
				.filtered( 'holding_id == $0', holding._id );
		
			const lastTransaction = _transactions.sorted( 'date', true )[0]

			const lastPrice = lastTransaction?.isValid()
				? lastTransaction.price
				: 0;
		
			const amount = _transactions.reduce( ( amount, transaction ) => {
				return amount + transaction.amount
			}, 0 );
		
			return value + ( lastPrice * amount );
		}, balance ); 

		return value;
	}, [ holdings, balance ] );

	const { totalValue, totalCost } = useMemo( () => {
		const { totalValue, totalCost } = holdings.reduce( ( acc, holding ) => {

			const _transactions = transactions
				.filtered( 'holding_id == $0', holding._id );

			const lastTransaction = _transactions.sorted( 'date', true )[0];
			const lastPrice = lastTransaction?.isValid()
				? lastTransaction.price
				: 0;
			const amount = _transactions.reduce( ( amount, transaction ) => {
				return amount + transaction.amount;
			}, 0 );
			const value = lastPrice * amount;
			const total = _transactions.reduce( ( total, transaction ) => {
				return total + transaction.total;
			}, 0 );

			return {
				totalValue: acc.totalValue + value,
				totalCost: acc.totalCost + total
			};
		}, { totalValue: 0, totalCost: 0 } );

		return { totalValue, totalCost }
	}, [ holdings ] );

	const returnValue = totalValue - totalCost;
	const returnPercentage = totalValue
		? ( totalValue - totalCost ) / Math.abs( totalCost ) * 100
		: 0;

	return {
		account, saveAccount, removeAccount,
		addHolding, getHoldingById, getHoldingByName,
		addTransaction, getTransactionById, transactions,
		balance, value, returnValue, returnPercentage
	}
}