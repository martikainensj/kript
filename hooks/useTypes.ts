import { Ionicons } from '@expo/vector-icons';

import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { getYTD } from '../helpers';

export interface TransactionType {
	id: string;
	name: string;
	color?: string;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export interface Transaction extends TransactionType {
	id: 'trading' | 'cash' | 'adjustment' | 'loan'
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

export interface Loan extends TransactionType {
	id: 'disbursement' | 'repayment'
}

export interface SortingType {
	name: string,
	function: ( a: any, b: any ) => number
}

export type IntervalType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface TimeframeType {
	id: keyof TimeframeTypes,
	name: string,
	interval: IntervalType,
	range?: number
}

export interface TimeframeTypes {
	'1day': TimeframeType,
	'1week': TimeframeType,
	'1month': TimeframeType,
	'3month': TimeframeType,
	'ytd': TimeframeType,
	'1year': TimeframeType,
	'3year': TimeframeType,
	'5year': TimeframeType,
	'max': TimeframeType,
}

export const useTypes = () => {
	const { theme } = useTheme();
	const { __ } = useI18n();

	const TransactionTypes: Transaction[] = [
		{
			id: 'trading',
			name: __( 'Trading' ),
			color: theme.colors.primary,
			icon: 'swap-horizontal-outline'
		},
		{
			id: 'cash',
			name: __( 'Cash' ),
			color: theme.colors.primary,
			icon: 'swap-vertical-outline'
		},
		{
			id: 'adjustment',
			name: __( 'Adjustment' ),
			color: theme.colors.primary,
			icon: 'options'
		},
		{
			id: 'loan',
			name: __( 'Loan' ),
			color: theme.colors.primary,
			icon: 'cash-outline'
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

	const LoanTypes: Loan[] = [
		{
			id: 'repayment',
			name: __( 'Repayment' ),
			color: theme.colors.success,
			icon: 'push-outline',
		},
		{
			id: 'disbursement',
			name: __( 'Disbursement' ),
			color: theme.colors.error,
			icon: 'download-outline',
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

	const TimeframeTypes: TimeframeTypes = {
		'1day': {
			id: '1day',
			name: `1 ${ __( 'day' ) }`,
			interval: 'daily',
			range: 1
		},
		'1week': {
			id: '1week',
			name: `1 ${ __( 'week' ) }`,
			interval: 'daily',
			range: 7
		},
		'1month': {
			id: '1month',
			name: `1 ${ __( 'month' ) }`,
			interval: 'daily',
			range: 30
		},
		'3month': {
			id: '3month',
			name: `3 ${ __( 'month' ) }`,
			interval: 'daily',
			range: 90
		},
		'ytd': {
			id: 'ytd',
			name: __( 'YTD' ),
			interval: 'weekly',
			range: getYTD() / 7
		},
		'1year': {
			id: '1year',
			name: `1 ${ __( 'year' ) }`,
			interval: 'weekly',
			range: 52
		},
		'3year': {
			id: '3year',
			name: `3 ${ __( 'years' ) }`,
			interval: 'weekly',
			range: 156
		},
		'5year': {
			id: '5year',
			name: `5 ${ __( 'years' ) }`,
			interval: 'weekly',
			range: 260
		},
		'max': {
			id: 'max',
			name: __( 'Max' ),
			interval: 'monthly',
		},
	};

	return {
		TransactionTypes,
		TradingTypes,
		CashTypes,
		AdjustmentTypes,
		LoanTypes,
		SortingTypes,
		TimeframeTypes
	}
}