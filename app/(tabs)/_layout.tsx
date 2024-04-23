import React from 'react';
import { Tabs } from 'expo-router';

import { __ } from '../../helpers';
import { Icon } from '../../components/ui';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name={ "index" }
        options={ {
          title: __( 'Home' ),
          tabBarIcon: ( { color, focused } ) =>
						<Icon name={ focused ? "home" : "home-outline" } color={ color } />
        } }
      />
    </Tabs>
  );
}