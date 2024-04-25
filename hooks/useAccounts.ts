import { useQuery, useRealm, useUser } from "@realm/react";

import { Account, AccountType } from "../models/Account";
import { BSON, User } from "realm";

export const useAccounts = () => {
	const realm = useRealm();
	const user: User = useUser();

	const accounts = useQuery(
		Account,
		collection => collection.sorted( 'name' )
	);


	const addAccount = ( account: AccountType ) => {
		realm.write( () => {
      realm.create('Account', account );
    } );
	};

	const removeAccount = ( account: AccountType ) => {
		realm.write( () => {
      realm.delete( account );
    } );
	}

	return { accounts, addAccount, removeAccount }
}