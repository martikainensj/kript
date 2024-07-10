import React, { useCallback, useRef, useState } from "react";
import { LineChart as GiftedLineChart, LineChartPropsType, lineDataItem } from "react-native-gifted-charts";
import { useTheme } from "../../contexts/ThemeContext";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Title } from "../ui/Title";
import { BorderRadius, FontSize, GlobalStyles, Spacing } from "../../constants";
import { Text } from "react-native-paper";
import { Card } from "../ui/Card";
import { Value } from "../ui/Value";

interface Props {
	data: LineChartPropsType['data']
	label?: string,
	unit?: string,
}

export const LineChart: React.FC<Props> = ({ data, label, unit }) => {
	const { theme } = useTheme();
  const ref = useRef(null);
	const [ lineChartWidth, setLineChartWidth ] = useState( 0 );
	const { label: lastLabel, value: lastValue } = ( data && data[ data?.length - 1 ] ) ?? {
		label: '',
		value: 0
	};

	const onLayout = ( event: LayoutChangeEvent ) => {
    const { width } = event.nativeEvent.layout;

    setLineChartWidth( width );
  };

	const pointerLabelComponent = useCallback(( items: lineDataItem[] ) => {
		const item = items[0];

		if ( ! item ) {
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
		pointerStripHeight: lineChartWidth * 0.38,
		pointerStripColor: theme.colors.primary,
		pointerStripWidth: 1,
		strokeDashArray: [ 2, Spacing.xs ],
		pointerColor: theme.colors.primary,
		radius: 4,
		pointerLabelWidth: 100,
		pointerLabelHeight: 90,
		pointerLabelComponent,
	} as LineChartPropsType['pointerConfig'];

	return (
		<Animated.View
			ref={ ref }
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
							{ data }
						]}
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
	}
});