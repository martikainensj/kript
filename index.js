import 'expo-dev-client';
import React from 'react';
import { registerRootComponent } from 'expo'
import { AppWrapper } from './app/AppWrapper';
import { CONFIG } from './kript.config';

const { appId } = CONFIG;

const App = () => <AppWrapper appId={ appId } />

registerRootComponent(App);
