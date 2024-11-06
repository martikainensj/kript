import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View, StyleSheet, LayoutChangeEvent } from "react-native";
import { ChipButton } from "../buttons/ChipButton";
import { Text } from "../ui/Text";
import { BorderRadius, GlobalStyles, Spacing } from "../../constants";

export interface ChipProps<T = any> {
	label: string;
	value: T;
}

interface Props<T> {
	label?: string;
	value: T;
	setValue: React.Dispatch<React.SetStateAction<T>>;
	items: ChipProps<T>[];
}

export const Chips = <T,>({ label, value, setValue, items }: Props<T>) => {
	const uniqueValues = useMemo(() => {
		const seen = new Set();
		return items.filter(item => {
			const itemValue = item.value;
			if (seen.has(itemValue)) {
				return false;
			}
			seen.add(itemValue);
			return true;
		});
	}, [items]);

	const scrollViewRef = useRef<ScrollView>(null);
	const [chipPositions, setChipPositions] = useState<number[]>([]);
	const [scrollViewWidth, setScrollViewWidth] = useState(0);

	const onPressHandler = (item: ChipProps<T>) => {
		setValue(item.value);
	};

	const onLayoutScrollView = (e: LayoutChangeEvent) => {
		const { width } = e.nativeEvent.layout;
		setScrollViewWidth(width);
	};

	const onLayoutChip = (e: LayoutChangeEvent, index: number) => {
		const { width, x } = e.nativeEvent.layout;

		setChipPositions(prev => {
			const positions = [...prev];
			positions[index] = x + width / 2;
			return positions;
		});
	};

	useEffect(() => {
		if (chipPositions.length === uniqueValues.length && scrollViewRef.current) {
			const index = uniqueValues.findIndex(chip => chip.value === value);
			if (index >= 0) {
				const targetPosition = chipPositions[index] - scrollViewWidth / 2;
				scrollViewRef.current.scrollTo({
					x: Math.max(0, targetPosition),
					animated: true,
				});
			}
		}
	}, [value, chipPositions]);

	return (
		<View style={styles.container}>
			{!!label && (
				<Text fontSize="xs" fontWeight="semiBold">
					{label}
				</Text>
			)}

			<ScrollView
				ref={scrollViewRef}
				horizontal
				style={{ marginHorizontal: -Spacing.md }}
				contentContainerStyle={styles.contentContainer}
				showsHorizontalScrollIndicator={false}
				onLayout={onLayoutScrollView}
			>
				{uniqueValues.map((chip, index) => (
					<View
						key={index}
						onLayout={(e) => onLayoutChip(e, index)}
					>
						<ChipButton
							selected={chip.value === value}
							onPress={() => onPressHandler(chip)}
							style={styles.chip}
						>
							{chip.label}
						</ChipButton>
					</View>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.slice,
	},
	contentContainer: {
		...GlobalStyles.slice,
	},
	chip: {
		borderRadius: BorderRadius.xl,
	},
});