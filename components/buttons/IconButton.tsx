import { IconButton as PaperIconButton, IconButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { IconSize, Theme } from '../../constants';

export const IconButton: React.FC<IconButtonProps> = ( {
	mode = 'contained',
	size = IconSize.md,
	style,
	...rest
} ) => {
	return (
		<PaperIconButton
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