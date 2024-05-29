import React, { useCallback } from "react";
import Realm from "realm";
import { useQuery, useRealm, useUser } from "@realm/react"
import { router } from "expo-router";

import { Account } from "../models/Account"
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { Transaction } from "../models/Transaction";
import { Transfer } from "../models/Transfer";
import { Holding } from "../models/Holding";

interface useAccountProps {
	id: Realm.BSON.UUID
}

export const useAccount = ( { id }: useAccountProps ) => {
	const user: Realm.User = useUser();
	const realm = useRealm();
	const account = useQuery<Account>( 'Account' )
		.filtered( '_id == $0', id )[0];

	const getHoldingById = useCallback( ( id: Realm.BSON.UUID ) => {
		const holding = account?.holdings
			.filtered( '_id == $0', id )[0];
		return holding;
	}, [ realm, account ] );

	const getHoldingByName = useCallback( ( name: string ) => {
		const holding = account?.holdings
			.filtered( 'name == $0', name )[0];
		return holding;
	}, [ realm, account ] );

	const addHolding = useCallback( ( name: string ) => {
		const holding: Holding = {
			_id: new Realm.BSON.UUID,
			name,
			owner_id: user.id,
			account_id: account._id
		}

		account.holdings.push( holding );
		return account.holdings[ account?.holdings.length - 1 ];
	}, [ realm, account ] );

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
						const holding = getHoldingByName( transaction.holding_name )
							?? addHolding( transaction.holding_name );

						holding.transactions.push( {
							...transaction,
							holding_id: holding._id
					 	} );

						return holding.transactions[ holding.transactions.length - 1 ];
					} ) );
				}
			} );
		} );
	}, [] );

	const getTransferById = useCallback( ( id: Realm.BSON.UUID ) => {
		const transfer = account?.transfers
			.filtered( '_id == $0', id )[0];
		return transfer;
	}, [ realm, account ] );

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
						const holding = !! transfer.holding_name
							&& ( getHoldingByName( transfer.holding_name ) ?? addHolding( transfer.holding_name ) );

						account.transfers.push( {
							...transfer,
							holding_id: holding?._id
					 	} );

						return account.transfers[ account.transfers.length - 1 ];
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

	// Getters

	const getTotal = useCallback( ( fractionDigits?: number ) => {
		const total = account?.holdings.reduce( ( holdingsTotal, holding ) => {
			const { transactions } = holding;

			return holdingsTotal + transactions.reduce( ( transactionsTotal, transaction ) => {
				const { total } = transaction;

				return transactionsTotal + total;
			}, 0 );
		}, 0 );

		if ( fractionDigits ) {
			return parseFloat( total.toFixed( fractionDigits ) );
		}

		return total;
	}, [ realm, account ] );

	const getTransfersAmount = useCallback( ( fractionDigits?: number ) => {
		const transfersAmount = account?.transfers.reduce( ( amount, transfer ) => {
			return amount + transfer.amount
		}, 0 );

		return transfersAmount;
	}, [ realm, account ] );

	const getBalance = useCallback( ( fractionDigits?: number ) => {
		const total = getTotal();
		const transfersAmount = getTransfersAmount();

		const balance = transfersAmount - total;

		if ( fractionDigits ) {
			return parseFloat( balance.toFixed( fractionDigits ) );
		}

		return balance;
	}, [ realm, account] );

	const getValue = useCallback( ( fractionDigits?: number ) => {
		const balance = getBalance();
		const value = account?.holdings.reduce( ( totalValue, holding ) => {
			const { transactions } = holding;
		
			// Get latest price
			const latestTransaction = transactions?.reduce( ( latest, current ) => {
				return ! latest || current.date > latest.date
					? current
					: latest;
		  } );
			const price = latestTransaction?.price ?? 0;
		
			// Get amount
			const amount = transactions.reduce( ( totalAmount, transaction ) => {
				const { amount } = transaction;
				return totalAmount + amount;
			}, 0 );
		
			return totalValue + ( price * amount );
		}, balance); 

		if ( fractionDigits ) {
			return parseFloat( value.toFixed( fractionDigits ) );
		}

		return value;
	}, [ realm, account ] );

	return {
		account, saveAccount, removeAccount,
		addHolding, getHoldingById, getHoldingByName,
		addTransaction,
		addTransfer, getTransferById,
		getBalance, getValue
	}
}