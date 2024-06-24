import React from "react";
import Realm from "realm";
import { useLocalSearchParams } from "expo-router";

import { Text } from "react-native-paper";
import { useAccount } from "../../../contexts/AccountContext";
import { useUser } from "@realm/react";
import { useI18n } from "../../../contexts/I18nContext";
import { useMenu } from "../../../contexts/MenuContext";
import { useFAB } from "../../../contexts/FABContext";
import { useBottomSheet } from "../../../contexts/BottomSheetContext";
import { useTypes } from "../../../hooks/useTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HoldingPage: React.FC = ( {} ) => {
	const { user } = useUser();
	const { __ } = useI18n();
	const { account, saveAccount, removeAccount, addTransaction } = useAccount();
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { SortingTypes } = useTypes();
	const insets = useSafeAreaInsets();

	// TODO: Selvitä mihi helvettiin account tippuu
	console.log( account );
  return ( 
		<Text>{'Test'}</Text>
	);
}

export default HoldingPage;