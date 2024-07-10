import { useLayoutEffect } from "react";

import { Account } from "../models/Account"
import { useData } from "../contexts/DataContext";
import { generateChecksum, getDateMap, getTransactionEndOfDayTimestamp } from "../helpers";
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
			dividendAmount: 0,
			valueHistoryData: [] as DataPoint[],
			//returnHistoryData: [] as DataPoint[],
		};

		const transactionsResult = sortedTransactions.reduce(( acc, transaction ) => {
			const date = getTransactionEndOfDayTimestamp( transaction );
			const { amount, sub_type } = transaction;
	
			acc.cashAmount += amount;
	
			if ( sub_type === 'dividend') {
				acc.dividendAmount += amount;
				//acc.returnHistoryData.push({ date, value: acc.dividendAmount });
			}
			
			const existingDateIndex = acc.valueHistoryData.findIndex( dataPoint => {
				return dataPoint.date === date;
			});

			const dataPoint = {
				date,
				value: acc.cashAmount,
			}

			if ( existingDateIndex !== -1 ) {
				acc.valueHistoryData[ existingDateIndex ] = dataPoint;
			} else  {
				acc.valueHistoryData.push( dataPoint );
			}

			return acc;
		}, transactionsInitial );

		const holdingsInitial = {
			total: 0,
			value: 0,
			returnHistoryData: [] as DataPoint[][],
		};

		const holdingsResult = holdings.reduce(( acc, holding ) => {
			acc.total += holding.total;
			acc.value += holding.value;
			acc.returnHistoryData.push([ ...holding.returnHistoryData ]);

			return acc;
		}, holdingsInitial);


		const valueHistoryDataset = [
			transactionsResult.valueHistoryData,
			...holdingsResult.returnHistoryData
		];

		const dateMap = getDateMap( ...valueHistoryDataset );

		const valueHistoryData = dateMap.reduce(( acc, date ) => {
			let value = 0;

			valueHistoryDataset.forEach( valueHistoryData => {
				[ ...valueHistoryData ].forEach( currentDataPoint => {
					const nextDateDataPoint = valueHistoryData.find( dataPoint => dataPoint.date >= date );

					if (
						nextDateDataPoint &&
						currentDataPoint.date < date &&
						nextDateDataPoint.date <= date
					) {
						valueHistoryData.shift();
						return;
					}

					if (
						currentDataPoint &&
						currentDataPoint.date <= date
					) {
						value += currentDataPoint.value;
					}
				});
			});

			acc.push({ date, value });

			return acc
		}, [] as DataPoint[]);

		const total = holdingsResult.total;
		const cashAmount = transactionsResult.cashAmount;
		const balance = cashAmount - total;
		const value = holdingsResult.value + balance;
		const returnValue = value + transactionsResult.dividendAmount - balance - total;
		const returnPercentage = total ? (returnValue / Math.abs(total)) * 100 : 0;
		const sortedValueHistoryData = valueHistoryData.sort( SortingTypes.oldestFirst.function );
		//const sortedReturnHistoryData = returnHistoryData.sort( SortingTypes.oldestFirst.function );

		updateVariables( account, {
			total,
			cashAmount,
			balance,
			value,
			returnValue,
			returnPercentage,
			valueHistoryData: sortedValueHistoryData,
			//returnHistoryData: sortedReturnHistoryData,
			checksum
		} );
	}, [ checksum ]);
}