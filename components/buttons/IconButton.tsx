import React from 'react';
import { IconButton as PaperIconButton, IconButtonProps as PaperIconButtonProps } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { IconSize } from '../../constants';
import { Icon } from '../ui/Icon';

interface IconButtonProps extends PaperIconButtonProps {
	icon: React.ComponentProps<typeof Ionicons>['name'],
}

export const IconButton: React.FC<IconButtonProps> = ( {
	icon,
	mode = 'contained',
	size = IconSize.lg,
	style,
	...rest
} ) => {
	return (
		<PaperIconButton
			{ ...rest }
			icon={ ( { color } ) => <Icon name={ icon } size={ size - 4 } color={ color } />}
			mode={ mode }
			size={ size }
			style={ [ styles.container, style ] }
			/>
	)
}

export default IconButton;

const styles = StyleSheet.create( {
	container: {
		margin: 0,
	}
} );