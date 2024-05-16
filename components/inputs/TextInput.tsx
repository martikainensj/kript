import { useState, useEffect } from "react";
import { TextInput as PaperTextInput, TextInputProps } from 'react-native-paper';
import { BorderRadius, FontSize, Theme } from "../../constants";
import { StyleSheet } from "react-native";
import { Icon } from "../ui";

export const TextInput: React.FC<TextInputProps> = ( {
	value = '',
	onChangeText,
	placeholder = 'Write here...',
	keyboardType = 'default',
	editable = true,
	multiline = false,
	autoComplete = "off",
	autoCorrect = false,
	mode = 'flat',
	disabled,
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
			style={ styles.container }
			underlineStyle={ styles.underline }
			outlineStyle={ styles.outline }
			contentStyle={ {
				minHeight: multiline ? 128 : 0
			} }
			right={ ( ! disabled && editedValue ) &&
				<PaperTextInput.Icon
					icon={ () => <Icon name={ 'close' } /> }
					onPress={ () => setEditedValue( null ) } />
			}
			disabled={ disabled }
			{ ...rest } />
	)
}

const styles = StyleSheet.create( {
	container: {
		fontSize: FontSize.sm,
		borderRadius: BorderRadius.md,
		borderTopLeftRadius: BorderRadius.md,
		borderTopRightRadius: BorderRadius.md
	},
	outline: {
		borderBottomWidth: 0,
	},
	underline: {
		display: 'none'
	}
} )