import React from "react";
import Realm from "realm";
import { Stack, router, useGlobalSearchParams } from "expo-router";
import { useTheme } from "../theme/ThemeContext";
import { useData } from "../data/DataContext";

interface Props {

}

export const AccountNavigation: React.FC<Props> = ({}) => {
	const { getAccountBy } = useData();
	const { accountId } = useGlobalSearchParams<{ accountId: string }>();
	const { theme } = useTheme();
	
	const account = getAccountBy( '_id', new Realm.BSON.UUID( accountId ));

	if ( ! account?.isValid() ) {
		router.navigate( '/accounts' );
		return;
	}

	return (
		<Stack screenOptions={ {
			headerBackTitleVisible: false,
			animationDuration: 200,
			animation: 'fade_from_bottom',
			contentStyle: { backgroundColor: theme.colors.background },
			headerShown: false
		} }/>
	);
}