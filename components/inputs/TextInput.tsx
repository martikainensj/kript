import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { BorderRadius, FontSize, Theme } from "../../constants";
import { StyleSheet } from "react-native";
import { Icon } from "../ui";
import { useEffect, useState } from 'react';
import { peek } from '../../helpers';

interface TextInputProps extends Omit<PaperTextInputProps, 'value' | 'onChangeText'> {
	value: string | number,
	onChangeText: ( ( text: string | number ) => void ) & Function
}

export const TextInput: React.FC<TextInputProps> = ( {
	value,
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
	const [inputValue, setInputValue] = useState( value );

	const onChangeTextHandler = ( string: string ) => {
		if ( keyboardType === 'numeric' ) {
			string = string.replace(/[^0-9.]/g, '');

			const decimalParts =  string.split( '.' );
			const lastPart = peek( decimalParts );
			const lastChar = lastPart.slice(-1);

			// Prevent multiple dots in the string
			if ( decimalParts.length > 2 ) {
				return;
			}

			// Limit decimal places to 3 digits
			if ( decimalParts.length > 1 && lastPart.length > 3 ) {
				return setInputValue(
					inputValue.toString().slice(0, -1) + lastChar
				);
			}

			// Prefix string with '0' if it starts with a dot
			if ( string.startsWith( '.' ) ) {
				return setInputValue( `0${ string }` );
			}
		}

		setInputValue( string );
	}

	useEffect( () => {
		if ( keyboardType === 'numeric' ) {
			const numberValue = parseFloat( inputValue?.toString() );

			if ( isNaN( numberValue ) ) {
				return onChangeText( null );
			}

			return onChangeText( numberValue );
		}

		onChangeText( inputValue );
	}, [inputValue] );

	return (
		<PaperTextInput
			mode={ mode }
			value={ inputValue?.toString() }
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
			right={ ( ! disabled && value ) &&
				<PaperTextInput.Icon
					icon={ () => <Icon name={ 'close' } /> }
					onPress={ () => onChangeText( null ) } />
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