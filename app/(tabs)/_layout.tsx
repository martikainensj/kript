import React from 'react';
import { StyleSheet } from 'react-native';

import { __ } from '../../helpers';
import { Icon } from '../../components/ui';
import { BottomTabs } from '../../components/navigation';
import { Spacing, Theme } from '../../constants';

export default function TabsLayout() {
  return (
    <BottomTabs
			sceneAnimationEnabled={ true }
			sceneAnimationType={ 'shifting' }
			barStyle={ styles.bar }>
      <BottomTabs.Screen
        name={ "index" }
        options={ {
          title: __( 'Home' ),
          tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? "home" : "home-outline" } color={ color } />
        } }
      />
    </BottomTabs>
  );
}

const styles = StyleSheet.create( {
	bar: {
		shadowRadius: Spacing.sm,
		shadowOpacity: 0.05,
		backgroundColor: Theme.colors.background
	}
} );
