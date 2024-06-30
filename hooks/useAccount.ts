import { useEffect, useMemo } from "react";

import { Account } from "../models/Account"
import { useData } from "../contexts/DataContext";
import { generateChecksum } from "../helpers";

interface useAccountProps {
	account: Account
}

export const useAccount = ( { account }: useAccountProps ) => {
	const { updateVariables } = useData();
	
	if ( ! account?.isValid() ) return;

	const { transactions, holdings } = account;
	const checksum = generateChecksum( JSON.stringify( account ));

	useEffect(() => {
		const holdingsInitial = {
			total: 0,
			dividendSum: 0,
			value: 0
		};

		const holdingsResult = holdings.reduce((acc, holding) => {
			acc.total += holding.total;
			acc.dividendSum += holding.dividendSum;
			acc.value += holding.value;
			return acc;
		}, holdingsInitial);

		const transactionsInitial = {
			cashAmount: 0
		};

		const transactionsResult = transactions.reduce((acc, transaction) => {
			if (transaction.type === 'cash') {
				acc.cashAmount += transaction.amount;
			}
			return acc;
		}, transactionsInitial);

		const total = holdingsResult.total;
		const dividendSum = holdingsResult.dividendSum;
		const cashAmount = transactionsResult.cashAmount + dividendSum;
		const balance = cashAmount - total;
		const value = holdingsResult.value + balance;
		const returnValue = value - balance - total;
		const returnPercentage = value ? (returnValue / Math.abs(total)) * 100 : 0;

		updateVariables( account, {
			total,
			cashAmount,
			balance,
			value,
			returnValue,
			returnPercentage
		} );
	}, [ checksum ]);
}