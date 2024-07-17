import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { LineChart as GiftedLineChart, LineChartPropsType, lineDataItem } from "react-native-gifted-charts";
import { useTheme } from "../../contexts/ThemeContext";
import { Animated, LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Title } from "../ui/Title";
import { BorderRadius, FontSize, GlobalStyles, Spacing } from "../../constants";
import { Menu, Text } from "react-native-paper";
import { Card } from "../ui/Card";
import { Value } from "../ui/Value";
import { TimeframeType } from "../../hooks/useTypes";
import { IconButton } from "../buttons";
import { useData } from "../../contexts/DataContext";
import { DataPoint } from "../../models/DataPoint";
import { useStorage } from "../../hooks/useStorage";
import { useI18n } from "../../contexts/I18nContext";
import { prettifyNumber } from "../../helpers";

interface Props {
	id: string,
	data: DataPoint[]
	label?: string,
	unit?: string,
	timeframeContainerStyle?: StyleProp<ViewStyle>;
	timeframeOptions?: TimeframeType[];
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
	const { filterDataByInterval } = useData();
	const { getData, setData } = useStorage();
	const [ lineChartWidth, setLineChartWidth ] = useState( 0 );

	const [ timeframe, setTimeframe ] = useState<TimeframeType>({
		id: 'max',
		interval: 'weekly',
		name: __( 'Max' )
	});
	const [ showTimeframeOptions, setShowTimeframeOptions ] = useState( false );

	const timeframedData = useMemo(() => {
		const filteredData = filterDataByInterval( data, timeframe?.interval ?? 'weekly', timeframe?.range );
		const lineDataItems = filteredData.map( data => {
			return {
				label: new Date( data.date ).toLocaleDateString( 'fi' ),
				value: data.value,
			} as lineDataItem
		});

		return lineDataItems as lineDataItem[];
	}, [ data, timeframe ]);

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

	const absoluteMaxValue = Math.abs(Math.max(maxValue, Math.abs(minValue)));
	const stepValue = absoluteMaxValue / 10;
	const yAxisOffset = minValue;
	const chartColor = lastValue >= 0
		? theme.colors.success
		: theme.colors.error;

	const onLayout = ( event: LayoutChangeEvent ) => {
		const { width } = event.nativeEvent.layout;

		setLineChartWidth( width );
	};

	const onPressTimeframeOption = ( option: TimeframeType ) => {
		setShowTimeframeOptions( false );
		setTimeframe( option );

		getData( '@filters/timeframe' ).then( filtersTimeframe => {
			const newFiltersTimeframe = {};

			if ( !! filtersTimeframe ) {
				Object.assign( newFiltersTimeframe, filtersTimeframe );
			}

			newFiltersTimeframe[id] = { id: option.id };

			setData( '@filters/timeframe', newFiltersTimeframe )
		});
	}

	const pointerLabelComponent = useCallback(( items: lineDataItem[] ) => {
		const item = items[0];

		if ( ! item || item.hideDataPoint ) {
			return;
		}
		const offsetFixedValue = item.value + yAxisOffset;
		
		return (
			<View style={ styles.pointerLabelContainer }>	
				{ item.label && (
					<Text style={ styles.pointerLabelLabel }>
						{ item.label }
					</Text>
				)}

				<View style={[
					styles.pointerLabelValue,
					{ backgroundColor: theme.colors.background }
				]}>
					<Value
						value={ prettifyNumber( offsetFixedValue, 0 )}
						unit={ unit }
						isPositive={ offsetFixedValue > 0 }
						isNegative={ offsetFixedValue < 0 } />
				</View>
			</View>
		);
	}, [ timeframedData ]);

	useLayoutEffect(() => {
		getData( '@filters/timeframe' ).then( filtersTimeframe => {
			const timeframeId = ( !! filtersTimeframe && filtersTimeframe[ id ])
				? filtersTimeframe[ id ].id
				: null;

			if ( !! timeframeId ) {
				setTimeframe( timeframeOptions.find( option => option.id === timeframeId ));
			} else if ( !! timeframeOptions?.length ) {
				setTimeframe( timeframeOptions[ 0 ]);
			}
		})
	}, []);

	const pointerConfig = {
		autoAdjustPointerLabelPosition: true,
		pointerStripColor: chartColor,
		pointerStripWidth: 1,
		strokeDashArray: [ 2, Spacing.xs ],
		pointerColor: chartColor,
		radius: 4,
		pointerLabelWidth: 100,
		pointerLabelHeight: 90,
		pointerLabelComponent,
	} as LineChartPropsType['pointerConfig'];

	const xAxis = {
		xAxisThickness: 0,
		xAxisLabelsHeight: 0,
		xAxisColor: theme.colors.backdrop,
	} as Partial<LineChartPropsType>

	const yAxis = {
		yAxisThickness: 0,
		yAxisOffset: yAxisOffset,
		yAxisLabelWidth: 0,
		yAxisExtraHeight: Spacing.lg,
		hideYAxisText: true,
	} as Partial<LineChartPropsType>

	const rules = {
		rulesColor: theme.colors.outlineVariant,
		rulesType: 'dashed'
	} as Partial<LineChartPropsType>

	const showChart = timeframedData?.length > 1;
	const showTimeframe = showChart && !! timeframeOptions?.length;

	return (
		<Animated.View
			onLayout={ onLayout }
			style={ styles.container }>
			<Card style={ { marginTop: Spacing.md, paddingHorizontal: 0, paddingBottom: 0 } }>
				<View style={ styles.headerContainer }>
					<Title>{ label }</Title>
					<Value
						value={ prettifyNumber( lastValue, 0 )}
						unit={ unit }
						isPositive={ lastValue > 0 }
						isNegative={ lastValue < 0 }
						valueStyle={ styles.lastValue }
						unitStyle={ styles.lastValueUnit } />
				</View>
				<View style={ styles.lineChartWrapper }>
					{ showChart &&
						<GiftedLineChart
							isAnimated
							data={ timeframedData }
							{ ...xAxis }
							{ ...yAxis }
							{ ...rules }
							width={ lineChartWidth }
							height={ lineChartWidth / 2 }
							initialSpacing={ 0 }
							thickness={ 2 }
							hideDataPoints
							adjustToWidth
							pointerConfig={ pointerConfig }
							maxValue={ absoluteMaxValue }
							stepValue={ stepValue }
							areaChart
							color={ chartColor }
							startFillColor={ chartColor }
							endFillColor={ 'transparent' }
							startOpacity={ 0.3 }
							endOpacity={ 0 } />
					}
				</View>
				{ showTimeframe &&
					<Menu
						anchor={
							<View style={ [
								styles.sortingContainer,
								timeframeContainerStyle
							] }>
								{ timeframe &&
									<Text style={ styles.sortingText }>
										{ timeframe.name }
									</Text>
								}
								<IconButton
									icon={ 'time-outline' }
									onPress={ () => setShowTimeframeOptions( true ) } />
							</View>
						}
						visible={ showTimeframeOptions }
						onDismiss={ () => setShowTimeframeOptions( false ) }
						style={ styles.menuContainer }>
						{ timeframeOptions.map( ( option, key ) => {
							return (
								<Menu.Item
									key={ key }
									title={ option.name }
									onPress={ onPressTimeframeOption.bind( this, option ) } />
							)
						} ) }
					</Menu>
				}
			</Card>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: Spacing.sm
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: Spacing.md,
		paddingHorizontal: Spacing.lg
	},
	lineChartWrapper: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
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
		...GlobalStyles.label,
		marginBottom:6,
		textAlign:'center',
	},
	pointerLabelValue: {
		...GlobalStyles.label,
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
		...GlobalStyles.label
	},
});