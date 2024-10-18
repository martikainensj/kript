import React, { createContext, useContext, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Action } from './types';
import { GlobalStyles } from '../../constants';
import { FABActions } from './FABActions';

interface Props extends Action {
	children: React.ReactNode;
	actions?: Action[];
}

export const FAB: React.FC<Props> = ({
	children,
	...rest
}) => {
	return (
		<View style={styles.container}>
			{children}
			<FABActions {...rest} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
	}
})