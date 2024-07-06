import React, { useCallback, useMemo, useRef, useState } from "react";
import { curveBasis, line, scaleLinear, scaleTime } from "d3"
import { DataPoint } from "../../contexts/DataContext";
import { Animated, LayoutChangeEvent, SafeAreaView, StyleSheet, View } from "react-native";
import { G, Line, Path, Svg } from 'react-native-svg';
import { GlobalStyles } from "../../constants";
import { allSet, generateChecksum } from "../../helpers";
import { useTheme } from "../../contexts/ThemeContext";

interface Props {
	data: DataPoint[],
	height?: number,
  bottomPadding?: number,
  leftPadding?: number,
}

export const LineChart: React.FC<Props> = ({
	data,
	height = 200,
	bottomPadding,
	leftPadding,
}) => {
	const { theme } = useTheme();
	const [ lineChartWidth, setLineChartWidth ] = useState(0);
  const ref = useRef(null);

	const onLayout= ( event: LayoutChangeEvent ) => {
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
		
		const y = scaleLinear().domain([ 0, max ]).range([ height, 35 ]);
		const x = scaleTime()
			.domain([ from, to ])
			.range([ 10, lineChartWidth - 10 ]);

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
      <Animated.View
				ref={ ref }
				onLayout={ onLayout }
				style={styles.chartContainer}>
				{ !! graphData?.length && (
					<Svg
						width={ lineChartWidth }
						height={ height }
						stroke={ theme.colors.primary }
						fill="transparent">
						<G y={-bottomPadding}>
							<Line
								x1={leftPadding}
								y1={height}
								x2={lineChartWidth}
								y2={height}
								stroke={ theme.colors.outlineVariant }
								strokeWidth="1" />
							<Line
								x1={leftPadding}
								y1={height * 0.6}
								x2={lineChartWidth}
								y2={height * 0.6}
								stroke={ theme.colors.outlineVariant }
								strokeWidth="1" />
							<Line
								x1={leftPadding}
								y1={height * 0.2}
								x2={lineChartWidth}
								y2={height * 0.2}
								stroke={ theme.colors.outlineVariant }
								strokeWidth="1" />
							<Path d={graphData[0].curve} strokeWidth="2" />
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