import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { BorderRadius, FontSize } from "../../constants";
import { StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';

interface TextInputProps extends Omit<PaperTextInputProps, 'value' | 'onChangeText'> {
	value: string | number,
	onChangeText: ( ( text: string | number ) => void ) & Function,
	max?: number,
	min?: number,
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
	max,
	min,
	...rest
} ) => {
	const [inputValue, setInputValue] = useState( value );
	const rightIsVisible =
		! disabled && editable && value;

	const onChangeTextHandler = ( string: string ) => {
		if ( keyboardType === 'numeric' ) {
			string = string.replace(/[^0-9.]/g, '');

			if ( max && parseFloat( string ) > max ) {
				string = max.toString();
			}

			if ( min && parseFloat( string ) < min ) {
				string = min.toString();
			}

			const parts = string.split( '.' );
			const maxPartLength = 12;

			// Prevent multiple dots in the string
			if ( parts.length > 2 ) {
				return;
			}

			let wholePart = parts[0];
			let decimalPart = parts[1];

			// Limit the whole part length
			if ( wholePart?.length > maxPartLength ) {
				return;
			}

			// Limit the decimal part length
			if ( decimalPart?.length > maxPartLength ) {
				return;
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

	useEffect( () => {
		if ( value?.toString() !== inputValue?.toString() ) {		
			setInputValue( value ?? '' );
		}
	}, [value] );

	return (
		<PaperTextInput
			{ ...rest }
			mode={ mode }
			value={ inputValue?.toString() }
			onChangeText={ onChangeTextHandler }
			placeholder={ placeholder }
			keyboardType={ keyboardType }
			editable={ editable }
			multiline={ multiline }
			autoComplete={ autoComplete }
			autoCorrect={ autoCorrect }
			style={ styles.container }
			underlineStyle={ styles.underline }
			outlineStyle={ styles.outline }
			contentStyle={ {
				minHeight: multiline ? 128 : 0
			} }
			right={ rightIsVisible &&
				<PaperTextInput.Icon
					icon={ () => <Icon name={ 'close' } /> }
					onPress={ () => onChangeText( null ) } />
			}
			disabled={ disabled } />
	)
}

const styles = StyleSheet.create( {
	container: {
		fontSize: FontSize.sm,
		borderTopStartRadius: BorderRadius.lg,
		borderTopEndRadius: BorderRadius.lg,
		borderBottomStartRadius: BorderRadius.lg,
		borderBottomEndRadius: BorderRadius.lg,
		flexGrow: 1
	},
	outline: {
		borderBottomWidth: 0,
	},
	underline: {
		display: 'none'
	}
} )