import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { IconSize } from '../../constants';
import { useTheme } from 'react-native-paper';

interface IconProps {
	name: React.ComponentProps<typeof Ionicons>['name'],
	size?: number,
	color?: string
}

export const Icon: React.FC<IconProps> = ( {
	name,
	size = IconSize.md,
	color
} ) => {
	const theme = useTheme();
  return <Ionicons name={ name } size={ size } color={ color ?? theme.colors.primary } />;
}