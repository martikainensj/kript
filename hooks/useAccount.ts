import { useEffect, useMemo } from "react";

import { Account } from "../models/Account"
import { useData } from "../contexts/DataContext";

interface useAccountProps {
	account: Account
}

export const useAccount = ( { account }: useAccountProps ) => {
	const { updateVariables } = useData();
	
	if ( ! account?.isValid() ) return;

	const { transactions, holdings } = account;

	// Variables

	const total = useMemo( () => {
		const total = holdings.reduce( ( total, holding ) => {
			return total + holding.total;
		}, 0 );

		return total;
	}, [ holdings ] );

	const dividendSum = useMemo( () => {
		const dividendSum = holdings.reduce( ( dividendSum, holding ) => {
			return dividendSum + holding.dividendSum;
		}, 0 );

		return dividendSum;
	}, [ holdings ]);

	const cashAmount = useMemo( () => {
		const cashAmount = transactions.reduce( ( cashAmount, transaction ) => {
			if ( transaction.type !== 'cash' ) {
				return cashAmount;
			}

			return cashAmount + transaction.amount
		}, dividendSum );

		return cashAmount;
	}, [ transactions, dividendSum ] );

	const balance = cashAmount - total;

	const value = useMemo( () => {
		const value = holdings.reduce( ( value, holding ) => {
			return value + holding.value;
		}, balance );

		return value;
	}, [ holdings ] );

	const returnValue = value - balance - total;
	const returnPercentage = value
		? ( value - balance - total ) / Math.abs( total ) * 100
		: 0;

	useEffect( () => {
		updateVariables( account, {
			total,
			cashAmount,
			balance,
			value,
			returnValue,
			returnPercentage
		} );
	}, [ account ] );
}