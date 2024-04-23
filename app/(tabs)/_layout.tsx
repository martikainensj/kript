import React from 'react';
import { StyleSheet } from 'react-native';

import { __ } from '../../helpers';
import { Icon } from '../../components/ui';
import { BottomTabs } from '../../components/navigation';
import { GlobalStyles, Spacing, Theme } from '../../constants';

export default function TabsLayout() {
  return (
    <BottomTabs
			sceneAnimationEnabled={ true }
			sceneAnimationType={ 'shifting' }
			barStyle={ styles.bar }
			shifting={ true }>
      <BottomTabs.Screen
        name={ "index" }
        options={ {
          title: __( 'Home' ),
          tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? 'home' : 'home-outline' } color={ color } />
        } }
      />
      <BottomTabs.Screen
        name={ "accounts" }
        options={ {
          title: __( 'Accounts' ),
          tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? 'wallet' : 'wallet-outline' } color={ color } />
        } }
      />
    </BottomTabs>
  );
}

const styles = StyleSheet.create( {
	bar: {
		...GlobalStyles.shadow,
		backgroundColor: Theme.colors.background
	}
} );
