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
	const { value: lastValue } = data.reduceRight(( latest, current ) => {
		if ( latest === null && current.value !== null && current.value !== undefined ) {
				return current;
		}

		return latest;
	}, null );
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
				value: data.value
			}
		});
		return lineDataItems as lineDataItem[];
	}, [ data, timeframe ]);

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
						value={ item.value }
						unit={ unit }
						isPositive={ item.value > 0 }
						isNegative={ item.value < 0 } />
				</View>
			</View>
		);
	}, []);

	const pointerConfig = {
		pointerStripHeight: lineChartWidth * 0.37,
		pointerStripColor: theme.colors.primary,
		pointerStripWidth: 1,
		strokeDashArray: [ 2, Spacing.xs ],
		pointerColor: theme.colors.primary,
		radius: 4,
		pointerLabelWidth: 100,
		pointerLabelHeight: 90,
		pointerLabelComponent,
	} as LineChartPropsType['pointerConfig'];

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

	return (
		<Animated.View
			onLayout={ onLayout }
			style={ styles.container }>
			<Card style={ { marginTop: Spacing.md, paddingHorizontal: 0, paddingBottom: 0 } }>
				<View style={ styles.headerContainer }>
					<Title>{ label }</Title>
					<Value
						value={ lastValue }
						unit={ unit }
						isPositive={ lastValue > 0 }
						isNegative={ lastValue < 0 }
						valueStyle={ styles.lastValue }
						unitStyle={ styles.lastValueUnit } />
				</View>
				<View style={ styles.lineChartWrapper }>
					<GiftedLineChart
          	isAnimated
						dataSet={[
							{ data: timeframedData }
						]}
						showDataPointsForMissingValues={ true }
						dataPointsColor={ theme.colors.primary }
						color={ theme.colors.primary }
						width={ lineChartWidth }
						height={ lineChartWidth / 2 }
						initialSpacing={ 0 }
						thickness={ 2 }
						xAxisThickness={ 0 }
						xAxisLabelsHeight={ 0 }
						yAxisLabelWidth={ 0 }
						yAxisExtraHeight={ Spacing.lg }
						noOfSectionsBelowXAxis={ 0 }
						hideYAxisText
						hideAxesAndRules
						hideDataPoints
						adjustToWidth
						pointerConfig={ pointerConfig }
						areaChart
						startFillColor={ theme.colors.primary }
						endFillColor={ 'transparent' }
						startOpacity={ 0.3 }
						endOpacity={ 0 } />
				</View>
				{ timeframeOptions &&
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
		height: 90,
		width: 100,
		justifyContent: 'center',
		marginTop: -30,
		marginLeft: -40,
	},
	pointerLabelLabel: {
		...GlobalStyles.label,
		marginBottom:6,
		textAlign:'center'
	},
	pointerLabelValue: {
		...GlobalStyles.label,
		padding: Spacing.sm,
		borderRadius: BorderRadius.lg,
		overflow: 'hidden',
		width: 'auto',
		alignItems: 'center'
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