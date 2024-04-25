import { IconButton as PaperIconButton, IconButtonProps as PaperIconButtonProps } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { IconSize, Theme } from '../../constants';
import { Icon } from '../ui';

interface IconButtonProps extends PaperIconButtonProps {
	icon: React.ComponentProps<typeof Ionicons>['name'],
}

export const IconButton: React.FC<IconButtonProps> = ( {
	icon,
	mode = 'contained',
	size = IconSize.md,
	style,
	...rest
} ) => {
	return (
		<PaperIconButton
			icon={ ( { color } ) => <Icon name={ icon } color={ color } />}
			mode={ mode }
			size={ size }
			style={ [ styles.container, style ] }
			theme={ Theme }
			{ ...rest }
			/>
	)
}

export default IconButton;

const styles = StyleSheet.create( {
	container: {
		margin: 0
	}
} );