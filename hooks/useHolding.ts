import { useEffect, useMemo } from "react";

import { Holding } from "../models/Holding";
import { Transaction } from "./useTypes";
import { useData } from "../contexts/DataContext";

interface useHoldingProps {
	holding: Holding
}

export const useHolding = ( { holding }: useHoldingProps ) => {
    const { updateVariables } = useData();

    if ( ! holding?.isValid() ) return;

    const { transactions } = holding;

	const lastTransaction = useMemo( () => {
		return transactions?.filtered( 'type == $0', 'trading' as Transaction['id'] )
			.sorted( 'date', true )[0];
	}, [ transactions ] );

	const lastAdjustment = useMemo( () => {
		return transactions?.filtered( 'type == $0', 'adjustment' as Transaction['id'] )
			.sorted( 'date', true )[0];
	}, [ transactions ] );

    const dividends = useMemo( () => {
        return transactions?.filtered( 'sub_type == $0', 'dividend' as Transaction['id'] );
    }, [ transactions] );

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
    const dividendSum = dividends.reduce( ( sum, dividend ) => sum + dividend.amount, 0 );
	const returnPercentage = value
		? ( value - total ) / Math.abs( total ) * 100
		: 0;

	useEffect( () => {
		updateVariables( holding, {
			lastPrice,
			amount,
            dividendSum,
			transactionSum,
			total,
			fees,
			averagePrice,
			averageValue,
			value,
			returnValue,
			returnPercentage, 
		} );
	}, [ transactions, lastAdjustment, lastTransaction ] );
}