import React from "react";
import Realm from "realm";
import { useLocalSearchParams } from "expo-router";

import { FABProvider } from "../../../contexts/FABContext";
import HoldingView from "../../../components/holdings/HoldingView";
import { Text } from "react-native-paper";
import { useData } from "../../../contexts/DataContext";

export default function HoldingLayout() {
	const { getHoldingBy } = useData();
  const { holdingId, accountId } = useLocalSearchParams<{ holdingId: string, accountId: string, name: string }>();
	const holding = getHoldingBy(
		'_id',
		new Realm.BSON.UUID( holdingId ),
		{ accountId: new Realm.BSON.UUID( accountId ) }
	);

  return ( 
		<FABProvider>
			<HoldingView holding={ holding } />
		</FABProvider>
	);
}