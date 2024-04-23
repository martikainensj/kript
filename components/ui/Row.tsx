import { StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing } from '../../constants';

interface RowProps {
	children: React.ReactNode,
	gap?: number,
	style: ViewStyle
}

export const Row: React.FC<RowProps> = ( { children, gap = Spacing.sm, style } ) => {
	return (
		<View style={ [
			styles.container,
			style,
			{ gap }
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
		flexWrap: 'wrap'
	}
} );