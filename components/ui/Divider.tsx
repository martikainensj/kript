import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing } from '../../constants';
import React from 'react';
import { useTheme } from '../../features/theme/ThemeContext';

interface Props {
	style?: StyleProp<ViewStyle>
}

export const Divider: React.FC<Props> = ({ style }) => {
	const { theme } = useTheme();

	return (
		<View style={[
			styles.container,
			{ backgroundColor: theme.colors.outlineVariant },
			style
		]} />
	);
}

const styles = StyleSheet.create({
	container: {
		height: StyleSheet.hairlineWidth
	},
})