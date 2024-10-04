import React from "react";
import { Slot, Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../features/theme/ThemeContext";

export default function AccountsLayout() {
  const { name } = useLocalSearchParams<{ id: string, name: string }>();
	const { theme } = useTheme();

  return (
		<Stack screenOptions={ {
			headerBackTitleVisible: false,
			title: name,
			animationDuration: 200,
			animation: 'fade_from_bottom',
			contentStyle: { backgroundColor: theme.colors.background },
			headerShown: false
		} } />
	);
}