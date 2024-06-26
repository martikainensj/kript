import React from "react";
import Realm from "realm";
import { useLocalSearchParams } from "expo-router";
import { HoldingProvider } from "../../../contexts/HoldingContext";
import { FABProvider } from "../../../contexts/FABContext";
import HoldingView from "../../../components/holdings/HoldingView";

export default function HoldingLayout() {
  const { holdingId } = useLocalSearchParams<{ holdingId: string, name: string }>();
	const _id = new Realm.BSON.UUID( holdingId );

  return ( 
		<HoldingProvider _id={ _id }>
			<FABProvider>
				<HoldingView />
			</FABProvider>
		</HoldingProvider>
	);
}