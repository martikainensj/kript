import { Ionicons } from '@expo/vector-icons';

interface TransactionCategoryProps {
	id: string;
	name: string;
	color?: string;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export type TransactionCategoryKey =
	| 'trading'
	| 'cash'
	| 'adjustment'
	| 'loan';

export interface TransactionCategory extends TransactionCategoryProps {
	id: TransactionCategoryKey;
}

export type TradingCategoryKey =
	| 'buy'
	| 'sell';

export interface TradingCategory extends TransactionCategoryProps {
	id: TradingCategoryKey;
}

export type CashCategoryKey =
	| 'deposit'
	| 'withdrawal'
	| 'dividend';

export interface CashCategory extends TransactionCategoryProps {
	id: CashCategoryKey;
}

export type AdjustmentCategoryKey =
	| 'stockSplit' 
	| 'merger'
	| 'priceUpdate'
	| 'amountUpdate'
	| 'update';

export interface AdjustmentCategory extends TransactionCategoryProps {
	id: AdjustmentCategoryKey;
}

export type LoanCategoryKey =
	| 'disbursement'
	| 'repayment';

export interface LoanCategory extends TransactionCategoryProps {
	id: LoanCategoryKey;
}

export interface SortingProps {
	id: string;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
	name: string;
	function: (a: any, b: any) => number;
}