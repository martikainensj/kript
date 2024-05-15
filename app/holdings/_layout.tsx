import React from "react";
import { Slot, Stack, useGlobalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";
import { FABProvider } from "../../components/contexts";

export default function HoldingLayout() {
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();

  return (
		<FABProvider>
			<Stack.Screen
				options={ {
					headerBackTitleVisible: false,
					title: name,
					animationDuration: 150,
					animation: 'fade',
					contentStyle: styles.contentContainer
				} } />
			<Slot />
		</FABProvider>
	);
}

const styles = StyleSheet.create( {
	contentContainer: {
		backgroundColor: Theme.colors.background
	}
} );