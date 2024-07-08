import { useLayoutEffect, useState } from "react";

import { Holding } from "../models/Holding";
import { Transaction } from "./useTypes";
import { useData } from "../contexts/DataContext";
import { generateChecksum } from "../helpers";
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

			const valueHistoryData = [] as DataPoint[];
			const returnHistoryData = [] as DataPoint[];

			const lastTransaction = transactions
				?.filtered('type == $0', 'trading' as Transaction['id'])
				.sorted('date', true)[0];
		
			const lastAdjustment = transactions
				?.filtered('type == $0', 'adjustment' as Transaction['id'])
				.sorted('date', true)[0];
		
			const lastPrice = (() => {
				if (lastAdjustment?.isValid() && lastTransaction?.isValid()) {
					return lastAdjustment.date > lastTransaction.date
						? lastAdjustment.price
						: lastTransaction.price;
				}
		
				if (lastAdjustment?.isValid()) {
					return lastAdjustment.price;
				}
		
				if (lastTransaction?.isValid()) {
					return lastTransaction.price;
				}
		
				return 0;
			})();
		
			const initialAmount = lastAdjustment?.isValid() ? lastAdjustment.amount : 0;
		
			const {
				amount,
				transactionSum,
				total,
				dividendSum
			} = transactions.reduce(
				(acc, transaction) => {
					if (transaction.type === 'cash') {
						if (transaction.sub_type === 'dividend') {
							acc.dividendSum += transaction.amount;
						}

						return acc;
					}
		
					if (transaction.type === 'trading') {
						acc.transactionSum += transaction.price * transaction.amount;
						acc.total += transaction.total;
					}
		
					if (lastAdjustment?.isValid() && transaction.date <= lastAdjustment.date) {
						acc.amount = lastAdjustment.amount;
					} else {
						acc.amount += transaction.amount;
					}

					const value = acc.amount * transaction.price;
					const returnValue = value - acc.total;
					
					valueHistoryData.push({
						date: transaction.date,
						value: value
					});

					returnHistoryData.push({
						date: transaction.date,
						value: returnValue
					});
		
					return acc;
				},
				{ amount: initialAmount, transactionSum: 0, total: 0, dividendSum: 0 }
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
				dividendSum,
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