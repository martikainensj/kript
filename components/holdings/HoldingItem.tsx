import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { Holding } from "../../models/Holding";
import { prettifyNumber } from "../../helpers";
import { Icon } from "../ui/Icon";
import { Value } from "../ui/Value";
import { Grid } from "../ui/Grid";
import { useHolding } from "../../hooks/useHolding";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useData } from "../../features/data/DataContext";
import { Text } from "../ui/Text";

interface HoldingItemProps {
	holding: Holding
}

export const HoldingItem: React.FC<HoldingItemProps> = ({ holding }) => {
	useHolding({ holding });

	const { getAccountBy } = useData();
	const { theme } = useTheme();
	const { __ } = useI18n();
	const account = getAccountBy('_id', holding.account_id);

	const onPress = useCallback(() => {
		router.navigate({
			pathname: `accounts/[account]/[holding]`,
			params: {
				accountId: account._id.toString(),
				holdingId: holding._id.toString(),
				name: holding.name
			}
		});
	}, [holding]);

	if (!holding?.isValid()) return;

	const { name, amount, value, returnValue, returnPercentage } = holding;

	const values = [];

	if (value) {
		values.push(
			<Value
				label={__('Value')}
				value={prettifyNumber(value)}
				unit={'€'}
				isVertical={true} />
		)
	}

	if (returnValue) {
		values.push(
			<Value
				label={__('Return')}
				value={prettifyNumber(returnValue)}
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
				value={prettifyNumber(returnPercentage)}
				unit={'%'}
				isVertical={true}
				isPositive={returnPercentage > 0}
				isNegative={returnPercentage < 0} />
		)
	}

	if (amount > 1) {
		values.push(
			<Value
				label={__('Amount')}
				value={prettifyNumber(amount)}
				isVertical={true} />
		)
	}

	const meta = [
		<Text
			fontWeight="semiBold"
			style={[
				styles.name,
				{ color: theme.colors.primary }
			]}
		>
			{name}
		</Text>
	]

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.container}>
				<View style={styles.contentContainer}>
					<Grid
						columns={1}
						items={meta} />

					<Grid
						columns={4}
						items={values} />
				</View>

				<View style={styles.iconContainer}>
					<Icon name={'chevron-forward'} />
				</View>
			</View>
		</TouchableOpacity>
	)
}

export default HoldingItem;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.slice,
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
	},
	iconContainer: {
	}
});