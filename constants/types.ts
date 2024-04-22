import { Color } from "./colors";

export const TransactionTypes = {
	buy: {
		id: 'buy',
		name: 'Buy',
		color: Color.success
	},
	sell: {
		id: 'sell',
		name: 'Sell',
		color: Color.failure
	}
};

export const TransferTypes = {
	deposit: {
		id: 'deposit',
		name: 'Deposit',
		color: Color.success
	},
	withdrawal: {
		id: 'withdrawal',
		name: 'Withdrawal',
		color: Color.failure
	},
	dividend: {
		id: 'dividend',
		name: 'Dividend',
		color: Color.accent
	}
};

export const HoldingUpdateTypes = {
	stockSplit: {
		id: 'stockSplit',
		name: 'Stock Split',
		color: Color.grey
	},
	merger: {
		id: 'merger',
		name: 'Merger',
		color: Color.grey
	},
	priceUpdate: {
		id: 'priceUpdate',
		name: 'Price Update',
		color: Color.grey
	},
	amountUpdate: {
		id: 'amountUpdate',
		name: 'Amount Update',
		color: Color.grey
	},
	holdingAdjustment: {
		id: 'holdingAdjustment',
		name: 'Holding Adjustment',
		color: Color.grey
	}
}