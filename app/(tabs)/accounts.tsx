import React, { useEffect } from 'react';
import { useApp, useAuth, useQuery, useRealm, useUser } from '@realm/react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { Account } from '../../models/Account';
import { __ } from '../../helpers';
import { Header } from '../../components/ui';
import { IconButton } from '../../components/buttons';


const Accounts: React.FC = () => {
	const realm = useRealm();
	const user = useUser();
	const app = useApp();
	const { logOut } = useAuth();
	
	const accounts = useQuery(
		Account,
		collection => collection.sorted( 'name' )
	);

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
						icon={ 'plus' } />
	 			) } />
			<View style={ styles.contentContainer }>
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
