import { Ionicons } from '@expo/vector-icons';

import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';

export interface TransactionType {
	id: string;
	name: string;
	color?: string;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export interface Transaction extends TransactionType {
	id: 'trading' | 'cash' | 'adjustment'
}

export interface Trading extends TransactionType {
	id: 'buy' | 'sell'
}

export interface Cash extends TransactionType {
	id: 'deposit' | 'withdrawal' | 'dividend'
}

export interface Adjustment extends TransactionType {
	id: 'stockSplit' | 'merger' | 'priceUpdate' | 'amountUpdate' | 'update'
}

export interface SortingType {
	name: string,
	function: ( a: any, b: any ) => number
}

export interface IntervalType {
	id: 'daily' | 'weekly' | 'monthly' | 'yearly',
	name: string,
	unit: string,
}

export const useTypes = () => {
	const { theme } = useTheme();
	const { __ } = useI18n();

	const TransactionTypes: Transaction[] = [
		{
			id: 'trading',
			name: __( 'Trading' ),
			color: theme.colors.primary,
			icon: 'pricetag-outline'
		},
		{
			id: 'cash',
			name: __( 'Cash' ),
			color: theme.colors.primary,
			icon: 'cash-outline'
		},
		{
			id: 'adjustment',
			name: __( 'Adjustment' ),
			color: theme.colors.primary,
			icon: 'options'
		}
	];

	const TradingTypes: Trading[] = [
		{
			id: 'buy',
			name: __( 'Buy' ),
			color: theme.colors.success,
			icon: 'enter-outline',
		},
		{
			id: 'sell',
			name: __( 'Sell' ),
			color: theme.colors.error,
			icon: 'exit-outline',
		},
	];

	const CashTypes: Cash[] = [
		{
			id: 'deposit',
			name: __( 'Deposit' ),
			color: theme.colors.success,
			icon: 'enter-outline',
		},
		{
			id: 'withdrawal',
			name: __( 'Withdrawal' ),
			color: theme.colors.error,
			icon: 'exit-outline',
		},
		{
			id: 'dividend',
			name: __( 'Dividend' ),
			color: theme.colors.primary,
			icon: 'cash-outline',
		}
	];

	const AdjustmentTypes: Adjustment[] = [
		{
			id: 'stockSplit',
			name: __( 'Stock Split' ),
			color: theme.colors.tertiary
		},
		{
			id: 'merger',
			name: __( 'Merger' ),
			color: theme.colors.tertiary
		},
		{
			id: 'priceUpdate',
			name: __( 'Price Update' ),
			color: theme.colors.tertiary
		},
		{
			id: 'amountUpdate',
			name: __( 'Amount Update' ),
			color: theme.colors.tertiary
		},
		{
			id: 'update',
			name: __( 'Update' ),
			color: theme.colors.tertiary
		}
	];

	const SortingTypes = {
		newestFirst: {
			name: __( 'Newest first' ),
			function: ( a: any, b: any ) => b.date - a.date
		},	
		oldestFirst: {
			name: __( 'Oldest first' ),
			function: ( a: any, b: any ) => a.date - b.date
		},
		name: {
			name: __( 'Name (A-Z)' ),
			function: ( a: any, b: any ) => a.name.localeCompare( b.name )
		},
		highestReturn: {
			name: __( 'Highest return' ),
			function: ( a: any, b: any ) => b.returnValue - a.returnValue
		},
		lowestReturn: {
			name: __( 'Lowest return' ),
			function: ( a: any, b: any ) => a.returnValue - b.returnValue
		},
		highestValue: {
			name: __( 'Highest value' ),
			function: ( a: any, b: any ) => b.value - a.value
		}
	}

	const IntervalTypes: IntervalType[] = [
		{
			id: 'daily',
			name: __( 'Daily' ),
			unit: 'D'
		},
		{
			id: 'weekly',
			name: __( 'Weekly' ),
			unit: 'W'
		},
		{
			id: 'monthly',
			name: __( 'Monthly' ),
			unit: 'M'
		},
		{
			id: 'yearly',
			name: __( 'Yearly' ),
			unit: 'Y'
		}
	]

	return {
		TransactionTypes,
		TradingTypes,
		CashTypes,
		AdjustmentTypes,
		SortingTypes,
		IntervalTypes
	}
}