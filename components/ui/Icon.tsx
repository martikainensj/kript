import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { IconSize, Theme } from '../../constants';

interface IconProps {
	name: React.ComponentProps<typeof Ionicons>['name'],
	size?: number,
	color?: string
}

export const Icon: React.FC<IconProps> = ( {
	name,
	size = IconSize.md,
	color = Theme.colors.primary
} ) => {
  return <Ionicons name={ name } size={ size } color={ color } />;
}