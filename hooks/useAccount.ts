import React, { useCallback, useMemo } from "react";
import Realm from "realm";
import { useObject, useRealm, useUser } from "@realm/react"
import { router } from "expo-router";

import { Account } from "../models/Account"
import { confirmation } from "../helpers";
import { __ } from "../localization";
import { Transaction } from "../models/Transaction";

interface useAccountProps {
	id: Realm.BSON.ObjectID
}

export const useAccount = ( { id }: useAccountProps ) => {
	const user: Realm.User = useUser();
	const realm = useRealm();
	const account = useObject<Account>( 'Account', id );

	const {
		_id,
		name,
		owner_id,
		holdings,
		notes,
		transfers,
	} = useMemo( () => account, [ account ] );

	const getHoldingId = useCallback( ( name: string ) => {
		return holdings.findIndex( holding => {
			return name === holding.name;
		} );
	}, [ realm ] );

	const getHolding = useCallback( ( name: string ) => {
		const existingHolding = holdings[ getHoldingId( name ) ];

		if ( ! existingHolding ) {
			holdings.push( {
				name,
				owner_id: user.id,
				account_id: _id
			} );

			return holdings[ holdings.length - 1 ];
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
		const total = holdings.reduce( ( holdingsTotal, holding ) => {
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
	}, [ account ] );

	const getTransfersAmount = useCallback( ( fractionDigits?: number ) => {
		const transfersAmount = transfers.reduce( ( amount, transfer ) => {
			return amount + transfer.amount
		}, 0 );

		return transfersAmount;
	}, [ account ] );

	const getBalance = useCallback( ( fractionDigits?: number ) => {
		const total = getTotal();
		const transfersAmount = getTransfersAmount();

		const balance = transfersAmount - total;

		if ( fractionDigits ) {
			return parseFloat( balance.toFixed( fractionDigits ) );
		}

		return balance;
	}, [ account] );

	const getValue = useCallback( ( fractionDigits?: number ) => {
		const balance = getBalance();
		const value = holdings.reduce( ( totalValue, holding ) => {
			const { transactions } = holding;
		
			// Get latest price
			const { price } = transactions.reduce( ( latest, current ) => {
				return ! latest || current.date > latest.date
					? current
					: latest;
		  } );
		
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
	}, [ account ] );

	return {
		account, saveAccount, removeAccount,
		getHoldingId, getHolding,
		addTransaction,
		getBalance, getValue
	}
}