import { __ } from "../localization";
import { Color } from "./colors";
import { Ionicons } from '@expo/vector-icons';

interface Type {
  id: string;
  name: string;
  color?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

// TODO: siirrä typet niiden hookkeihin
export const TransactionTypes: Type[] = [
	{
		id: 'buy',
		name: __( 'Buy' ),
		color: Color.success,
		icon: 'enter-outline',
	},
	{
		id: 'sell',
		name: __( 'Sell' ),
		color: Color.error,
		icon: 'exit-outline',
	}
];

export const TransferTypes: Type[] = [
	{
		id: 'deposit',
		name: __( 'Deposit' ),
		color: Color.success,
		icon: 'enter-outline',
	},
	{
		id: 'withdrawal',
		name: __( 'Withdrawal' ),
		color: Color.error,
		icon: 'exit-outline',
	},
	{
		id: 'dividend',
		name: __( 'Dividend' ),
		color: Color.fallbackSourceColor,
		icon: 'cash-outline',
	}
];

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