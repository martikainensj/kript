import React from 'react';
import 'react-native-get-random-values';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'expo-dev-client';
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from 'realm';
import { AppProvider, UserProvider, RealmProvider } from '@realm/react';

import { GlobalStyles, Theme } from '../constants';
import { LoginScreen } from '../components/authentication';
import { BottomSheetProvider } from '../components/contexts/BottomSheetContext';
import { MenuProvider } from '../components/contexts/MenuContext';
import { schemas } from '../models';

import { CONFIG } from '../kript.config';

const { appId } = CONFIG;

const App: React.FC = () => {
	return (
		<GestureHandlerRootView style={ styles.container }>
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
						<PaperProvider theme={ Theme }>
							<MenuProvider>
								<BottomSheetProvider>
									<Stack>
										<Stack.Screen name="(tabs)" options={ { headerShown: false } } />
									</Stack>
								</BottomSheetProvider>
							</MenuProvider>
						</PaperProvider>
					</RealmProvider>
				</UserProvider>
			</AppProvider>
		</GestureHandlerRootView>
	);
};

export default App;
registerRootComponent( App );

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container
	},
} );
