import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from 'react-native-paper/react-navigation';

import { withLayoutContext } from "expo-router";

const { Navigator } = createMaterialBottomTabNavigator();

export const BottomTabs = withLayoutContext<
	MaterialBottomTabNavigationOptions,
	typeof Navigator,
	null,
	null
>( Navigator );