import { useI18n } from "../i18n/I18nContext";
import { useTheme } from "../theme/ThemeContext";
import { AdjustmentCategory, CashCategory, LoanCategory, TradingCategory, TransactionCategory } from "./types";


export const useCategories = () => {
	const { theme } = useTheme();
	const { __ } = useI18n();

	const TransactionCategories: TransactionCategory[] = [
		{
			id: 'trading',
			name: __('Trading'),
			color: theme.colors.primary,
			icon: 'swap-horizontal-outline'
		},
		{
			id: 'cash',
			name: __('Cash'),
			color: theme.colors.primary,
			icon: 'swap-vertical-outline'
		},
		{
			id: 'adjustment',
			name: __('Adjustment'),
			color: theme.colors.primary,
			icon: 'options'
		},
		{
			id: 'loan',
			name: __('Loan'),
			color: theme.colors.primary,
			icon: 'cash-outline'
		}
	];

	const TradingCategories: TradingCategory[] = [
		{
			id: 'buy',
			name: __('Buy'),
			color: theme.colors.success,
			icon: 'enter-outline',
		},
		{
			id: 'sell',
			name: __('Sell'),
			color: theme.colors.error,
			icon: 'exit-outline',
		},
	];

	const CashCategories: CashCategory[] = [
		{
			id: 'deposit',
			name: __('Deposit'),
			color: theme.colors.success,
			icon: 'enter-outline',
		},
		{
			id: 'withdrawal',
			name: __('Withdrawal'),
			color: theme.colors.error,
			icon: 'exit-outline',
		},
		{
			id: 'dividend',
			name: __('Dividend'),
			color: theme.colors.primary,
			icon: 'cash-outline',
		}
	];

	const AdjustmentCategories: AdjustmentCategory[] = [
		{
			id: 'stockSplit',
			name: __('Stock Split'),
			color: theme.colors.tertiary
		},
		{
			id: 'merger',
			name: __('Merger'),
			color: theme.colors.tertiary
		},
		{
			id: 'priceUpdate',
			name: __('Price Update'),
			color: theme.colors.tertiary
		},
		{
			id: 'amountUpdate',
			name: __('Amount Update'),
			color: theme.colors.tertiary
		},
		{
			id: 'update',
			name: __('Update'),
			color: theme.colors.tertiary
		}
	];

	const LoanCategories: LoanCategory[] = [
		{
			id: 'repayment',
			name: __('Repayment'),
			color: theme.colors.primary,
			icon: 'push-outline',
		},
		{
			id: 'disbursement',
			name: __('Disbursement'),
			color: theme.colors.primary,
			icon: 'download-outline',
		}
	];

	return {
		TransactionCategories,
		TradingCategories,
		CashCategories,
		AdjustmentCategories,
		LoanCategories,
	}
}