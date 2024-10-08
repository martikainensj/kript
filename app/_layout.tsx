import React from 'react';
import 'expo-dev-client';
import 'react-native-get-random-values';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

import { GlobalStyles } from '../constants';
import { BottomSheetProvider } from '../contexts/BottomSheetContext';
import { ChartSheetProvider } from '../contexts/ChartSheetContext';
import { AlertProvider } from '../features/alerts/AlertContext';
import { ThemeProvider } from '../features/theme/ThemeContext';
import { I18nProvider } from '../features/i18n/I18nContext';
import { RealmProvider } from '../features/realm/RealmContext';

export default function AppLayout() {
	return (
		<GestureHandlerRootView style={ styles.container }>
			<ThemeProvider>
				<I18nProvider>
					<AlertProvider>
						<RealmProvider>
							<BottomSheetProvider>
								<ChartSheetProvider>
									<StatusBar />
									<Stack screenOptions={ {
										animationDuration: 200,
										animation: 'fade_from_bottom',
										headerShown: false
									} } />
								</ChartSheetProvider>
							</BottomSheetProvider>
						</RealmProvider>
					</AlertProvider>
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
