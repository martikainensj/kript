import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { LineChart as GiftedLineChart, LineChartPropsType, lineDataItem } from "react-native-gifted-charts";
import { Animated, LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Title } from "../ui/Title";
import { BorderRadius, FontSize, GlobalStyles, Spacing } from "../../constants";
import { Card } from "../ui/Card";
import { Value } from "../ui/Value";
import { IconButton } from "../buttons";
import { DataPoint } from "../../models/DataPoint";
import { filterDataByInterval, prettifyNumber } from "../../helpers";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useStorage } from "../../features/storage/useStorage";
import { TimeframeProps } from "../../features/charts/types";
import { useCharts } from "../../features/charts/useCharts";
import { Text } from "../ui/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Chips } from "../inputs";

interface Props {
	id: string,
	data: DataPoint[]
	label?: string,
	unit?: string,
	timeframeContainerStyle?: StyleProp<ViewStyle>;
	timeframeOptions?: TimeframeProps[];
}

export const LineChart: React.FC<Props> = ({
	id,
	data,
	label,
	unit,
	timeframeContainerStyle,
	timeframeOptions,
}) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const { get, set } = useStorage();
	const { TimeframeTypes } = useCharts();
	const insets = useSafeAreaInsets();
	const [lineChartWidth, setLineChartWidth] = useState(0);

	const [timeframe, setTimeframe] = useState<TimeframeProps>(TimeframeTypes.ytd);

	const timeframedData = useMemo(() => {
		const filteredData = filterDataByInterval(data, timeframe?.interval ?? 'weekly', timeframe?.range);
		const lineDataItems = filteredData.map(data => {
			return {
				label: new Date(data.date).toLocaleDateString('fi'),
				value: data.value,
			} as lineDataItem
		});

		return lineDataItems as lineDataItem[];
	}, [data, timeframe]);

	const { lastValue, maxValue, minValue } = useMemo(() => {
		const values = timeframedData.reduceRight((result, current) => {
			if (result.lastValue === 0 && current.value !== null && current.value !== undefined) {
				result.lastValue = current.value;
			}

			if (current.value !== null && current.value !== undefined) {
				if (current.value > result.maxValue) {
					result.maxValue = current.value;
				}

				if (current.value < result.minValue) {
					result.minValue = current.value;
				}
			}

			return result;
		}, { lastValue: 0, maxValue: -Infinity, minValue: Infinity });

		return values;
	}, [timeframedData]);

	const yAxisOffset = minValue;
	const chartColor = lastValue >= 0
		? theme.colors.success
		: theme.colors.error;

	const onLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;

		setLineChartWidth(width);
	};

	const onPressTimeframeOption = (option: TimeframeProps) => {
		setTimeframe(option);

		get('@filters/timeframe').then(filtersTimeframe => {
			const newFiltersTimeframe = {};

			if (!!filtersTimeframe) {
				Object.assign(newFiltersTimeframe, filtersTimeframe);
			}

			newFiltersTimeframe[id] = { id: option.id };

			set('@filters/timeframe', newFiltersTimeframe)
		});
	}

	const pointerLabelComponent = useCallback((items: lineDataItem[]) => {
		const item = items[0];

		if (!item?.value || item.hideDataPoint) {
			return;
		}

		return (
			<View style={styles.pointerLabelContainer}>
				{item.label && (
					<Text style={styles.pointerLabelLabel}>
						{item.label}
					</Text>
				)}

				<View style={[
					styles.pointerLabelValue,
					{ backgroundColor: theme.colors.background }
				]}>
					<Value
						value={prettifyNumber(item.value, 0)}
						unit={unit}
						isPositive={item.value > 0}
						isNegative={item.value < 0} />
				</View>
			</View>
		);
	}, [timeframedData]);

	useLayoutEffect(() => {
		get('@filters/timeframe').then(filtersTimeframe => {
			const timeframeId = filtersTimeframe?.[id]?.id || null;

			if (timeframeId) {
				setTimeframe(timeframeOptions.find(option => option.id === timeframeId));
			} else if (timeframeOptions?.length) {
				setTimeframe(timeframeOptions[0]);
			}
		})
	}, []);

	const pointerConfig = {
		autoAdjustPointerLabelPosition: true,
		pointerStripColor: chartColor,
		pointerStripWidth: 1,
		strokeDashArray: [2, Spacing.xs],
		pointerColor: chartColor,
		radius: 4,
		pointerLabelWidth: 100,
		pointerLabelHeight: 90,
		pointerLabelComponent,
		pointerVanishDelay: 0
	} as LineChartPropsType['pointerConfig'];

	const xAxis = {
		xAxisThickness: 0,
		xAxisLabelsHeight: 0,
		xAxisColor: theme.colors.outline,
	} as Partial<LineChartPropsType>

	const yAxis = {
		yAxisThickness: 0,
		yAxisOffset: yAxisOffset,
		yAxisLabelWidth: 0,
		yAxisExtraHeight: Spacing.md,
		hideYAxisText: true,
	} as Partial<LineChartPropsType>

	const rules = {
		hideRules: true
	} as Partial<LineChartPropsType>

	const showChart = timeframedData?.length > 1;
	const showTimeframe = !!timeframeOptions?.length;

	return (
		<Animated.View
			onLayout={onLayout}
			style={[
				styles.container,
				{ marginBottom: insets.bottom }
			]}
		>
			<View style={styles.headerContainer}>
				<Title>{label}</Title>
				<Value
					value={prettifyNumber(lastValue, 0)}
					unit={unit}
					isPositive={lastValue > 0}
					isNegative={lastValue < 0}
					valueStyle={styles.lastValue}
					unitStyle={styles.lastValueUnit} />
			</View>

			{showChart &&
				<View style={styles.lineChartWrapper}>
					<GiftedLineChart
						curved
						curveType={1}
						data={timeframedData}
						{...xAxis}
						{...yAxis}
						{...rules}
						width={lineChartWidth}
						height={lineChartWidth / 2}
						initialSpacing={0}
						thickness={2}
						hideDataPoints
						adjustToWidth
						pointerConfig={pointerConfig}
						areaChart
						color={chartColor}
						startFillColor={chartColor}
						endFillColor={'transparent'}
						startOpacity={0.3}
						endOpacity={0} />
				</View>
			}

			{!showChart &&
				<View style={styles.noticeWrapper}>
					<Text>{__('Not enough data')}</Text>
				</View>
			}

			{(showChart && !!timeframeOptions.length) && (
				<View>
					<Chips
						label={__("Timeframe")}
						items={timeframeOptions.map(option => {
							return {
								label: option.name,
								value: option
							}
						})}
						value={timeframe}
						setValue={onPressTimeframeOption}
					/>
				</View>
			)}
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: Spacing.sm,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: Spacing.md,
		paddingHorizontal: Spacing.md
	},
	lineChartWrapper: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	noticeWrapper: {
		...GlobalStyles.slice,
		marginBottom: Spacing.md
	},
	xAxisLabelText: {
		display: 'none'
	},
	pointerLabelContainer: {
		justifyContent: 'center',
		marginBottom: 0,
		paddingBottom: 0
	},
	pointerLabelLabel: {
		marginBottom: 6,
		textAlign: 'center',
	},
	pointerLabelValue: {
		padding: Spacing.sm,
		borderRadius: BorderRadius.lg,
		overflow: 'hidden',
		width: 'auto',
		alignItems: 'center',
	},
	lastValue: {
		fontSize: FontSize.xl
	},
	lastValueUnit: {
		fontSize: FontSize.lg
	},
	menuContainer: {
		left: 'auto',
		right: 0,
		padding: Spacing.md
	},
	sortingContainer: {
		alignSelf: 'flex-end',
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm,
		padding: Spacing.md
	},
	sortingText: {
	},
});