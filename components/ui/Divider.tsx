import { StyleSheet, View } from 'react-native';
import { Spacing } from '../../constants';
import React from 'react';
import { Divider as PaperDivider } from 'react-native-paper';

export const Divider: React.FC = () => {
	return (
		<View style={ styles.container }>
			<PaperDivider />
		</View>
	);
}

const styles = StyleSheet.create( {
	container: {
		marginVertical: Spacing.sm,
		marginHorizontal: -Spacing.md
	}
} )