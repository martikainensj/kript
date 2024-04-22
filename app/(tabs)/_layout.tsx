import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { IconSize } from '../../constants';
import { getTranslation } from '../../helpers';

const TabBarIcon = ( props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
} ) => {
  return <Ionicons size={ IconSize.md } style={ styles.tabBarIcon } { ...props } />;
}

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name={ "index" }
        options={ {
          title: getTranslation( 'Home' ),
          tabBarIcon: ( { color, focused } ) =>
						<TabBarIcon name={ focused ? "home" : "home-outline" } color={color} />
        } }
      />
    </Tabs>
  );
}

const styles = StyleSheet.create( {
	tabBarIcon: {

	}
} );