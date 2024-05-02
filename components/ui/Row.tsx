import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing } from '../../constants';

interface RowProps {
	children: React.ReactNode,
	style?: ViewStyle
}

export const Row: React.FC<RowProps> = ( { children, style } ) => {
	return (
		<View style={ [
			styles.container,
			style
		] }>
			{ children }
		</View>
	);
}

const styles = StyleSheet.create( {
	container: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		gap: Spacing.md
	}
} );