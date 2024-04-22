import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import 'expo-dev-client';
import { registerRootComponent } from 'expo'
import { Stack } from 'expo-router';
import { OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from 'realm';
import { AppProvider, UserProvider, RealmProvider } from '@realm/react';

import { schemas } from '../models';
import { LoginScreen } from '../components/authentication/LoginScreen';
import colors from '../styles/colors';

import { CONFIG } from '../kript.config';
import { StatusBar } from 'expo-status-bar';
import { GlobalStyles } from '../constants/globalStyles';

const { appId } = CONFIG;

const App: React.FC = () => {
	return (
		<View style={ styles.container }>
			<StatusBar style="auto" />
			<AppProvider id={ appId }>
				<UserProvider fallback={ <LoginScreen /> }>
					<RealmProvider
						schema={ schemas }
						sync={ {
							flexible: true,
							existingRealmFileBehavior: {
								type: OpenRealmBehaviorType.DownloadBeforeOpen,
								timeOut: 1000,
								timeOutBehavior: OpenRealmTimeOutBehavior?.OpenLocalRealm,
							},
						} }>
						<Stack>
        			<Stack.Screen name="(tabs)" options={ { headerShown: false } } />
						</Stack>
					</RealmProvider>
				</UserProvider>
			</AppProvider>
		</View>
	);
};

export default App;
registerRootComponent( App );

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
		...GlobalStyles.androidSafeArea
	},
} );
