import React from "react";
import Realm from "realm";
import { router, useLocalSearchParams } from "expo-router";

import { FABProvider } from "../../../contexts/FABContext";
import HoldingView from "../../../components/holdings/HoldingView";
import { useData } from "../../../contexts/DataContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HoldingLayout() {
	const insets = useSafeAreaInsets();
	const { getHoldingBy } = useData();
	const { holdingId, accountId } = useLocalSearchParams<{ holdingId: string, accountId: string, name: string }>();
	const holding = getHoldingBy(
		'_id',
		new Realm.BSON.UUID(holdingId),
		{ accountId: new Realm.BSON.UUID(accountId) }
	);

	if (!holding?.isValid()) {
		router.navigate({
			pathname: '/accounts/[account]',
			params: { accountId }
		});
		return;
	}

	return (
		<FABProvider insets={insets}>
			<HoldingView holding={holding} />
		</FABProvider>
	);
}