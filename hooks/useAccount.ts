import React, { useCallback, useMemo } from "react";
import Realm from "realm";
import { useObject, useQuery, useRealm, useUser } from "@realm/react"
import { router } from "expo-router";

import { Account } from "../models/Account"
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { Transaction } from "../models/Transaction";
import { Transfer } from "../models/Transfer";

interface useAccountProps {
	id: Realm.BSON.ObjectID
}

export const useAccount = ( { id }: useAccountProps ) => {
	const user: Realm.User = useUser();
	const realm = useRealm();
	const account = useQuery<Account>( 'Account' )
		.filtered( '_id == $0', id )[0];

	const getHoldingId = useCallback( ( name: string ) => {
		return account?.holdings.findIndex( holding => {
			return name === holding.name;
		} );
	}, [ realm, account ] );

	const getHoldingById = useCallback( ( id: number ) => {
		const holding = account?.holdings[ id ];
		return holding;
	}, [ realm, account ] );

	const getHolding = useCallback( ( name: string ) => {
		const existingHolding = account?.holdings[ getHoldingId( name ) ];

		if ( ! existingHolding ) {
			account?.holdings.push( {
				name,
				owner_id: user.id,
				account_id: account?._id
			} );

			return account?.holdings[ account?.holdings.length - 1 ];
		}

		return existingHolding;
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
						const holding = getHolding( transaction.holding_name );

						holding.transactions.push( transaction );

						return holding.transactions[ holding.transactions.length - 1 ];
					} ) );
				}
			} );
		} );
	}, [] );

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
						transfer.holding_name && getHolding( transfer.holding_name );
						account.transfers.push( transfer );
						
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
		getHoldingId, getHoldingById, getHolding,
		addTransaction,
		addTransfer,
		getBalance, getValue
	}
}