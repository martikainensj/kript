import { StyleSheet } from 'react-native';
import { FAB as PaperFAB, FABGroupProps } from 'react-native-paper';
import { BorderRadius, IconSize } from '../../constants';
import { useState } from 'react';
import { Icon } from './Icon';

interface FABProps {
	actions: FABGroupProps["actions"]
}

export const FAB: React.FC<FABProps> = ( {
	actions,
	...rest
} ) => {

	const [ showActions, setShowActions ] = useState( false );
  
	const onStateChange = () => {
		setShowActions( ! showActions );
	};

	return (
		<PaperFAB.Group
			open={ showActions }
			visible={ !! actions }
			icon={ () => {
				return showActions
				? <Icon name={ 'close' } size={ IconSize.lg } />
				: <Icon name={ 'add' } size={ IconSize.lg } />
			} }
			actions={ actions }
			onStateChange={ onStateChange }
			fabStyle={ styles.fabGroup }
			{ ...rest } />
	);
}

const styles = StyleSheet.create( {
	fabGroup: {
		borderRadius: BorderRadius.xl
	}
} );