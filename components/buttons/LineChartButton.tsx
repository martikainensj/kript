import React, { useMemo, useState, useEffect } from "react";
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { LineChart as GiftedLineChart, lineDataItem } from "react-native-gifted-charts";
import { BorderRadius, FontSize, FontWeight, Spacing } from "../../constants";
import { Card } from "../ui/Card";
import { Value } from "../ui/Value";
import { DataPoint } from "../../models/DataPoint";
import { filterDataByInterval, prettifyNumber } from "../../helpers";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useCharts } from "../../features/charts/useCharts";
import { TouchableOpacityProps } from "react-native-gesture-handler";

interface Props {
	data: DataPoint[];
	label?: string;
	unit?: string;
	onPress: TouchableOpacityProps["onPress"];
}

export const LineChartButton: React.FC<Props> = ({
	data,
	label,
	unit,
	onPress,
}) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const { TimeframeTypes } = useCharts();
	const [lineChartWidth, setLineChartWidth] = useState(0);
	const [loading, setLoading] = useState(true);

	// Filter data based on timeframe (pure computation)
	const timeframedData = useMemo(() => {
		const { interval, range } = TimeframeTypes["1year"];
		return filterDataByInterval(data, interval, range).map(data => ({
			label: new Date(data.date).toLocaleDateString("fi"),
			value: data.value,
		})) as lineDataItem[];
	}, [data, TimeframeTypes]);

	// Set loading to false when data is ready
	useEffect(() => {
		setLoading(false);
	}, [timeframedData]);

	// Calculate derived values (pure computation)
	const { lastValue, maxValue, minValue } = useMemo(() => {
		return timeframedData.reduceRight(
			(result, current) => {
				if (result.lastValue === 0 && current.value != null) {
					result.lastValue = current.value;
				}

				if (current.value != null) {
					result.maxValue = Math.max(result.maxValue, current.value);
					result.minValue = Math.min(result.minValue, current.value);
				}

				return result;
			},
			{ lastValue: 0, maxValue: -Infinity, minValue: Infinity }
		);
	}, [timeframedData]);

	// Chart configurations
	const yAxisOffset = minValue;
	const chartColor = useMemo(() => (lastValue >= 0 ? theme.colors.success : theme.colors.error), [lastValue, theme]);
	const xAxisConfig = useMemo(() => ({
		xAxisThickness: 0,
		xAxisLabelsHeight: 0,
		xAxisColor: theme.colors.outline,
	}), [theme]);
	const yAxisConfig = useMemo(() => ({
		yAxisThickness: 0,
		yAxisOffset,
		yAxisLabelWidth: 0,
		yAxisExtraHeight: 0,
		hideYAxisText: true,
	}), [yAxisOffset]);

	const onLayout = (event: LayoutChangeEvent) => {
		setLineChartWidth(event.nativeEvent.layout.width);
	};

	return (
		<TouchableOpacity onLayout={onLayout} onPress={onPress} style={styles.container}>
			<Card style={{ padding: 0 }}>
				<View style={styles.headerContainer}>
					<Value
						label={label}
						value={prettifyNumber(lastValue, 0)}
						unit={unit}
						valueStyle={styles.lastValue}
						isVertical
					/>
				</View>
				<View style={styles.lineChartWrapper}>
					{loading ? (
						<ActivityIndicator />
					) : (
						timeframedData.length > 0 && lineChartWidth > 0 && (
							<GiftedLineChart
								data={timeframedData}
								curved
								curveType={1}
								{...xAxisConfig}
								{...yAxisConfig}
								width={lineChartWidth}
								height={lineChartWidth}
								initialSpacing={0}
								disableScroll
								hideAxesAndRules
								thickness={2}
								hideDataPoints
								adjustToWidth
								areaChart
								color={chartColor}
								startFillColor={chartColor}
								endFillColor="transparent"
								startOpacity={0.3}
								endOpacity={0}
							/>
						)
					)}
				</View>
			</Card>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: BorderRadius.lg,
		overflow: "hidden",
	},
	headerContainer: {
		position: "absolute",
		top: Spacing.md,
		left: Spacing.md,
		right: 0,
		justifyContent: "space-between",
		gap: Spacing.xs,
		zIndex: 10,
	},
	lineChartWrapper: {
		alignItems: "center",
		justifyContent: "center",
		height: 200,
	},
	lastValue: {
		fontSize: FontSize.lg,
		fontWeight: FontWeight.bold,
	},
});