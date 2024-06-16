import { useCallback, useMemo } from "react";
import { useRealm } from "@realm/react"

import Realm from "realm";
import { confirmation } from "../helpers";
import { useAccount } from "./useAccount";
import { Holding } from "../models/Holding";
import { useI18n } from "../components/contexts/I18nContext";
import { Cash } from "./useTypes";

interface useHoldingProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const useHolding = ( { _id, account_id }: useHoldingProps ) => {
	const { __ } = useI18n();
	const realm = useRealm();
	const { account, getHoldingById, addTransaction } = useAccount( { id: account_id } );
	const holding = useMemo( () => {
		return getHoldingById( _id );
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

	const getTransactionById = useCallback( ( id: Realm.BSON.UUID ) => {
		const transaction = transactions
			.filtered( '_id == $0', id )[0];
		return transaction;
	}, [ holding ] );

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
				}
			} );
		} );
	}, [ holding, account ] );

	// Variables

	const lastTransaction = useMemo( () => {
		return transactions?.sorted( 'date', true )[0];
	}, [ transactions ] );

	const lastAdjustment = useMemo( () => {
		return transactions?.sorted( 'date', true )
			.find( transaction => transaction.total === undefined );
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
			if ( lastAdjustment?.isValid() && transaction.date <= lastAdjustment.date ) {
				return amount;
			}

			return amount + transaction.amount;
		}, lastAdjustment?.isValid() ? lastAdjustment.amount : 0 );
	
		return amount;
	}, [ transactions, lastAdjustment ] );

	const transactionSum = useMemo( () => {
		const sum = transactions.reduce( ( sum, transaction ) => {
			return sum + transaction.price * transaction.amount;
		}, 0 );

		return sum;
	}, [ transactions ] );

	const total = useMemo( () => {
		const total = transactions.reduce( ( total, transaction ) => {
			return total + transaction.total;
		}, 0 );

		return total;
	}, [ transactions ])

	const dividendSum = useMemo( () => {
		const sum = dividends.reduce( ( sum, dividend ) => {
			return sum + dividend.amount
		}, 0 );

		return sum
	}, [ dividends ] );

	const fees = total - transactionSum;
	const averagePrice = amount ? transactionSum / amount : 0;
	const averageValue = averagePrice * amount;
	const value = lastPrice * amount;
	const returnValue = value - total;
	const returnPercentage = value
		? ( value - total ) / Math.abs( total ) * 100
		: 0;

	return {
		holding, saveHolding, removeHolding,
		account,
		transactions, addTransaction, getTransactionById,
		dividends,
		value, amount, total, fees,
		transactionSum, dividendSum,
		lastTransaction, lastAdjustment, lastPrice,
		averagePrice, averageValue,
		returnValue, returnPercentage
	}
}