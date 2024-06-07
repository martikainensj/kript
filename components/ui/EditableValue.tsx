import React, { useState } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Value } from "./Value";
import { IconButton } from "../buttons";
import { Spacing } from "../../constants";
import { TextInput } from "../inputs";

interface EditableValueProps {
	label: string;
	value: string | number;
	setValue: React.Dispatch<React.SetStateAction<EditableValueProps['value']>>
	unit?: string;
	isVertical?: boolean;
	valueContainerStyle?: ViewStyle;
	valueStyle?: TextStyle;
	unitStyle?: TextStyle;
	isEditing?: boolean;
}

export const EditableValue: React.FC<EditableValueProps> = ( {
	label,
	value,
	setValue,
	unit,
	isVertical,
	unitStyle,
	valueContainerStyle,
	valueStyle,
} ) => {
	const [ isEditing, setIsEditing ] = useState( false );
	const [ editedValue, setEditedValue ] = useState( value );

	return isEditing ? (
		<View style={ styles.inputWrapper }>
			<TextInput
				style={ styles.inputContainer}
				label={ label}
				value={ editedValue }
				placeholder={ '' }
				onChangeText={ setEditedValue } />

			<IconButton
				icon={ 'save' }
				size={ Spacing.lg }
				onPress={ () => {
					setIsEditing( false );
					setValue( editedValue );
				} }
				style={ styles.editButton } />
		</View>
	) : (
		<View style={ styles.valueWrapper }>
			<Value
				label={ label }
				value={ value }
				containerStyle={ styles.valueContainer }
				unit={ unit }
				isVertical={ isVertical }
				unitStyle={ unitStyle }
				valueContainerStyle={ valueContainerStyle }
				valueStyle={ valueStyle } />

			<IconButton
				icon={ 'pencil' }
				size={ Spacing.md }
				onPress={ () => setIsEditing( true ) }
				style={ styles.saveButton } />
		</View>
	) 
}

const styles = StyleSheet.create( {
	inputWrapper: {
		flexDirection: 'row',
				alignItems: 'center',
				gap: Spacing.sm
	},
	inputContainer: {
		flexGrow: 1,
				flexShrink: 1
	},
	valueWrapper: {
		flexDirection: 'row',
				alignItems: 'center',
				gap: Spacing.sm
	},
	valueContainer: {
		flexGrow: 1,
				flexShrink: 1
	},
		saveButton: {
				backgroundColor: 'transparent',
				flexShrink: 0
		},
		editButton: {
				backgroundColor: 'transparent',
				flexShrink: 0
		}
} )