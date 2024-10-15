import React from 'react';

import { Icon } from '../../components/ui/Icon';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n/I18nContext';
import { Tabs } from 'expo-router';
import { TabBar } from './TabBar';

interface Props {

}

export const TabsNavigation: React.FC<Props> = ({ }) => {

	const { theme } = useTheme();
	const { __ } = useI18n();

	const focusedColor = theme.colors.primary;
	const iconColor = theme.colors.secondary;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
			sceneContainerStyle={{
				backgroundColor: theme.colors.background,
			}}
			tabBar={(props) => <TabBar {...props} />}
		>
			<Tabs.Screen
				name={"index"}
				options={{
					title: __('Home'),
					tabBarIcon: ({ focused, color, size }) =>
						<Icon	name={focused ? 'home' : 'home-outline'} color={color} size={size} />
				}}
			/>
			<Tabs.Screen
				name={"accounts"}
				options={{
					title: __('Accounts'),
					tabBarIcon: ({ focused, color, size }) =>
						<Icon	name={focused ? 'wallet' : 'wallet-outline'} color={color} size={size} />
				}}
			/>
			<Tabs.Screen
				name={"settings"}
				options={{
					title: __('Settings'),
					tabBarIcon: ({ focused, color, size }) =>
						<Icon name={focused ? 'settings' : 'settings-outline'} color={color} size={size} />
				}}
			/>
		</Tabs>
	);
}