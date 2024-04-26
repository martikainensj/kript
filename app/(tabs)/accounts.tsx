import React, { useEffect } from 'react';
import { useApp, useRealm, useUser } from '@realm/react';
import { StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { __ } from '../../helpers';
import { AccountItem } from '../../components/accounts';
import { IconButton } from '../../components/buttons';
import { Header, ItemList } from '../../components/ui';
import { useAccounts } from '../../hooks';
import { AccountType } from '../../models/Account';
import { User } from 'realm';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Text } from 'react-native-paper';
import { BottomSheetView } from '@gorhom/bottom-sheet';

const Accounts: React.FC = () => {
	const realm = useRealm();
	const user: User = useUser();
	const app = useApp();
	const { accounts, addAccount, removeAccount } = useAccounts();

	const addAccountHandler = () => {
		addAccount( {
			name: 'Test',
			owner_id: user.id
		} );
	}

	const onPressAccountItem = ( account: AccountType ) => {
		removeAccount( account );
	}

	useEffect( () => {
		realm.subscriptions.update( mutableSubs => {
			mutableSubs.add( accounts );
		} );
	}, [ realm, accounts ] );

	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Accounts' ) }
				right={ ( 
					<IconButton
						onPress={ addAccountHandler }
						icon={ 'add' } />
	 			) } />
			<View style={ styles.contentContainer }>
				<ItemList 
					title={ __( 'Accounts' ) }
					items={ accounts.map( account =>
						<AccountItem onPress={ onPressAccountItem.bind( this, account ) } account={ account }/>
					 ) } />
			</View>
			<BottomSheet>
				<BottomSheetView>
					<Text>Test</Text>
				</BottomSheetView>
			</BottomSheet>
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
