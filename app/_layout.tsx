import React, { useLayoutEffect } from 'react';
import 'react-native-get-random-values';
import { Appearance, StyleSheet, useColorScheme } from 'react-native';
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
import { Schemas } from '../models';

import { CONFIG } from '../kript.config';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useStorage } from '../hooks/useStorage';
import { I18nProvider } from '../components/contexts/I18nContext';
import { ThemeProvider } from '../components/contexts/ThemeContext';
import { MenuProvider } from '../components/contexts/MenuContext';

const { appId } = CONFIG;

const App: React.FC = () => {
	return (
		<GestureHandlerRootView style={ styles.container }>
			<ThemeProvider>
				<I18nProvider>
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
				</I18nProvider>
			</ThemeProvider>
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
