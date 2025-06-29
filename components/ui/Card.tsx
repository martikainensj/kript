import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { BorderRadius, Spacing } from "../../constants";
import { useTheme } from "../../features/theme/ThemeContext";

interface CardProps {
	children: React.ReactNode;
	style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ( { children, style } ) => {
	const { theme } = useTheme();

	return (
		<LinearGradient
			colors={ [
				theme.colors.surfaceVariant + "88",
				theme.colors.surfaceVariant + "00",
			] }
			style={ [
				styles.container,
				style
			] }>
			{ children }
		</LinearGradient>
	)
}

const styles = StyleSheet.create( {
	container: {
		padding: Spacing.md,
		borderRadius: BorderRadius.lg
	}
} );