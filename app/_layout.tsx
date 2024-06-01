import React from 'react';
import 'react-native-get-random-values';
import { StyleSheet, useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'expo-dev-client';
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from 'realm';
import { AppProvider, UserProvider, RealmProvider } from '@realm/react';

import { Color, GlobalStyles } from '../constants';
import { LoginScreen } from '../components/authentication';
import { BottomSheetProvider } from '../components/contexts/BottomSheetContext';
import { MenuProvider } from '../components/contexts/MenuContext';
import { Schemas } from '../models';

import { CONFIG } from '../kript.config';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';

const { appId } = CONFIG;

const App: React.FC = () => {
	const colorScheme = useColorScheme();
	const { theme } = useMaterial3Theme( { fallbackSourceColor: Color.fallbackSourceColor } );
	const paperTheme = colorScheme === 'dark'
		? { ...MD3DarkTheme, colors: theme.dark }
		: { ...MD3LightTheme, colors: theme.light }

	return (
		<GestureHandlerRootView style={ styles.container }>
			<PaperProvider theme={ paperTheme }>
				<AppProvider id={ appId }>
					<UserProvider fallback={ <LoginScreen /> }>
						<RealmProvider
							schema={ Schemas }
							sync={ {
								flexible: true,
								existingRealmFileBehavior: {
									type: OpenRealmBehaviorType.DownloadBeforeOpen,
									timeOut: 1000,
									timeOutBehavior: OpenRealmTimeOutBehavior?.OpenLocalRealm,
								},
							} }>
								<MenuProvider>
									<BottomSheetProvider>
										<StatusBar />
										<Stack>
											<Stack.Screen
												name="(tabs)"
												options={ {
													headerShown: false
												} } />
											<Stack.Screen
												name="accounts"
												options={ {
													headerShown: false
												} } />
											<Stack.Screen
												name="holdings"
												options={ {
													headerShown: false
												} } />
										</Stack>
									</BottomSheetProvider>
								</MenuProvider>
						</RealmProvider>
					</UserProvider>
				</AppProvider>
			</PaperProvider>
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
