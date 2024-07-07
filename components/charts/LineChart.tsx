import React, { useRef, useState } from "react";
import { LineChart as GiftedLineChart, LineChartPropsType, lineDataItem } from "react-native-gifted-charts";
import { useTheme } from "../../contexts/ThemeContext";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Title } from "../ui/Title";
import { Spacing } from "../../constants";
import { Text } from "react-native-paper";
import { LinearGradient, Stop } from "react-native-svg";

interface Props {
	data: LineChartPropsType['data']
	label?: string
}

export const LineChart: React.FC<Props> = ({ data, label }) => {
	const { theme } = useTheme();
  const ref = useRef(null);
	const [ lineChartWidth, setLineChartWidth ] = useState( 0 );

	const onLayout = ( event: LayoutChangeEvent ) => {
    const { width } = event.nativeEvent.layout;

    setLineChartWidth( width );
  };

	const pointerConfig = {
		pointerStripUptoDataPoint: true,
		pointerStripColor: 'lightgray',
		pointerStripWidth: 2,
		strokeDashArray: [2, 5],
		pointerColor: 'lightgray',
		radius: 4,
		pointerLabelWidth: 100,
		pointerLabelHeight: 120,
		pointerLabelComponent: ( items: lineDataItem[] )=> {
			return (
				<View
					style={{
						height: 120,
						width: 100,
						backgroundColor: '#282C3E',
						borderRadius: 4,
						justifyContent:'center',
						paddingLeft:16,
					}}>
					<Text style={{color: 'lightgray',fontSize:12}}>{2018}</Text>
					<Text style={{color: 'white', fontWeight:'bold'}}>{items[0].value}</Text>
				</View>
			);
		},
	} as LineChartPropsType['pointerConfig'];

	return (
		<Animated.View
			ref={ ref }
			onLayout={ onLayout }
			style={ styles.container }>
			<Title>{ label }</Title>
			<GiftedLineChart
				areaChart
				curved
				data={ data }
				color={ theme.colors.primary }
				width={ lineChartWidth }
				initialSpacing={ 0 }
				thickness={ 3 }
				xAxisLabelTextStyle={ styles.xAxisLabelText }
				hideYAxisText
				hideAxesAndRules
				hideDataPoints
				adjustToWidth
				pointerConfig={ pointerConfig }
      	areaGradientId="linearGrading"
				areaGradientComponent={() => {
					return (
						<LinearGradient id="linearGrading" x1="0" x2="0" y1="0" y2="1">
							<Stop
								offset="0"
								stopColor={ theme.colors.primary}
								stopOpacity={ 0.3 } />
							<Stop
								offset="0.8"
								stopColor={ theme.colors.outlineVariant }
								stopOpacity={ 0 } />
						</LinearGradient>
					);
				}} />
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: Spacing.sm
	},
	xAxisLabelText: {
		display: 'none'
	}
});