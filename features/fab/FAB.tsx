import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants';
import { FABActions } from './FABActions';
import { Action } from '../../constants/types';

interface Props extends Action {
	children: React.ReactNode;
	actions?: Action[];
	side?: 'left' | 'right';
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