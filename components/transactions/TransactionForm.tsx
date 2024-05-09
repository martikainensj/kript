import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs";
import { GlobalStyles, IconSize } from "../../constants";
import { __ } from "../../helpers";
import { Transaction, TransactionType } from "../../models/Transaction";

interface TransactionFormProps {
	transaction: Transaction,
	onSubmit: ( transaction: Transaction ) => void;
}

export const TransactionForm = ( {
	transaction,
	onSubmit
}: TransactionFormProps ) => {
	const [ editedTransaction, setEditedTransaction ] = useState<TransactionType>( { ...transaction } );

	useEffect( () => {
		setEditedTransaction( transaction );
	}, [ transaction ] );

	return (
		<View style={ styles.container }>
			<TextInput
				label={ __( 'Notes' ) }
				value={ editedTransaction?.notes }
				placeholder={ `${ __( 'Enter notes here' ) }...` }
				onChangeText={ notes => setEditedTransaction( 
					Object.assign( { ...editedTransaction }, { notes } )
				) }
				multiline={ true } />
			<IconButton
				icon={ 'save' }
				size={ IconSize.xl }
				style={ styles.submitButton }
				disabled={ ! editedTransaction?.account }
				onPress={ onSubmit.bind( this, editedTransaction ) } />
		</View>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.form
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
} );