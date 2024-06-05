import React, { useCallback, useMemo } from "react";
import Realm from "realm";
import { useQuery, useRealm } from "@realm/react"
import { router } from "expo-router";

import { Account } from "../models/Account"
import { confirmation } from "../helpers";
import { Transaction } from "../models/Transaction";
import { Transfer } from "../models/Transfer";
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

	const { _id, name, holdings, transfers } = account;

	const getHoldingById = useCallback( ( id: Realm.BSON.UUID ) => {
		const holding = holdings.filtered( '_id == $0', id )[0];

		return holding;
	}, [ holdings ] );

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
						const { _id, transactions } = getHoldingByName( transaction.holding_name )
							?? addHolding( transaction.holding_name );

						transactions.push( {
							...transaction,
							holding_id: _id
					 	} );

						return transactions[ transactions.length - 1 ];
					} ) );
				}
			} );
		} );
	}, [ account ] );

	const getTransferById = useCallback( ( id: Realm.BSON.UUID ) => {
		const transfer = transfers.filtered( '_id == $0', id )[0];

		return transfer;
	}, [ transfers ] );

	const addTransfer = useCallback( ( transfer: Transfer ) => {
		const title = __( 'Add Transfer' );
		const message = `${ __( 'Adding a new transfer' ) }\n`
			+ __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					resolve( realm.write( async () => {
						const { _id } = !! transfer.holding_name
							&& ( getHoldingByName( transfer.holding_name ) ?? addHolding( transfer.holding_name ) );

						transfers.push( {
							...transfer,
							holding_id: _id
					 	} );

						return transfers[ transfers.length - 1 ];
					} ) );
				}
			} );
		} );
	}, [ transfers ] );

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
		const total = holdings.reduce( ( holdingsTotal, holding ) => {
			const { transactions } = holding;

			return holdingsTotal + transactions.reduce( ( transactionsTotal, transaction ) => {
				const { total } = transaction;

				return transactionsTotal + total;
			}, 0 );
		}, 0 );

		return total;
	}, [ holdings ] );

	const transfersAmount = useMemo( () => {
		const transfersAmount = transfers.reduce( ( amount, transfer ) => {
			return amount + transfer.amount
		}, 0 );

		return transfersAmount;
	}, [ transfers ] );

	const balance = useMemo( () => {
		const balance = transfersAmount - total;

		return balance;
	}, [ transfersAmount, total ] );

	const value = useMemo( () => {
		const value = holdings.reduce( ( value, holding ) => {
			const { transactions } = holding;
		
			const lastTransaction = transactions.sorted( 'date', true )[0]

			const lastPrice = lastTransaction?.isValid()
				? lastTransaction.price
				: 0;
		
			const amount = transactions.reduce( ( amount, transaction ) => {
				return amount + transaction.amount
			}, 0 );
		
			return value + ( lastPrice * amount );
		}, balance ); 

		return value;
	}, [ holdings, balance ] );

	return {
		account, saveAccount, removeAccount,
		addHolding, getHoldingById, getHoldingByName,
		addTransaction,
		addTransfer, getTransferById,
		balance, value
	}
}