import React from 'react';
import 'react-native-get-random-values';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'expo-dev-client';
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

import { GlobalStyles } from '../constants';
import { BottomSheetProvider } from '../components/contexts/BottomSheetContext';

import { I18nProvider } from '../components/contexts/I18nContext';
import { ThemeProvider } from '../components/contexts/ThemeContext';
import { MenuProvider } from '../components/contexts/MenuContext';
import { KriptRealmProvider } from '../components/contexts/KriptRealmContext';

const App: React.FC = () => {
	return (
		<GestureHandlerRootView style={ styles.container }>
			<ThemeProvider>
				<I18nProvider>
					<KriptRealmProvider>
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
					</KriptRealmProvider>
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
