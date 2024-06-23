import { UpdateMode } from "realm";
import { useQuery, useRealm } from "@realm/react";

import { Account } from "../models/Account";
import { confirmation } from "../helpers";
import { useCallback, useEffect } from "react";
import { useI18n } from "../contexts/I18nContext";

export const useAccounts = () => {
	const { __ } = useI18n();
	const realm = useRealm();
	const accounts = useQuery<Account>( 'Account' );

	const addAccount = useCallback( ( account: Account ) => {
		const title = __( 'Add Account' );
		const message = `${ __( 'Adding a new account' ) }: ${ account.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise( ( resolve, _ ) => {
			confirmation( {
				title: title,
				message: message,
				onAccept() {
					realm.write( () => {
						realm.create( 'Account', account, UpdateMode.Modified );
					} );
					resolve( account );
				}
			} );
		} );
	}, [] );

	useEffect( () => {
		//realm.deleteAll();
		realm.subscriptions.update( mutableSubs => {
			//mutableSubs.removeAll();
			mutableSubs.add( accounts );
		} );
	}, [ accounts ] );

	return { accounts, addAccount }
}