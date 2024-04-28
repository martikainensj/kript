import { useEffect, useState } from "react";
import { useObject, useRealm, useUser } from "@realm/react"

import { Account, AccountType } from "../models/Account"
import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";

interface useAccountProps {
	id?: BSON.ObjectID
}

export const useAccount = ( { id }: useAccountProps ) => {
	const user: User = useUser();
	const realm = useRealm();
	const existingAccount = id && useObject( Account, id );
	const [ account, setAccount ] = useState<AccountType>( {
		name: '',
		owner_id: user.id
	} );

	const saveAccount = () => {
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
	}

	useEffect( () => {
		if ( ! existingAccount ) return;

		setAccount( existingAccount );
	}, [ existingAccount ] );
	
	return { account, setAccount, saveAccount }
}