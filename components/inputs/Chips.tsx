import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { BorderRadius, Spacing } from "../../constants";
import { ChipButton } from "../buttons/ChipButton";
import { Text } from "../ui/Text";

export interface ChipProps<T = any> {
	label: string;
	value: T;
}

interface ChipsProps<T> {
	label?: string;
	value: T;
	setValue: React.Dispatch<React.SetStateAction<T>>;
	items: ChipProps<T>[];
}

export const Chips = <T,>({ label, value, setValue, items }: ChipsProps<T>) => {
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

	const onPressHandler = (item: ChipProps<T>) => {
		setValue(item.value);
	};

	return (
		<View
			style={styles.container}
		>
			{!!label && (
				<Text
					fontSize="xs"
					fontWeight="semiBold"
				>
					{label}
				</Text>
			)}

			<ScrollView
				horizontal={true}
				keyboardShouldPersistTaps="handled"
				showsHorizontalScrollIndicator={false}
				style={{marginHorizontal: -Spacing.md}}
				contentContainerStyle={styles.contentContainer}>
				{uniqueValues.map((chip, key) => (
					<ChipButton
						key={key}
						selected={chip.value === value}
						onPress={() => onPressHandler(chip)}
						style={styles.chip}>
						{chip.label}
					</ChipButton>
				))}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: Spacing.xs,
		paddingHorizontal: Spacing.md
	},
	contentContainer: {
		gap: Spacing.sm,
		paddingHorizontal: Spacing.md,
	},
	chip: {
		borderRadius: BorderRadius.xl
	}
});