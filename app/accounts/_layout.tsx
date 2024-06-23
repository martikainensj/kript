import React from "react";
import { Slot, Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { FABProvider } from "../../contexts/FABContext";

export default function AccountLayout() {
	const { theme } = useTheme();
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();

  return (
		<FABProvider>
			<Stack.Screen
				options={ {
					headerBackTitleVisible: false,
					title: name,
					animationDuration: 200,
					animation: 'fade_from_bottom',
					contentStyle: { backgroundColor: theme.colors.background }
				} } />
			<Slot />
		</FABProvider>
	);
}