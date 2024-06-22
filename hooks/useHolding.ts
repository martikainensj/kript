import { useCallback, useEffect, useMemo } from "react";
import { useRealm } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { useAccount } from "./useAccount";
import { Holding, HoldingKey, HoldingValue } from "../models/Holding";
import { useI18n } from "../components/contexts/I18nContext";
import { Cash, Transaction } from "./useTypes";
import { TransactionKey, TransactionValue } from "../models/Transaction";

interface useHoldingProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const useHolding = ( { _id, account_id }: useHoldingProps ) => {
	const { __ } = useI18n();
	const realm = useRealm();
	const { account, getHoldingBy, addTransaction } = useAccount( { _id: account_id } );
	const holding = useMemo( () => {
		return getHoldingBy( '_id', _id );
	}, [ account ] );

	const { transactions, } = useMemo( () => {
		return {
			transactions: account?.transactions
				.filtered( 'holding_id == $0', holding?._id )
		}
	}, [ account, holding ] );

	const dividends = useMemo( () => {
		const dividends = transactions && transactions
			.filtered( 'sub_type == $0', 'dividend' as Cash['id'] );

		return dividends;
	}, [ transactions ] );

	const getTransactionBy = useCallback( <K extends TransactionKey>( key: K, value: TransactionValue<K> ) => {
		const transaction = account?.transactions
			.filtered( `${key} == $0`, value )[0];

		return transaction;
	}, [ account ] );

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
						const index = account.holdings.findIndex( holding => {
							return holding._id.equals( _id );
						} );

						account.holdings.remove( index );
						// TODO handle holdings transactio nremove
						// Tää korjautuu sillä ku siirretään trading transactionit holdignin alle
					} ) )
				}
			} );
		} );
	}, [ holding, account ] );

	const updateVariables = useCallback( ( variables: Partial<Record<HoldingKey, HoldingValue<HoldingKey>>> ) => {
			const hasChanges = variables && Object.keys( variables )
				.some( key => holding[ key ] !== variables[ key ] );
				
			if ( ! hasChanges ) return;

			realm.write( () => {
				Object.entries( variables ).forEach( ( [ key, value ] ) => {
					holding[ key ] = value;
				} );
			} );
		}, [ realm, holding ]
	);

	// Variables

	const lastTransaction = useMemo( () => {
		return transactions?.filtered( 'type == $0', 'trading' as Transaction['id'] )
			.sorted( 'date', true )[0];
	}, [ transactions ] );

	const lastAdjustment = useMemo( () => {
		return transactions?.filtered( 'type == $0', 'adjustment' as Transaction['id'] )
			.sorted( 'date', true )[0];
	}, [ transactions ] );

	const lastPrice = useMemo( () => {
		if ( lastAdjustment?.isValid() && lastTransaction?.isValid() ) {
			return lastAdjustment.date > lastTransaction.date
				? lastAdjustment.price
				: lastTransaction.price;
		}
	
		if ( lastAdjustment?.isValid() ) {
			return lastAdjustment.price;
		}
	
		if ( lastTransaction?.isValid() ) {
			return lastTransaction.price;
		}
	
		return 0;
	}, [ lastTransaction, lastAdjustment ] );

	const amount = useMemo( () => {
		const amount = transactions.reduce( ( amount, transaction ) => {
			if ( transaction.type === 'cash' ) {
				return amount;
			}

			if ( lastAdjustment?.isValid() && transaction.date <= lastAdjustment.date ) {
				return lastAdjustment.amount;
			}

			return amount + transaction.amount;
		}, lastAdjustment?.isValid() ? lastAdjustment.amount : 0 );
	
		return amount;
	}, [ transactions, lastAdjustment ] );

	const transactionSum = useMemo( () => {
		const sum = transactions.reduce( ( sum, transaction ) => {
			if ( transaction.type !== 'trading' ) {
				return sum;
			}
			
			return sum + transaction.price * transaction.amount;
		}, 0 );

		return sum;
	}, [ transactions ] );

	const total = useMemo( () => {
		const total = transactions.reduce( ( total, transaction ) => {
			if ( transaction.type !== 'trading' ) {
				return total;
			}
			
			return total + transaction.total;
		}, 0 );

		return total;
	}, [ transactions ])

	const fees = total - transactionSum;
	const averagePrice = amount ? transactionSum / amount : 0;
	const averageValue = averagePrice * amount;
	const value = lastPrice * amount;
	const returnValue = value - total;
	const returnPercentage = value
		? ( value - total ) / Math.abs( total ) * 100
		: 0;

	const dividendSum = useMemo( () => {
		const sum = dividends.reduce( ( sum, dividend ) => {
			return sum + dividend.amount
		}, 0 );

		return sum;
	}, [ dividends ] );

	useEffect( () => {
		updateVariables( {
			lastPrice,
			amount,
			transactionSum,
			total,
			fees,
			averagePrice,
			averageValue,
			value,
			returnValue,
			returnPercentage
		} );
	}, [ transactions, lastAdjustment, lastTransaction ] );

	useEffect( () => {
		updateVariables( {
			dividendSum
		} );
	}, [ dividends ] );

	return {
		holding, saveHolding, removeHolding,
		account,
		transactions, addTransaction, getTransactionBy,
		dividends,
		lastTransaction, lastAdjustment
	}
}