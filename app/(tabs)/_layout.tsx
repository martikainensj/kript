import React from 'react';

import { BottomTabs } from '../../components/navigation';
import { StyleSheet } from 'react-native';
import { useI18n } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Icon } from '../../components/ui/Icon';

export default function TabsLayout() {
	const { theme } = useTheme();
	const { __ } = useI18n();

	const focusedColor = theme.colors.primary;
	const iconColor = theme.colors.secondary;

	return (
		<BottomTabs
			sceneAnimationEnabled={true}
			sceneAnimationType={'shifting'}
			barStyle={{
				backgroundColor: theme.colors.background,
				borderTopWidth: StyleSheet.hairlineWidth,
				borderColor: theme.colors.outlineVariant
			}}
			shifting={true}>
			<BottomTabs.Screen
				name={"index"}
				options={{
					title: __('Home'),
					tabBarIcon: ({ focused }) =>
						<Icon
							name={focused ? 'home' : 'home-outline'}
							color={focused ? focusedColor : iconColor} />
				}} />
			<BottomTabs.Screen
				name={"accounts"}
				options={{
					title: __('Accounts'),
					tabBarIcon: ({ focused }) =>
						<Icon
							name={focused ? 'wallet' : 'wallet-outline'}
							color={focused ? focusedColor : iconColor} />
				}} />
			<BottomTabs.Screen
				name={"settings"}
				options={{
					title: __('Settings'),
					tabBarIcon: ({ focused }) =>
						<Icon
							name={focused ? 'settings' : 'settings-outline'}
							color={focused ? focusedColor : iconColor} />
				}} />
		</BottomTabs>
	);
}
