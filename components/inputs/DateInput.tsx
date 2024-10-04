import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "./TextInput";
import { addTimeToDateTimestamp } from "../../helpers";
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableRipple } from "react-native-paper";
import { useTheme } from "../../features/theme/ThemeContext";

interface DateInputProps {
	label: string
	value: number
	setValue: React.Dispatch<React.SetStateAction<number>>
}

export const DateInput: React.FC<DateInputProps> = ( {
	label,
	value,
	setValue
} ) => {
	const { dark } = useTheme();
	const [ inputValue, setInputValue ] = useState<string>();
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState(false);

	const onPress = () => {
		setDatePickerVisibility( true );
	}

	const onCandel = () => {
		setDatePickerVisibility( false );
	}

	const onConfirm = ( date: Date ) => {
		const timestamp = addTimeToDateTimestamp( date.getTime() );

		setValue( timestamp );
		setInputValue( date.toLocaleDateString() );
		setDatePickerVisibility( false );
	};

	useEffect( () => {
		if ( ! value ) {
			const currentTimestamp = Date.now();
			setInputValue( new Date( currentTimestamp ).toLocaleDateString( 'fi' ) );
			setValue( currentTimestamp );
		}
	}, [] );

	useLayoutEffect(() => {
		setInputValue( new Date( value ).toLocaleDateString( 'fi' ) );
	}, [ value ]);

	return (
		<TouchableRipple onPress={ onPress }>
			<View style={ styles.container }>
				<TextInput
					label={ label }
					value={ inputValue }
					onChangeText={ () => {} }
					editable={ false }
					pointerEvents={ 'none' } />
				<DateTimePicker
					isDarkModeEnabled={ dark }
					isVisible={ isDatePickerVisible }
					mode={ 'date' }
					date={ new Date( value ) }
					onConfirm={ onConfirm }
					onCancel={ onCandel } />
			</View>
		</TouchableRipple>
	)
}

const styles = StyleSheet.create( {
	container: {

	}
} );