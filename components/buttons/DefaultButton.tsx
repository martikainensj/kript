import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { BorderRadius, GlobalStyles, Spacing } from '../../constants';
import { useTheme } from '../../features/theme/ThemeContext';
import { Text } from '../ui/Text';

interface Props extends TouchableOpacityProps {
	children: string,
	mode?: 'default' | 'outlined' | 'text' | 'inverted';
}

export const DefaultButton: React.FC<Props> = ({
	children,
	mode = 'default',
	...rest
}) => {
	const { theme } = useTheme();
	return (
		<TouchableOpacity
			style={styles.container}
			{...rest}
		>
			<View
				style={[
					styles.content,
					mode === 'default' && { backgroundColor: theme.colors.primary },
					mode === 'inverted' && { backgroundColor: theme.colors.background },
					mode === 'outlined' && { borderColor: theme.colors.onBackground },
					mode === 'text' && { padding: 0 },
					rest.style
				]}
			>
				<Text
					textAlign='center'
					style={[
						mode === 'default' && { color: theme.colors.onPrimary },
					]}
				>
					{children}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: 'hidden'
	},
	content: {
		...GlobalStyles.button,
		gap: Spacing.sm,
		borderRadius: BorderRadius.md,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: 'transparent'
	}
});