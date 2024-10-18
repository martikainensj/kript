import React from "react";
import Realm from "realm";
import { useLocalSearchParams } from "expo-router";

import AccountView from "../../../components/accounts/AccountView";
import { useData } from "../../../features/data/DataContext";

const AccountPage: React.FC = ({ }) => {
	const { getAccountBy } = useData();
	const params = useLocalSearchParams<{ accountId: string, name: string }>();
	const account = getAccountBy('_id', new Realm.BSON.UUID(params.accountId));

	return (
		<AccountView account={account} />
	)
}

export default AccountPage;