import React from "react";
import Realm from "realm";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";
import { FABProvider } from "../../../contexts/FABContext";
import { useData } from "../../../contexts/DataContext";

export default function AccountLayout() {
	const { getAccountBy } = useData();
  const { accountId } = useGlobalSearchParams<{ accountId: string }>();
	const { theme } = useTheme();
	
	const account = getAccountBy( '_id', new Realm.BSON.UUID( accountId ));

  return (
		<FABProvider>
			<Stack screenOptions={ {
				headerBackTitleVisible: false,
				title: account.name,
				animationDuration: 200,
				animation: 'fade_from_bottom',
				contentStyle: { backgroundColor: theme.colors.background },
				headerShown: false
			} }/>
		</FABProvider>
	);
}