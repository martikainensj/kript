import React from "react";
import Realm from "realm";
import { Slot, Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { HoldingProvider } from "../../../../../contexts/HoldingContext";
import { FABProvider } from "../../../../../contexts/FABContext";

export default function HoldingLayout() {
	const { theme } = useTheme();
  const { id, name } = useGlobalSearchParams<{ id: string, name: string }>();
	const _id = new Realm.BSON.UUID( id );

  return ( 
		<HoldingProvider _id={ _id }>
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
		</HoldingProvider>
	);
}