import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Spacing, FontSize } from "../../constants";
import { useTheme } from "../../features/theme/ThemeContext";
import { Text } from "./Text";
interface Props {
	label?: string;
	value: string | number;
	containerStyle?: ViewStyle;
	labelContainerStyle?: ViewStyle;
	labelStyle?: TextStyle;
	valueContainerStyle?: ViewStyle;
	valueStyle?: TextStyle;
	unitStyle?: TextStyle;
	isVertical?: boolean;
	unit?: string;
	isPositive?: boolean;
	isNegative?: boolean;
}

export const Value: React.FC<Props> = ({
	label,
	value,
	containerStyle,
	labelContainerStyle,
	labelStyle,
	valueContainerStyle,
	valueStyle,
	unitStyle,
	isVertical = false,
	unit = null,
	isPositive = false,
	isNegative = false,
}) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				isVertical ? styles.vertical : styles.horizontal,
				containerStyle
			]}
		>
			{(!!label || isVertical) &&
				<View
					style={[
						styles.labelContainer,
						labelContainerStyle
					]}
				>
					<Text
						fontWeight="semiBold"
						fontSize="xs"
						style={[
							styles.label,
							labelStyle
						]}
					>
						{label}
					</Text>

					{unit && isVertical && (
						<Text
							fontSize="xs"
							style={[
								styles.unit,
								unitStyle
							]}
						>
							{unit}
						</Text>
					)}
				</View>
			}

			<View
				style={[
					styles.valueContainer,
					valueContainerStyle
				]}
			>
				<Text
					fontWeight={isPositive || isNegative ? "semiBold" : "regular"}
					style={[
						styles.value,
						valueStyle,
						isPositive && { color: theme.colors.success },
						isNegative && { color: theme.colors.error },
					]}
				>
					{!value && value !== 0 ? "-" : value}
				</Text>

				{unit && !isVertical &&
					<Text
						fontWeight={isPositive || isNegative ? "semiBold" : "regular"}
						style={[
							styles.unit,
							{ marginLeft: Spacing.xxs },
							unitStyle,
							isPositive && { color: theme.colors.success },
							isNegative && { color: theme.colors.error },
						]}
					>
						{unit}
					</Text>
				}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: Spacing.xs,
	},
	vertical: {
		flexDirection: "column",
		alignItems: "flex-start",
	},
	horizontal: {
		alignItems: 'center',
		justifyContent: "space-between",
		flexDirection: "row",
	},
	horizontalValue: {
		marginLeft: Spacing.md,
	},
	labelContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		flexWrap: "wrap",
		columnGap: Spacing.xs,
		flexGrow: 1,
	},
	label: {
	},
	valueContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	value: {

	},
	unit: {
		textAlign: "right",
		fontSize: FontSize.xs,
	}
});
