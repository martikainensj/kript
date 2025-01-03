import { useLayoutEffect } from "react";

import { Holding } from "./models/Holding";
import { useSorting } from "../data/useSorting";
import { useData } from "../data/DataContext";
import { generateChecksum, getTransactionEndOfDayTimestamp } from "../data/helpers";

interface useHoldingProps {
	holding: Holding
}

export const useHolding = ({ holding }: useHoldingProps) => {
	const { updateVariables, getAccountBy } = useData();
	const { SortingTypes } = useSorting();

	if (!holding?.isValid()) return;

	const { transactions } = holding;
	const account = getAccountBy('_id', holding.account_id);
	const dividends = account.transactions.filtered(`holding_name == $0`, holding.name);

	const checksum = generateChecksum({
		transactions,
		dividends
	});

	const calculateVariables = () => {
		const sortedTransactions = [
			...transactions,
			...dividends
		].sort(SortingTypes.oldestFirst.function);

		const initialData = {
			lastPrice: 0,
			amount: 0,
			transactionSum: 0,
			feesSum: 0,
			dividendSum: 0,
			total: 0,
			valueHistoryData: [] as Holding['valueHistoryData'],
			returnHistoryData: [] as Holding['returnHistoryData'],
			dividendHistoryData: [] as Holding['dividendHistoryData'],
			feesHistoryData: [] as Holding['feesHistoryData'],
		};

		const resultData = sortedTransactions.reduce((acc, transaction) => {
			const date = getTransactionEndOfDayTimestamp(transaction);

			const existingDateIndex = acc.valueHistoryData.findIndex(dataPoint => {
				return dataPoint.date === date;
			});

			if (transaction.sub_type === 'dividend') {
				acc.dividendSum += transaction.amount;

				if (existingDateIndex !== -1) {
					acc.dividendHistoryData[existingDateIndex] = {
						date,
						value: acc.dividendSum,
					};

					return acc;
				}

				acc.dividendHistoryData.push({
					date,
					value: acc.dividendSum,
				});

				return acc;
			}

			acc.lastPrice = transaction.price ?? acc.lastPrice;
			if (transaction.type === 'trading') {
				acc.transactionSum += acc.lastPrice * transaction.amount;
				acc.total += transaction.total;
			}

			if (transaction.type === 'adjustment') {
				acc.amount = transaction.amount;
			} else {
				acc.amount += transaction.amount;
			}
			acc.feesSum += transaction.total - (transaction.amount * transaction.price);

			const value = acc.amount * acc.lastPrice;
			const returnValue = value - acc.total;

			if (existingDateIndex !== -1) {
				acc.valueHistoryData[existingDateIndex] = {
					date,
					value,
				};

				acc.returnHistoryData[existingDateIndex] = {
					date,
					value: returnValue
				};

				acc.feesHistoryData[existingDateIndex] = {
					date,
					value: acc.feesSum
				}

				return acc;
			}

			acc.valueHistoryData.push({
				date,
				value,
			});

			acc.returnHistoryData.push({
				date,
				value: returnValue
			});

			acc.feesHistoryData.push({
				date,
				value: acc.feesSum
			});

			return acc;
		}, initialData);

		const { total, transactionSum, amount, lastPrice } = resultData;

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
			valueHistoryData: resultData.valueHistoryData,
			returnHistoryData: resultData.returnHistoryData,
			feesHistoryData: resultData.feesHistoryData,
			checksum
		});
	}

	useLayoutEffect(() => {
		if (holding.checksum === checksum) {
			return;
		}

		calculateVariables();
	}, [checksum]);
}