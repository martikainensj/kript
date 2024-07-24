import React from "react";
import Realm from "realm";
import { useLocalSearchParams } from "expo-router";

import { FABProvider } from "../../../contexts/FABContext";
import { useData } from "../../../contexts/DataContext";
import AccountView from "../../../components/accounts/AccountView";
import { ChartSheetProvider } from "../../../contexts/ChartSheetContext";

const AccountPage: React.FC = ( {} ) => {
	const { getAccountBy } = useData();
	const params = useLocalSearchParams<{ accountId: string, name: string }>();
	const account = getAccountBy( '_id', new Realm.BSON.UUID( params.accountId ) );

	return (
		<ChartSheetProvider>
			<FABProvider>
				<AccountView account={ account } />
			</FABProvider>
		</ChartSheetProvider>
	)
}

export default AccountPage;