import 'expo-dev-client';
import React from 'react';
import { registerRootComponent } from 'expo'
import { AppWrapperNonSync } from './app/AppWrapperNonSync';
import { AppWrapperSync } from './app/AppWrapperSync';
import { CONFIG } from './app.config';

const { sync } = CONFIG;

const App = () =>
	sync.enabled ? (
    <AppWrapperSync appId={ sync.appId } />
  ) : (
    <AppWrapperNonSync />
  );

registerRootComponent(App);
