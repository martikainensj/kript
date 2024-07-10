import { useLayoutEffect, useState } from "react";

import { Holding } from "../models/Holding";
import { useData } from "../contexts/DataContext";
import { generateChecksum, getTransactionEndOfDayTimestamp } from "../helpers";
import { DataPoint } from "../models/DataPoint";

interface useHoldingProps {
	holding: Holding
}

export const useHolding = ( { holding }: useHoldingProps ) => {
		const { updateVariables } = useData();

		if ( ! holding?.isValid() ) return;

		const { transactions } = holding;
		const checksum = generateChecksum({
			transactions
 		});

		useLayoutEffect(() => {
			if ( holding.checksum === checksum ) {
				return;
			}

			// Transactions in ascending order by date
			const sortedTransactions = transactions.sorted('date');

			const valueHistoryData = [] as DataPoint[];
			const returnHistoryData = [] as DataPoint[];

			const {
				lastPrice,
				amount,
				transactionSum,
				total,
			} = sortedTransactions.reduce(
				(acc, transaction) => {
					acc.lastPrice = transaction.price ?? acc.lastPrice;
		
					if ( transaction.type === 'trading' ) {
						acc.transactionSum += acc.lastPrice * transaction.amount;
						acc.total += transaction.total;
					}
		
					if ( transaction.type === 'adjustment' ) {
						acc.amount = transaction.amount;
					} else {
						acc.amount += transaction.amount;
					}

					const date = getTransactionEndOfDayTimestamp( transaction );
					const value = acc.amount * acc.lastPrice;
					const returnValue = value - acc.total;

					const existingDateIndex = valueHistoryData.findIndex( dataPoint => {
						return dataPoint.date === date;
					});

					if ( existingDateIndex !== -1 ) {
						valueHistoryData[ existingDateIndex ] = {
							date,
							value,
						};

						returnHistoryData[ existingDateIndex ] = {
							date,
							value: returnValue
						};

						return acc;
					}
					
					valueHistoryData.push({
						date,
						value,
					});

					returnHistoryData.push({
						date,
						value: returnValue
					});
		
					return acc;
				}, {
					lastPrice: 0,
					amount: 0,
					transactionSum: 0,
					total: 0,
				}
			);
		
			const fees = total - transactionSum;
			const averagePrice = amount ? transactionSum / amount : 0;
			const averageValue = averagePrice * amount;
			const value = lastPrice * amount;
			const returnValue = value - total;
			const returnPercentage = value ? ((value - total) / Math.abs(total)) * 100 : 0;

			updateVariables(holding, {
				lastPrice,
				amount,
				transactionSum,
				total,
				fees,
				averagePrice,
				averageValue,
				value,
				returnValue,
				returnPercentage,
				valueHistoryData,
				returnHistoryData,
				checksum
			});
		}, [ checksum ]);
	}