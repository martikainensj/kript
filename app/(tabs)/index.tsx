import React, { useEffect, useState } from 'react';
import { useApp, useAuth, useQuery, useRealm, useUser } from '@realm/react';
import { Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Account } from '../../models/Account';
import { buttonStyles } from '../../styles/button';
import { Color } from '../../constants';


const App: React.FC = () => {
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
		<SafeAreaView>
			<Text style={ styles.idText }>Syncing with app id: { app.id }</Text>
			<Pressable style={ styles.authButton } onPress={ logOut }>
				<Text style={ styles.authButtonText }>
					{ `Logout ${user?.profile.email}` }
				</Text>
			</Pressable>
		</SafeAreaView>
	);
};

export default App;

const styles = StyleSheet.create({
	idText: {
		color: '#999',
		paddingHorizontal: 20,
	},
	authButton: {
		...buttonStyles.button,
		backgroundColor: Color.accent,
	},
	authButtonText: {
		...buttonStyles.text,
	},
});
