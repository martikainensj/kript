import React from "react";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function HoldingsLayout() {
	const { theme } = useTheme();
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();

  return ( 
		<Stack screenOptions={ {
			headerBackTitleVisible: false,
			title: name,
			animationDuration: 200,
			animation: 'fade_from_bottom',
			contentStyle: { backgroundColor: theme.colors.background },
			headerShown: false
		} }>
			<Stack.Screen name="[holding]" />
		</Stack>
	);
}