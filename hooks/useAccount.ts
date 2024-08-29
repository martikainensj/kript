import { useLayoutEffect } from "react";

import { Account } from "../models/Account"
import { useData } from "../contexts/DataContext";
import { buildChartData, generateChecksum, getTransactionEndOfDayTimestamp } from "../helpers";
import { DataPoint } from "../models/DataPoint";
import { useTypes } from "./useTypes";

interface useAccountProps {
	account: Account
}

export const useAccount = ( { account }: useAccountProps ) => {
	const { updateVariables } = useData();
	const { SortingTypes } = useTypes();
	
	if ( ! account?.isValid() ) return;

	const { transactions, holdings } = account;
	const checksum = generateChecksum({
		transactions,
		holdings
	});

	useLayoutEffect(() => {
		if ( account.checksum === checksum ) {
			return;
		}

		// Transactions in ascending order by date
		const sortedTransactions = transactions.sorted('date');

		const transactionsInitial = {
			cashAmount: 0,
			loanAmount: 0,
			dividendAmount: 0,
			valueHistoryData: [] as Account['valueHistoryData'],
			returnHistoryData: [] as Account['returnHistoryData'],
			loanHistoryData: [] as Account['loanHistoryData'],
			dividendHistoryData: [] as Account['dividendHistoryData'],
		};

		const transactionsResult = sortedTransactions.reduce(( acc, transaction ) => {
			const date = getTransactionEndOfDayTimestamp( transaction );
			const { amount, total, type, sub_type } = transaction;
	
			if ( type === 'loan' ) {
				if ( sub_type === 'repayment' ) {
					acc.cashAmount -= total;
					acc.loanAmount -= amount;
				} else if ( sub_type === 'disbursement' ) {
					acc.cashAmount += amount;
					acc.loanAmount += amount;
				}

				const existingDateIndex = acc.loanHistoryData.findIndex( dataPoint => {
					return dataPoint.date === date;
				});

				const dataPoint = {
					date,
					value: acc.loanAmount,
				}

				if ( existingDateIndex !== -1 ) {
					acc.loanHistoryData[ existingDateIndex ] = dataPoint;
				} else {
					acc.loanHistoryData.push( dataPoint );
				}
			} else {
				acc.cashAmount += amount;
			}
	
			if ( sub_type === 'dividend' ) {
				acc.dividendAmount += amount;

				const existingDateIndex = acc.dividendHistoryData.findIndex( dataPoint => {
					return dataPoint.date === date;
				});

				const dataPoint = {
					date,
					value: acc.dividendAmount,
				}

				if ( existingDateIndex !== -1 ) {
					acc.dividendHistoryData[ existingDateIndex ] = dataPoint;
				} else {
					acc.dividendHistoryData.push( dataPoint );
				}
			}
			
			const existingDateIndex = acc.valueHistoryData.findIndex( dataPoint => {
				return dataPoint.date === date;
			});

			const dataPoint = {
				date,
				value: acc.cashAmount - acc.loanAmount,
			}

			if ( existingDateIndex !== -1 ) {
				acc.valueHistoryData[ existingDateIndex ] = dataPoint;
			} else  {
				acc.valueHistoryData.push( dataPoint );
			}

			acc.returnHistoryData = [ ...acc.dividendHistoryData ];
			
			return acc;
		}, transactionsInitial );

		const holdingsInitial = {
			total: 0,
			value: 0,
			returnHistoryData: [] as DataPoint[][],
			feesHistoryData: [] as DataPoint[][],
		};

		const holdingsResult = holdings.reduce(( acc, holding ) => {
			acc.total += holding.total;
			acc.value += holding.value;
			acc.returnHistoryData.push([ ...holding.returnHistoryData ]);
			acc.feesHistoryData.push([ ...holding.feesHistoryData ]);

			return acc;
		}, holdingsInitial);

		const valueHistoryDataset = [
			transactionsResult.valueHistoryData,
			...holdingsResult.returnHistoryData
		];

		const valueHistoryData = buildChartData( valueHistoryDataset );

		const returnHistoryDataset = [
			transactionsResult.returnHistoryData,
			...holdingsResult.returnHistoryData
		];

		const returnHistoryData = buildChartData( returnHistoryDataset );

		const total = holdingsResult.total;
		const cashAmount = transactionsResult.cashAmount;
		const loanAmount = transactionsResult.loanAmount;
		const balance = cashAmount - total;
		const value = holdingsResult.value + balance - loanAmount;
		const returnValue = value + transactionsResult.dividendAmount - balance + loanAmount - total;
		const returnPercentage = total ? (returnValue / Math.abs(total)) * 100 : 0;
		const sortedValueHistoryData = valueHistoryData.sort( SortingTypes.oldestFirst.function );
		const sortedReturnHistoryData = returnHistoryData.sort( SortingTypes.oldestFirst.function );
		const sortedLoanHistoryData = transactionsResult.loanHistoryData.sort( SortingTypes.oldestFirst.function );
		const sortedDividendHistoryData = transactionsResult.dividendHistoryData.sort( SortingTypes.oldestFirst.function );

		updateVariables( account, {
			total,
			cashAmount,
			loanAmount,
			balance,
			value,
			returnValue,
			returnPercentage,
			valueHistoryData: sortedValueHistoryData,
			returnHistoryData: sortedReturnHistoryData,
			loanHistoryData: sortedLoanHistoryData,
			dividendHistoryData: sortedDividendHistoryData,
			checksum
		} );
	}, [ checksum ]);
}