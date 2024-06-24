import React from "react";
import Realm from "realm";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import { AccountProvider } from "../../../contexts/AccountContext";
import { FABProvider } from "../../../contexts/FABContext";

export default function AccountLayout() {
	const { theme } = useTheme();
  const { id, name } = useGlobalSearchParams<{ id: string, name: string }>();
	const _id = new Realm.BSON.UUID( id );

  return ( 
		<AccountProvider _id={ _id }>
			<FABProvider>
				<Stack screenOptions={ {
					headerBackTitleVisible: false,
					title: name,
					animationDuration: 200,
					animation: 'fade_from_bottom',
					contentStyle: { backgroundColor: theme.colors.background },
					headerShown: false
				} }>
					<Stack.Screen name="index" />
					<Stack.Screen name="holdings" />
				</Stack>
			</FABProvider>
		</AccountProvider>
	);
}