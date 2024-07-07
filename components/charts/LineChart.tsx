import React, { useMemo, useRef, useState } from "react";
import { curveBasis, line, scaleLinear, scaleTime } from "d3"
import { DataPoint } from "../../contexts/DataContext";
import { Animated, LayoutChangeEvent, SafeAreaView, StyleSheet } from "react-native";
import { G, Line, Path, Svg } from 'react-native-svg';
import { Spacing } from "../../constants";
import { useTheme } from "../../contexts/ThemeContext";
import { Title } from "../ui/Title";

interface Props {
	label?: string,
	data: DataPoint[],
	height?: number,
  bottomPadding?: number,
  leftPadding?: number,
}

export const LineChart: React.FC<Props> = ({
	label,
	data,
	height,
	bottomPadding = Spacing.md,
	leftPadding,
}) => {
	const { theme } = useTheme();
  const ref = useRef(null);
	const [ lineChartWidth, setLineChartWidth ] = useState( 0 );
	const lineChartHeight = height ?? lineChartWidth / 2;

	const onLayout = ( event: LayoutChangeEvent ) => {
    const { width } = event.nativeEvent.layout;

    setLineChartWidth( width );
  };

	const makeGraph = ( data: DataPoint[] ) => {
		const { min, max, from, to } = data.reduce(( acc, dataPoint ) => {
			if ( dataPoint.value > acc.max ) acc.max = dataPoint.value;
			if ( dataPoint.value < acc.min ) acc.min = dataPoint.value;
			if ( dataPoint.date < acc.from ) acc.from = dataPoint.date;
			if ( dataPoint.date > acc.to ) acc.to = dataPoint.date;

			return acc;
		}, {
			min: Infinity,
			max: -Infinity,
			from: Infinity,
			to: -Infinity,
		});
		
		const y = scaleLinear().domain([ 0, max ]).range([ lineChartHeight, 35 ]);
		const x = scaleTime()
			.domain([ from, to ])
			.range([ 0, lineChartWidth ]);

		const curvedLine = line<DataPoint>()
			.x( d => x( d.date ))
			.y( d => y( d.value ))
			.curve( curveBasis )( data );
	
		return {
			max,
			min,
			curve: curvedLine!,
		};
	};

	const graphData = useMemo( () => {
		if ( ! data.length ) {
			return;
		}

		return [ makeGraph( data ) ]
	}, [ data, lineChartWidth, height, leftPadding, bottomPadding ]);

	return (
    <SafeAreaView style={styles.container}>
			<Title>{label}</Title>
      <Animated.View
				ref={ ref }
				onLayout={ onLayout }
				style={styles.chartContainer}>
				{ !! graphData?.length && (
					<Svg
						width={ lineChartWidth }
						height={ lineChartHeight }
						stroke={ theme.colors.primary }
						fill="transparent">
						<G y={-bottomPadding}>
							<Line
								x1={leftPadding}
								y1={lineChartHeight}
								x2={lineChartWidth}
								y2={lineChartHeight}
								stroke={ theme.colors.outlineVariant }
								strokeWidth="1" />

							<Line
								x1={leftPadding}
								y1={lineChartHeight * 0.6}
								x2={lineChartWidth}
								y2={lineChartHeight * 0.6}
								stroke={ theme.colors.outlineVariant }
								strokeWidth="1" />

							<Line
								x1={leftPadding}
								y1={lineChartHeight * 0.2}
								x2={lineChartWidth}
								y2={lineChartHeight * 0.2}
								stroke={ theme.colors.outlineVariant }
								strokeWidth="1" />
								
							<Path
								d={graphData[0].curve}
								strokeWidth="2" />
						</G>
					</Svg>
				)}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
	container: {
	},
	chartContainer: {

	}
})