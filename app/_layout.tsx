import React, { useEffect } from 'react';
import 'expo-dev-client';
import 'react-native-get-random-values';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from 'expo-router';

import { GlobalStyles } from '../constants';
import { AlertProvider } from '../features/alerts/AlertContext';
import { ThemeProvider } from '../features/theme/ThemeContext';
import { I18nProvider } from '../features/i18n/I18nContext';
import { RealmProvider } from '../features/realm/RealmContext';
import { useFonts } from 'expo-font';
import { RootNavigation } from '../features/navigation/RootNavigation';
import { ToastProvider } from '../features/toasts/ToastsContext';
import { BottomSheetProvider } from '../features/bottomSheet/BottomSheetContext';

export default function AppLayout() {
	const [loaded, error] = useFonts({
		'MonaSans-Black': require('../assets/fonts/MonaSans-Black.otf'),
		'MonaSans-Bold': require('../assets/fonts/MonaSans-Bold.otf'),
		'MonaSans-ExtraBold': require('../assets/fonts/MonaSans-ExtraBold.otf'),
		'MonaSans-ExtraLight': require('../assets/fonts/MonaSans-ExtraLight.otf'),
		'MonaSans-Light': require('../assets/fonts/MonaSans-Light.otf'),
		'MonaSans-Medium': require('../assets/fonts/MonaSans-Medium.otf'),
		'MonaSans-Regular': require('../assets/fonts/MonaSans-Regular.otf'),
		'MonaSans-SemiBold': require('../assets/fonts/MonaSans-SemiBold.otf'),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<GestureHandlerRootView style={styles.container}>
			<ThemeProvider>
				<I18nProvider>
					<ToastProvider>
						<AlertProvider>
							<RealmProvider>
								<BottomSheetProvider>
									<StatusBar />
									<RootNavigation />
								</BottomSheetProvider>
							</RealmProvider>
						</AlertProvider>
					</ToastProvider>
				</I18nProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
};

registerRootComponent(AppLayout);

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},
});
