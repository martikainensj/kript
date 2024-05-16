import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "./TextInput";
import { addTimeToDateTimestamp } from "../../helpers";
import { __ } from "../../localization";
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableRipple } from "react-native-paper";

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
	const [ textInputValue, setTextInputValue ] = useState<string>( new Date( value ).toLocaleDateString() );
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState(false);
	
	const show = () => {
    setDatePickerVisibility( true );
  };

  const hide = () => {
    setDatePickerVisibility( false );
  };

	const onPress = () => {
		show();
	}

  const onConfirm = ( date: Date ) => {
		const timestamp = addTimeToDateTimestamp( date.getTime() );
		setValue( timestamp );
		setTextInputValue( date.toLocaleDateString() );
    hide();
  };

	const onCandel = () => {
		hide();
	}

	useEffect( () => {
		if ( ! value ) {
			const currentTimestamp = Date.now();

			setTextInputValue( new Date( currentTimestamp ).toLocaleDateString() );
			setValue( currentTimestamp );
		}
	}, [] );
	
	return (
		<TouchableRipple onPress={ onPress }>
			<View style={ styles.container }>
				<TextInput
					label={ label }
					value={ textInputValue }
					onChangeText={ () => {} }
					editable={ false }
					pointerEvents={ 'none' } />
				<DateTimePicker
					isVisible={ isDatePickerVisible }
					mode={ 'date' }
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