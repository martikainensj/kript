import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTheme } from "../theme/ThemeContext";

interface Props {

}

export const AccountsNavigation: React.FC<Props> = ({}) => {
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