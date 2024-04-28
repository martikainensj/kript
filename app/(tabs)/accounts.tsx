import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { User } from 'realm';
import { useApp, useRealm, useUser } from '@realm/react';

import { GlobalStyles, Spacing } from '../../constants';
import { __, confirmation } from '../../helpers';
import { AccountItem, AccountForm  } from '../../components/accounts';
import { IconButton} from '../../components/buttons';
import { Header, ItemList } from '../../components/ui';
import { useAccount, useAccounts } from '../../hooks';
import { AccountType } from '../../models';
import { useBottomSheet } from '../../components/contexts';

const Accounts: React.FC = () => {
	const realm = useRealm();
	const user: User = useUser();
	const app = useApp();
	
	const { account, setAccount } = useAccount( {} );
	const { accounts, saveAccount, removeAccount } = useAccounts();
	const { openBottomSheet, closeBottomSheet, setContent } = useBottomSheet();

	const onPressAdd = () => {
		setAccount( { name: '', owner_id: user.id } );
		openBottomSheet();
	}

	const onSubmit = ( account: AccountType ) => {
		saveAccount( account ).then(
			closeBottomSheet
		);
	}

	const onPressAccountItem = ( account: AccountType ) => {
		setAccount( account );
		openBottomSheet();
	}

	useEffect( () => {
		realm.subscriptions.update( mutableSubs => {
			mutableSubs.add( accounts );
		} );
	}, [ realm, accounts ] );

	useEffect( () => {
		setContent(
			<AccountForm
				account={ account }
				onSubmit={ onSubmit } />
		);
	}, [ account ] );

	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Accounts' ) }
				right={ ( 
					<IconButton
						onPress={ onPressAdd }
						icon={ 'add' } />
	 			) } />
			<View style={ styles.contentContainer }>
				<ItemList 
					title={ __( 'Accounts' ) }
					items={ accounts.map( account =>
						<AccountItem onPress={ onPressAccountItem.bind( this, account ) } account={ account }/>
					 ) } />
			</View>
		</View>
	);
};

export default Accounts;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container
	},

	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
		paddingTop: Spacing.md
	}
} );
