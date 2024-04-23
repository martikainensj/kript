import { useState, useEffect } from "react";
import { TextInput as PaperTextInput, TextInputProps } from 'react-native-paper';
import { FontSize, Theme } from "../../constants";

export const TextInput: React.FC<TextInputProps> = ( {
	value = '',
	onChangeText,
	placeholder = 'Write here...',
	keyboardType = 'default',
	editable = true,
	multiline = false,
	autoComplete = "off",
	autoCorrect = false,
	mode = 'outlined',
	...rest 
} ) => {
	const [ editedValue, setEditedValue ] = useState( value );

	const onChangeTextHandler = ( value: string ) => {
		setEditedValue( value );
	}

	useEffect( () => {
		editedValue !== value && setEditedValue( value );
	}, [ value ] );

	useEffect( () => {
		editedValue !== value && onChangeText( editedValue );
	}, [ editedValue ] );

	return (
		<PaperTextInput
			mode={ mode }
			value={ !! editedValue ? editedValue.toString() : null }
			onChangeText={ onChangeTextHandler }
			placeholder={ placeholder }
			keyboardType={ keyboardType }
			editable={ editable }
			multiline={ multiline }
			autoComplete={ autoComplete }
			autoCorrect={ autoCorrect }
			theme={ Theme }
			style={ {
				fontSize: FontSize.sm
			} }
			contentStyle={ {
				minHeight: multiline ? 128 : 0
			} }
			{ ...rest } />
	)
}