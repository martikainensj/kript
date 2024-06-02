import { Ionicons } from '@expo/vector-icons';

import { useI18n } from '../components/contexts/I18nContext';
import { useTheme } from '../components/contexts/ThemeContext';

interface Type {
  id: string;
  name: string;
  color?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export const useTypes = () => {
	const { theme } = useTheme();
	const { __ } = useI18n();

	const TransactionTypes: Type[] = [
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
		}
	];


	const TransferTypes: Type[] = [
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

	const HoldingUpdateTypes: Type[] = [
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
			id: 'priceChanged',
			name: __( 'Price Changed' ),
			color: theme.colors.tertiary
		},
		{
			id: 'amountChanged',
			name: __( 'Amount Changed' ),
			color: theme.colors.tertiary
		},
		{
			id: 'adjustment',
			name: __( 'Adjustment' ),
			color: theme.colors.tertiary
		}
	];

	return { TransactionTypes, TransferTypes, HoldingUpdateTypes }
}