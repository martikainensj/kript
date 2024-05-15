import React from 'react';
import { GestureResponderEvent, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { BorderRadius } from '../../constants';

interface OptionProps {
	value: string;
	icon?: IconSource;
	disabled?: boolean;
	accessibilityLabel?: string;
	checkedColor?: string;
	uncheckedColor?: string;
	onPress?: ( event: GestureResponderEvent ) => void;
	label?: string;
	showSelectedCheck?: boolean;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	testID?: string;
}

interface SelectProps {
	value: any,
	setValue: React.Dispatch<React.SetStateAction<any>>
	options: OptionProps[]
}

export const Select: React.FC<SelectProps> = ( {
	options,
	value,
	setValue
} ) => {
	const onValueChange = ( value ) => {
		setValue( value );
	}
	
	return (
		<SegmentedButtons
			value={ value }
			onValueChange={ onValueChange }
			buttons={ options?.map( option => {
				return {
					...option,
					showSelectedCheck: true
				}	
			} ) }
			style={ styles.container } />
	);
}

const styles = StyleSheet.create( {
	container: {

	}
} );