import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs";
import { Title } from "../ui";
import { GlobalStyles, IconSize } from "../../constants";
import { __ } from "../../helpers";
import { AccountType } from "../../models";

interface AccountFormProps {
	account: AccountType,
	onSubmit: ( account: AccountType ) => void;
}
export const AccountForm = ( {
	account,
	onSubmit
}: AccountFormProps ) => {
	const [ editedAccount, setEditedAccount ] = useState( account );

	useEffect( () => {
		setEditedAccount( account );
	}, [ account ] );

	return (
		<View style={ styles.container }>
			<TextInput
				label={ __( 'Name' ) }
				value={ editedAccount?.name }
				placeholder={ `${ __( 'Example' ) }: ${ __( 'Investment Account' ) }` }
				onChangeText={ name => setEditedAccount( {
					...editedAccount,
					name
				} ) } />
			<TextInput
				label={ __( 'Notes' ) }
				value={ editedAccount?.notes }
				placeholder={ `${ __( 'Enter notes here' ) }...` }
				onChangeText={ notes => setEditedAccount( {
					...editedAccount,
					notes
				} ) }
				multiline={ true } />
			<IconButton
				icon={ 'save' }
				size={ IconSize.xl }
				style={ styles.submitButton }
				disabled={ ! editedAccount?.name }
				onPress={ onSubmit.bind( this, editedAccount ) } />
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