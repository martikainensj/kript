import { useCallback, useEffect, useState } from "react";
import { useObject, useRealm, useUser } from "@realm/react"

import { Account } from "../models/Account"
import { BSON, UpdateMode, User } from "realm";
import { __, confirmation } from "../helpers";
import { router } from "expo-router";

interface useAccountProps {
	id?: BSON.ObjectID
}

export const useAccount = ( { id }: useAccountProps = {} ) => {
	const user: User = useUser();
	const realm = useRealm();
	const existingAccount = id && useObject( Account, id );
	const [ account, setAccount ] = useState<Account>();

	const saveAccount = useCallback( ( editedAccount: Account ) => {
		const title = `${ editedAccount._id
			? __( 'Update Account' )
			: __( 'Add Account' ) }`;
		const message = ( `${ editedAccount._id
			? __( 'Updating existing account' )
			: __( 'Adding a new account' )}` )
			+ `: ${ editedAccount.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					realm.write( () => {
						realm.create( Account, editedAccount, UpdateMode.Modified );
					} );

					resolve( editedAccount );
				}
			} );
		} )
	}, [] );

	const removeAccount = useCallback( () => {
		const title = __( 'Remove Account' );
		const message = `${ __( 'Removing existing account' ) }: ${ existingAccount.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title,
				message,
				onAccept() {
					router.navigate( 'accounts/' );

					realm.write( () => {
						realm.delete( account );
					} );

					setAccount( null );
					resolve( true );
				}
			} );
		} );
	}, [ account ] );

	useEffect( () => {
		existingAccount?.isValid() && setAccount( existingAccount );
	}, [ existingAccount ] );
	
	return { account, setAccount, saveAccount, removeAccount }
}