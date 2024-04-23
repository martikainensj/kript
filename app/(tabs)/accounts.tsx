import React, { useEffect } from 'react';
import { useApp, useRealm, useUser } from '@realm/react';
import { StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { __ } from '../../helpers';
import { AccountItem } from '../../components/accounts';
import { IconButton } from '../../components/buttons';
import { Header, ItemList } from '../../components/ui';
import { useAccounts } from '../../hooks';

const Accounts: React.FC = () => {
	const realm = useRealm();
	const user = useUser();
	const app = useApp();
	const { accounts, addAccount } = useAccounts();

	const addAccountHandler = () => {
		addAccount( 'Test', 'Lorem ipsum' );
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
						icon={ 'plus' } />
	 			) } />
			<View style={ styles.contentContainer }>
				<ItemList 
					title={ __( 'Accounts' ) }
					items={ accounts.map( account =>
						<AccountItem account={ account }/>
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
