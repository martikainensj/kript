import { useQuery, useRealm } from "@realm/react";

import { Account } from "../models/Account";

export const useAccounts = () => {
	const realm = useRealm();

	const accounts = useQuery(
		Account,
		collection => collection.sorted( 'name' )
	);

	const addAccount = ( name: string , notes: string ) => {
		realm.write( () => {
      realm.create('Account', { name, notes } );
    } );
	};

	return { accounts, addAccount }
}