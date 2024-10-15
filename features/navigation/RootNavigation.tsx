import React from "react";
import { useTheme } from "../theme/ThemeContext";
import { Stack } from "expo-router";

interface Props {

}

export const RootNavigation: React.FC<Props> = ({}) => {
	const { theme } = useTheme();

	return (
		<Stack
			screenOptions={{
				animationDuration: 200,
				animation: 'fade_from_bottom',
				headerShown: false
			}}
		>
			<Stack.Screen name="(tabs)" />
		</Stack>
	);
}