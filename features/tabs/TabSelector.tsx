import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '../../components/ui/Text';
import { Spacing } from '../../constants';
import { TabsScreenProps } from './types';
import { useTheme } from '../theme/ThemeContext';

interface TabSelectorProps {
	screens: TabsScreenProps[];
	currentIndex: number;
	setIndex: (index: number) => void;
	scrollData: { position: number; offset: number };
}

export const TabSelector: React.FC<TabSelectorProps> = ({ screens, currentIndex, setIndex, scrollData }) => {
	const { theme } = useTheme();
	const underlinePosition = useRef(new Animated.Value(0)).current;
	const underlineWidth = useRef(new Animated.Value(0)).current;
	const [tabWidths, setTabWidths] = useState<number[]>([]);

	const handleTabLayout = (event: LayoutChangeEvent, index: number) => {
		const { width } = event.nativeEvent.layout;

		setTabWidths((prev) => {
			const newWidths = [...prev];
			newWidths[index] = width;
			return newWidths;
		});
	};

	useEffect(() => {
		const { position, offset } = scrollData;

		if (tabWidths.length > 0 && tabWidths[position] !== undefined) {
			const currentOffset = tabWidths.slice(0, position).reduce((acc, width) => acc + width, 0);
			const nextWidth = tabWidths[position + 1] || tabWidths[position];

			Animated.timing(underlinePosition, {
				toValue: currentOffset + offset * tabWidths[position],
				duration: 0,
				useNativeDriver: false,
			}).start();

			Animated.timing(underlineWidth, {
				toValue: tabWidths[position] + (nextWidth - tabWidths[position]) * offset,
				duration: 0,
				useNativeDriver: false,
			}).start();
		}
	}, [scrollData, tabWidths]);

	return (
		<View>
			<ScrollView
				horizontal
				style={[styles.selectorContainer, { borderBottomColor: theme.colors.outlineVariant }]}
			>
				{screens.map((screen, index) => {
					const isActive = index === currentIndex;
					return (
						<TouchableOpacity
							key={index}
							onPress={() => setIndex(index)}
							disabled={screen.disabled || isActive}
							style={styles.selectorItemContainer}
							onLayout={(event) => handleTabLayout(event, index)}
						>
							<Text
								style={[
									isActive && { color: theme.colors.primary }
								]}
							>
								{screen.label}
							</Text>
						</TouchableOpacity>
					);
				})}
				<Animated.View
					style={[
						styles.underline,
						{
							width: underlineWidth,
							backgroundColor: theme.colors.outlineVariant,
							transform: [{ translateX: underlinePosition }],
						},
					]}
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	selectorContainer: {
		flexGrow: 0,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	selectorItemContainer: {
		paddingVertical: Spacing.sm,
		paddingHorizontal: Spacing.md,
	},
	underline: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		height: Spacing.xxs,
	},
});