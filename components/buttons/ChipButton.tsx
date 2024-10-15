import React from "react";
import { useTheme } from "../../features/theme/ThemeContext";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "../ui/Text";
import { BorderRadius, Spacing } from "../../constants";

interface Props extends TouchableOpacityProps {
	children: string;
	selected?: boolean;
}

export const ChipButton: React.FC<Props> = ({
	selected,
	children,
	...rest
}) => {
	const { theme } = useTheme();

	return (
		<TouchableOpacity
			{ ...rest }
			style={[
				styles.container,
				{ backgroundColor: theme.colors.surfaceVariant },
				selected && { backgroundColor: theme.colors.primaryContainer }
			]}
		>
			<Text
				numberOfLines={1}
				fontSize="xs"
				fontWeight="medium"
			>
				{children}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		borderRadius: BorderRadius.lg,
		overflow: 'hidden',
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.xs
	}
})