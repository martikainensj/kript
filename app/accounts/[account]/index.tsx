import React from "react";
import Realm from "realm";
import { useLocalSearchParams } from "expo-router";

import { FABProvider } from "../../../contexts/FABContext";
import AccountView from "../../../components/accounts/AccountView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../../features/data/DataContext";

const AccountPage: React.FC = ({ }) => {
	const insets = useSafeAreaInsets();
	const { getAccountBy } = useData();
	const params = useLocalSearchParams<{ accountId: string, name: string }>();
	const account = getAccountBy('_id', new Realm.BSON.UUID(params.accountId));

	return (
		<FABProvider insets={insets}>
			<AccountView account={account} />
		</FABProvider>
	)
}

export default AccountPage;