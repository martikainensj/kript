import { __ } from "../localization";
import { Color } from "./colors";
import { Ionicons } from '@expo/vector-icons';
import { Theme } from "./theme";

interface TransactionType {
  id: string;
  name: string;
  color?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export const TransactionTypes: TransactionType[] = [
	{
		id: 'buy',
		name: __( 'Buy' ),
		color: Theme.colors.success,
		icon: 'enter-outline'
	},
	{
		id: 'sell',
		name: __( 'Sell' ),
		color: Theme.colors.error,
		icon: 'exit-outline'
	}
];

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