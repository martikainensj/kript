import React from "react";
import { Slot, Stack, useGlobalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Theme } from "../../constants/theme";

export default function AccountLayout() {
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();

  return ( <>
		<Stack.Screen options={ {
			headerBackTitleVisible: false,
			title: name,
			animationDuration: 150,
			animation: 'fade',
			contentStyle: styles.contentContainer
		} } />
		<Slot />
	</> );
}

const styles = StyleSheet.create( {
	contentContainer: {
		backgroundColor: Theme.colors.background
	}
} );