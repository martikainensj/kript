import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Spacing, GlobalStyles, FontSize } from "../../constants";
import { useTheme } from "../../features/theme/ThemeContext";
import { Text } from "./Text";

interface ValueWrapperProps {
	value: string | number;
	unit?: string;
	isVertical?: boolean;
	valueContainerStyle?: ViewStyle;
	valueStyle?: TextStyle;
	unitStyle?: TextStyle;
	isPositive?: boolean;
	isNegative?: boolean;
}

const ValueWrapper: React.FC<ValueWrapperProps> = ({
	value,
	unit,
	isVertical,
	valueContainerStyle,
	valueStyle,
	unitStyle,
	isPositive,
	isNegative
}) => {
	const { theme } = useTheme();

	if (!value && value !== 0) {
		return (
			<View style={[styles.valueContainer, valueContainerStyle]}>
				<Text style={[
					styles.value,
					{ color: theme.colors.onBackground },
					valueStyle
				]}>
					{"-"}
				</Text>

				{unit && !isVertical &&
					<Text style={[
						styles.unit,
						{ color: theme.colors.onBackground },
						unitStyle
					]}>{unit}</Text>
				}
			</View>
		);
	}

	return (
		<View style={[styles.valueContainer, valueContainerStyle]}>
			<Text
				fontWeight={isPositive || isNegative ? "semiBold" : "regular"}
				style={[
					styles.value,
					valueStyle,
					isPositive && {
						color: theme.colors.success
					},
					isNegative && {
						color: theme.colors.error,
					},
				]}
			>
				{value}
			</Text>

			{unit && !isVertical &&
				<Text
					fontWeight={isPositive || isNegative ? "semiBold" : "regular"}
					style={[
						styles.unit, { marginLeft: Spacing.xxs }, unitStyle,
						isPositive && {
							color: theme.colors.success,
						},
						isNegative && {
							color: theme.colors.error
						},
					]}
				>
					{unit}
				</Text>
			}
		</View>
	);
};

interface ValueProps {
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

export const Value: React.FC<ValueProps> = ({
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
	isPositive,
	isNegative,
}) => {
	return (
		<View style={[
			styles.container,
			isVertical ? styles.vertical : styles.horizontal,
			containerStyle
		]}>
			{(!!label || isVertical) &&
				<View style={[styles.labelContainer, labelContainerStyle]}>
					<Text style={[styles.label, labelStyle]}>{label}</Text>

					{unit && isVertical && (
						<Text style={[styles.unit, unitStyle]}>{unit}</Text>
					)}
				</View>
			}

			<ValueWrapper
				value={value}
				unit={unit}
				valueContainerStyle={valueContainerStyle}
				valueStyle={valueStyle}
				unitStyle={unitStyle}
				isVertical={isVertical}
				isPositive={isPositive}
				isNegative={isNegative}
			/>
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
