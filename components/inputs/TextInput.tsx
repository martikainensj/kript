import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { BorderRadius, FontSize, Theme } from "../../constants";
import { StyleSheet } from "react-native";
import { Icon } from "../ui";

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
	const onChangeTextHandler = ( string: string ) => {
		if ( keyboardType === 'numeric' ) {
			string = string.replace(/[^0-9.]/g, '');

			if ( string.split( '.' ).length > 2 ) {
				return;
			}

			if ( string.startsWith( '.' ) ) {
				return onChangeText( `0${ string }` );
			}
		}

		onChangeText( string );
	}

	const onBlur = () => {
		if ( keyboardType === 'numeric' ) {
			const numberValue = parseFloat( value?.toString() );

			if ( isNaN( numberValue ) ) {
				return onChangeText( null );
			}

			onChangeText( numberValue );
		}
	}

	return (
		<PaperTextInput
			mode={ mode }
			value={ value?.toString() ?? null }
			onChangeText={ onChangeTextHandler }
			onBlur={ onBlur }
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