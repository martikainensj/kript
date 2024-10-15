import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { BorderRadius, IconSize } from '../../constants';
import { Icon } from '../ui/Icon';
import { useTheme } from '../../features/theme/ThemeContext';

interface IconButtonProps extends TouchableOpacityProps {
	icon: React.ComponentProps<typeof Ionicons>['name'];
	size?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
	icon,
	size = IconSize.md,
	...rest
}) => {
	const { theme } = useTheme();

	return (
		<TouchableOpacity
			{...rest}
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.surfaceVariant,
					height: size + 16,
					aspectRatio: 1
				},
				rest.style
			]}
		>
			<Icon name={icon} size={size} color={theme.colors.primary} />
		</TouchableOpacity>
	)
}

export default IconButton;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: BorderRadius.xl,
		overflow: 'hidden'
	}
});