import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import Realm, { BSON } from "realm";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../contexts/MenuContext";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";
import TransactionItem from "../../components/transactions/TransactionItem";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../contexts/I18nContext';
import { FABProvider, useFAB } from "../../contexts/FABContext";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useUser } from "../../hooks/useUser";
import { Card } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { Icon } from "../../components/ui/Icon";
import { Value } from "../../components/ui/Value";
import { Header } from "../../components/ui/Header";
import { Grid } from "../../components/ui/Grid";
import { Title } from "../../components/ui/Title";
import { ItemList } from "../../components/ui/ItemList";
import { useTypes } from "../../hooks/useTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HoldingProvider, useHolding } from "../../contexts/HoldingContext";
import { useAccount } from "../../contexts/AccountContext";

const HoldingPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ _id: string, account_id: string }>();
	const _id = new Realm.BSON.UUID( params._id );
	
	return (
		<HoldingProvider _id={ _id }>
			<HoldingPage />
		</HoldingProvider>
	)
}

export default HoldingPage;