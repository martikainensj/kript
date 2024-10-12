import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from 'expo-router';

import { GlobalStyles, Spacing } from "../../constants";
import { Account } from "../../models/Account";
import { prettifyNumber } from "../../helpers";
import { Icon } from "../ui/Icon";
import { Value } from "../ui/Value";
import { Grid } from "../ui/Grid";
import { useAccount } from "../../hooks/useAccount";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { Text } from "../ui/Text";

interface AccountItemProps {
	account: Account
}

export const AccountItem: React.FC<AccountItemProps> = ({ account }) => {
	const { theme } = useTheme();
	const { __ } = useI18n();

	useAccount({ account });

	function onPress() {
		router.navigate({
			pathname: 'accounts/[account]',
			params: {
				accountId: account._id.toString(),
				name: account.name
			}
		});
	}

	if (!account?.isValid()) return;

	const {
		balance,
		value,
		returnValue,
		returnPercentage
	} = account;

	const values = [];
	if (value) {
		values.push(
			<Value
				label={__('Value')}
				value={prettifyNumber(value, 0)}
				unit={'€'}
				isVertical={true}
				isNegative={value < 0} />
		)
	}

	if (returnValue) {
		values.push(
			<Value
				label={__('Return')}
				value={prettifyNumber(returnValue, 0)}
				unit={'€'}
				isVertical={true}
				isPositive={returnValue > 0}
				isNegative={returnValue < 0} />
		)
	}

	if (returnPercentage) {
		values.push(
			<Value
				label={__('Return')}
				value={prettifyNumber(returnPercentage, 0)}
				unit={'%'}
				isVertical={true}
				isPositive={returnPercentage > 0}
				isNegative={returnPercentage < 0} />
		)
	}

	if (balance) {
		values.push(
			<Value
				label={__('Balance')}
				value={prettifyNumber(balance, 0)}
				unit={'€'}
				isVertical={true}
				isNegative={balance < 0} />
		)
	}

	const meta = [
		<Text style={[styles.name, { color: theme.colors.primary }]}>{account.name}</Text>
	];

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<View style={styles.contentContainer}>
					<Grid
						columns={2}
						items={meta} />

					<Grid
						columns={4}
						items={values} />
				</View>

				<Icon name={'chevron-forward'} />
			</View>
		</TouchableOpacity>
	)
}

export default AccountItem;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.gutter,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	contentContainer: {
		gap: Spacing.sm,
		flexGrow: 1,
		flexShrink: 1
	},
	name: {
		...GlobalStyles.bold
	}
});