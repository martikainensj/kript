import { useQuery, useRealm, useUser } from "@realm/react";

import { Account } from "../models/Account";
import { UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";

export const useAccounts = () => {
	const realm = useRealm();
	const user: User = useUser();

	const accounts = useQuery(
		Account,
		collection => collection.sorted( 'name' )
	);

	const addAccount = ( account: Account ) => {
		const title = `${ account._id
			? __( 'Update Account' )
			: __( 'Add Account' ) }`;
		const message = ( `${ account._id
			? __( 'Updating existing account' )
			: __( 'Adding a new account' )}: ${ account.name }` )
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
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
		} );
	};

	return { accounts, addAccount }
}