import React from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useTheme } from "../../contexts/ThemeContext";

interface Props {
	progress: Animated.Value;
	opacity: Animated.Value;
}

export const ProgressBar: React.FC<Props> = ({ progress, opacity }) => {
	const { theme } = useTheme();

	return (
		<View style={ styles.container }>
			<Animated.View style={[
				styles.fillContainer,
				{
					backgroundColor: theme.colors.primary,
					opacity,
					transform: [{ scaleX: progress }]
				}
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