import React from "react";
import { Slot, Stack, useGlobalSearchParams } from "expo-router";
import { FABProvider } from "../../contexts/FABContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function HoldingLayout() {
	const { theme } = useTheme();
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();

  return (
		<FABProvider>
			<Stack.Screen
				options={ {
					headerBackTitleVisible: false,
					title: name,
					animationDuration: 150,
					animation: 'fade_from_bottom',
					contentStyle: { backgroundColor: theme.colors.background }
				} } />
			<Slot />
		</FABProvider>
	);
}