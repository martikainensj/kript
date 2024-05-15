import React from 'react';

import { __ } from '../../localization';
import { Icon } from '../../components/ui';
import { BottomTabs } from '../../components/navigation';
import { GlobalStyles } from '../../constants';

export default function TabsLayout() {
  return (
    <BottomTabs
			sceneAnimationEnabled={ true }
			sceneAnimationType={ 'shifting' }
			barStyle={ GlobalStyles.footer }
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
    </BottomTabs>
  );
}
