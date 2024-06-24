import React from "react";
import { Slot, Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

export default function AccountsLayout() {
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();
	const { theme } = useTheme();

  return (
	<Stack screenOptions={ {
		headerBackTitleVisible: false,
		title: name,
		animationDuration: 200,
		animation: 'fade_from_bottom',
		contentStyle: { backgroundColor: theme.colors.background },
		headerShown: false
	} }>
		<Stack.Screen name="[account]" />
	</Stack> );
}