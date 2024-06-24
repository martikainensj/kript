import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import Realm from "realm";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../contexts/MenuContext";
import { AccountForm } from "../../components/accounts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../contexts/I18nContext';
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { FABProvider, useFAB } from "../../contexts/FABContext";
import { useUser } from "../../hooks/useUser";
import { Card } from "../../components/ui/Card";
import { useTypes } from "../../hooks/useTypes";
import { Tabs } from "../../components/ui/Tabs";
import { Icon } from "../../components/ui/Icon";
import { Value } from "../../components/ui/Value";
import { Header } from "../../components/ui/Header";
import { Grid } from "../../components/ui/Grid";
import { Title } from "../../components/ui/Title";
import { ItemList } from "../../components/ui/ItemList";
import HoldingItem from "../../components/holdings/HoldingItem";
import TransactionItem from "../../components/transactions/TransactionItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AccountProvider } from "../../contexts/AccountContext";
import AccountView from "../../components/accounts/AccountView";

const AccountPage: React.FC = ( {} ) => {
	const params = useLocalSearchParams<{ id: string }>();
	const _id = new Realm.BSON.UUID( params.id );

	return (
		<AccountProvider _id={ _id }>
			<AccountView />
		</AccountProvider>
	)
}

export default AccountPage;

const styles = StyleSheet.create( {
} );