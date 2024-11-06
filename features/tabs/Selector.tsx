import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Duration, GlobalStyles, Spacing } from '../../constants';
import { TabProps } from './types';
import { useTheme } from '../theme/ThemeContext';

interface Props {
	tabs: TabProps[];
	index: number;
	setIndex: (index: number) => void;
}

export const Selector: React.FC<Props> = ({ tabs, index, setIndex }) => {
	const ref = useRef<ScrollView>(null);
	const { theme } = useTheme();
	const underlinePosition = useRef(new Animated.Value(0)).current;
	const [labelColors, setLabelColors] = useState<Animated.Value[]>([]);
	const [tabPositions, setTabPositions] = useState<number[]>([]);
	const [scrollViewWidth, setScrollViewWidth] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const underlineWidth = Spacing.lg;

	const onLayout = (e: LayoutChangeEvent) => {
		const { width } = e.nativeEvent.layout;
		setScrollViewWidth(width);
	};

	const onLayoutTab = (e: LayoutChangeEvent, index: number) => {
		const { width, x } = e.nativeEvent.layout;

		setTabPositions(prev => {
			const positions = [...prev];
			positions[index] = x + width / 2 - underlineWidth / 2;
			return positions;
		});
	};

	useEffect(() => {
		if (tabs.length === 0) {
			return;
		}

		setLabelColors(tabs.map((_, _index) => {
			const isActive = _index === index;
			return new Animated.Value(isActive ? 1 : 0);
		}));
	}, [tabs]);

	useEffect(() => {
		if (tabPositions[index] === undefined) {
			return;
		}

		setIsAnimating(true);
		const targetPosition = tabPositions[index];

		Animated.timing(underlinePosition, {
			toValue: targetPosition,
			duration: Duration.normal,
			useNativeDriver: true,
		}).start(() => setIsAnimating(false));

		labelColors.forEach((animatedValue, _index) => {
			Animated.timing(animatedValue, {
				toValue: _index === index ? 1 : 0,
				duration: Duration.normal,
				useNativeDriver: false
			}).start();
		});

		if (ref.current && scrollViewWidth) {
			const targetPosition = tabPositions[index] - scrollViewWidth / 2 + underlineWidth / 2;
			ref.current.scrollTo({ x: Math.max(0, targetPosition), animated: true });
		}
	}, [index, tabPositions, labelColors]);

	return (
		<ScrollView
			ref={ref}
			horizontal
			style={[styles.selectorContainer, { borderBottomColor: theme.colors.outlineVariant }]}
			showsHorizontalScrollIndicator={false}
			onLayout={onLayout}
		>
			{tabs.map((tab, _index) => {
				const isActive = _index === index;

				const color = labelColors[_index]?.interpolate({
					inputRange: [0, 1],
					outputRange: [theme.colors.onBackground, theme.colors.primary]
				});

				return (
					<TouchableOpacity
						key={_index}
						onPress={() => setIndex(_index)}
						disabled={isActive || isAnimating}
						style={styles.selectorItemContainer}
						onLayout={(event) => onLayoutTab(event, _index)}
					>
						<Text style={{ color }}>
							{tab.label}
						</Text>
					</TouchableOpacity>
				);
			})}

			<Animated.View
				style={[
					styles.underline,
					{
						width: underlineWidth,
						backgroundColor: theme.colors.primary,
						transform: [{ translateX: underlinePosition }],
					},
				]}
			/>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	selectorContainer: {
		flexGrow: 0,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	selectorItemContainer: {
		padding: Spacing.md
	},
	underline: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		height: Spacing.xxs,
	},
});