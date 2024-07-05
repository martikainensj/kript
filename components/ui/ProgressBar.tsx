import React from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import { useTheme } from "../../contexts/ThemeContext";

interface Props {
	progress: number;
	style?: ViewStyle
}

export const ProgressBar: React.FC<Props> = ({ progress, style }) => {
	const { theme } = useTheme();

	return (
		<View style={ styles.container }>
			<Animated.View style={[
				styles.fillContainer,
				{
					backgroundColor: theme.colors.primary,
					transform: [{ scaleX: progress }]
				},
				style
			]} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		flex: 1,
		height: 2,
		flexDirection: 'row',
	},
	fillContainer: {
		width: '100%',
		transformOrigin: 'left center'
	}
})