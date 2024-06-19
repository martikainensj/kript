import { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs";
import { GlobalStyles, IconSize } from "../../constants";
import { allSet, stripRealmListsFromObject } from "../../helpers";
import { Holding } from "../../models/Holding";
import { useI18n } from "../contexts/I18nContext";
import { Divider } from "../ui/Divider";

interface HoldingFormProps {
	holding: Holding,
	onSubmit: ( holding: Holding ) => void;
}

export const HoldingForm = ( {
	holding,
	onSubmit
}: HoldingFormProps ) => {
	const { __ } = useI18n();
	const [ editedHolding, setEditedHolding ]
		= useState( { ...holding } );

	const { name, notes } = editedHolding;

	const handleDismissKeyboard = ( ) => {
    Keyboard.dismiss();
  };

	const onSubmitHandler = () => {
		handleDismissKeyboard();
		onSubmit( stripRealmListsFromObject( editedHolding ) );
	}
		
	useEffect( () => {
		setEditedHolding( { ...holding } );
	}, [ holding ] );

	return (
    <TouchableWithoutFeedback onPress={ handleDismissKeyboard }>
			<View style={ styles.container }>
				<TextInput
					label={ __( 'Name' ) }
					value={ name }
					placeholder={ `${ __( 'Example' ) }: Apple Inc.` }
					onChangeText={ name => setEditedHolding(
						Object.assign( { ...editedHolding }, { name } )
					) } />

				<TextInput
					label={ __( 'Notes' ) }
					value={ notes }
					placeholder={ `${ __( 'Enter notes here' ) }...` }
					onChangeText={ notes => setEditedHolding(
						Object.assign( { ...editedHolding }, { notes } )
					) }
					multiline={ true } />

				<Divider />

				<IconButton
					icon={ 'save' }
					size={ IconSize.xl }
					style={ styles.submitButton }
					disabled={ ! allSet( name ) }
					onPress={ onSubmitHandler } />
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.form,
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
} );