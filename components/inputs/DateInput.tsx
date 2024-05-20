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
	const [ inputValue, setInputValue ] = useState<string>( new Date( value ).toLocaleDateString() );
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

			setInputValue( new Date( currentTimestamp ).toLocaleDateString() );
			setValue( currentTimestamp );
		}
	}, [] );
	
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