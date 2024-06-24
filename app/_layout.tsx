import React from 'react';
import 'react-native-get-random-values';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'expo-dev-client';
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

import { GlobalStyles } from '../constants';
import { BottomSheetProvider } from '../contexts/BottomSheetContext';

import { I18nProvider } from '../contexts/I18nContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { MenuProvider } from '../contexts/MenuContext';
import { KriptRealmProvider } from '../contexts/KriptRealmContext';

export default function AppLayout() {
	return (
		<GestureHandlerRootView style={ styles.container }>
			<ThemeProvider>
				<I18nProvider>
					<KriptRealmProvider>
						<MenuProvider>
							<BottomSheetProvider>
								<StatusBar />
								<Stack screenOptions={ {
									animationDuration: 200,
									animation: 'fade_from_bottom',
									headerShown: false
								} } />
							</BottomSheetProvider>
						</MenuProvider>
					</KriptRealmProvider>
				</I18nProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
};

registerRootComponent( AppLayout );

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container
	},
} );
