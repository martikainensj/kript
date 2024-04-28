import { useQuery, useRealm, useUser } from "@realm/react";

import { Account, AccountType } from "../models/Account";
import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";

export const useAccounts = () => {
	const realm = useRealm();
	const user: User = useUser();

	const accounts = useQuery(
		Account,
		collection => collection.sorted( 'name' )
	);

	const saveAccount = ( account: AccountType ) => {
		const title = account._id
			? __( 'Update Account' )
			: __( 'Add Account' );
		
		const message = ( account._id
			? __( 'Updating existing account with name: ' ) + account.name
			: __( 'Adding a new account with name: ' ) + account.name )
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, reject ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					realm.write( () => {
						realm.create( Account, account, UpdateMode.Modified );
					} );
					resolve( account );
				}
			} );
		} )
	};

	const removeAccount = ( account: AccountType ) => {
		realm.write( () => {
      realm.delete( account );
    } );
	}

	return { accounts, saveAccount, removeAccount }
}