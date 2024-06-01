import React from 'react';

import { Icon } from '../../components/ui';
import { BottomTabs } from '../../components/navigation';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useI18n } from '../../components/contexts/I18nContext';

export default function TabsLayout() {
	const theme = useTheme();
	const { __ } = useI18n();
	
  return (
    <BottomTabs
			sceneAnimationEnabled={ true }
			sceneAnimationType={ 'shifting' }
			barStyle={ {
				backgroundColor: theme.colors.background,
				borderTopWidth: StyleSheet.hairlineWidth,
				borderColor: theme.colors.outlineVariant
			} }
			shifting={ true }>
      <BottomTabs.Screen
        name={ "index" }
        options={ {
          title: __( 'Home' ),
          tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? 'home' : 'home-outline' } color={ color } />
        } } />
      <BottomTabs.Screen
        name={ "accounts" }
        options={ {
          title: __( 'Accounts' ),
          tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? 'wallet' : 'wallet-outline' } color={ color } />
        } } />
			<BottomTabs.Screen
				name={ "settings" }
				options={ {
					title: __( 'Settings' ),
					tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? 'settings' : 'settings-outline' } color={ color } />
				} } />
    </BottomTabs>
  );
}
