import React, { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import { LineChart as GiftedLineChart, LineChartPropsType, lineDataItem } from "react-native-gifted-charts";

import { BorderRadius, FontSize, FontWeight, Spacing } from "../../constants";
import { Card } from "../ui/Card";
import { Value } from "../ui/Value";
import { DataPoint } from "../../models/DataPoint";
import { filterDataByInterval, prettifyNumber } from "../../helpers";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useCharts } from "../../features/charts/useCharts";

interface Props {
	data: DataPoint[]
	label?: string,
	unit?: string,
	onPress: TouchableOpacityProps['onPress']
}

export const LineChartButton: React.FC<Props> = ({
	data,
	label,
	unit,
	onPress
}) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const { TimeframeTypes } = useCharts();
	const [ lineChartWidth, setLineChartWidth ] = useState( 0 );

	const timeframedData = useMemo(() => {
		const timeframe = TimeframeTypes['1year'];
		const filteredData = filterDataByInterval( data, timeframe.interval, timeframe.range );
		const lineDataItems = filteredData.map( data => {
			return {
				label: new Date( data.date ).toLocaleDateString( 'fi' ),
				value: data.value,
			} as lineDataItem
		});

		return lineDataItems as lineDataItem[];
	}, [ data ]);

	const { lastValue, maxValue, minValue } = useMemo(() => {
		const values = timeframedData.reduceRight(( result, current ) => {
			if ( result.lastValue === 0 && current.value !== null && current.value !== undefined ) {
				result.lastValue = current.value;
			}

			if ( current.value !== null && current.value !== undefined ) {
					if ( current.value > result.maxValue ) {
							result.maxValue = current.value;
					}

					if ( current.value < result.minValue ) {
							result.minValue = current.value;
					}
			}

			return result;
		}, { lastValue: 0, maxValue: -Infinity, minValue: Infinity });
		
		return values;
	}, [ timeframedData ]);

	const yAxisOffset = minValue;
	const chartColor = lastValue >= 0
		? theme.colors.success
		: theme.colors.error;

	const onLayout = ( event: LayoutChangeEvent ) => {
		const { width } = event.nativeEvent.layout;

		setLineChartWidth( width );
	};

	const xAxis = {
		xAxisThickness: 0,
		xAxisLabelsHeight: 0,
		xAxisColor: theme.colors.outline,
	} as Partial<LineChartPropsType>

	const yAxis = {
		yAxisThickness: 0,
		yAxisOffset: yAxisOffset,
		yAxisLabelWidth: 0,
		yAxisExtraHeight: 0,
		hideYAxisText: true,
	} as Partial<LineChartPropsType>

	const showChart = timeframedData?.length > 0;

	return (
		<TouchableOpacity
			onLayout={ onLayout }
			onPress={ onPress }
			style={ styles.container }>
			<Card style={ { padding: 0 } }>
				<View style={ styles.headerContainer }>
					<Value
						label={label}
						value={ prettifyNumber( lastValue, 0 )}
						unit={ unit }
						valueStyle={ styles.lastValue }
						isVertical />
				</View>
				<View style={ styles.lineChartWrapper }>
					{ showChart &&
						<GiftedLineChart
							data={ timeframedData }
							curved
							curveType={ 1 }
							{ ...xAxis }
							{ ...yAxis }
							width={ lineChartWidth }
							height={ lineChartWidth }
							initialSpacing={ 0 }
							disableScroll
							hideAxesAndRules
							thickness={ 2 }
							hideDataPoints
							adjustToWidth
							areaChart
							color={ chartColor }
							startFillColor={ chartColor }
							endFillColor={ 'transparent' }
							startOpacity={ 0.3 }
							endOpacity={ 0 } />
					}
				</View>
			</Card>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: BorderRadius.lg,
		overflow: 'hidden'
	},
	headerContainer: {
		position: 'absolute',
		top: Spacing.md,
		left: Spacing.md,
		right: 0,
		justifyContent: 'space-between',
		gap: Spacing.xs,
		zIndex: 10
	},
	lineChartWrapper: {

		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	xAxisLabelText: {
		display: 'none'
	},
	lastValue: {
		fontSize: FontSize.lg,
		fontWeight: FontWeight.bold
	},
	lastValueUnit: {
		fontSize: FontSize.md
	},
});