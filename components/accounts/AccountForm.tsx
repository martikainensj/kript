import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs";
import { GlobalStyles, IconSize } from "../../constants";
import { __ } from "../../helpers";
import { Account, AccountType } from "../../models/Account";

interface AccountFormProps {
	account: Account,
	onSubmit: ( account: Account ) => void;
}

export const AccountForm = ( {
	account,
	onSubmit
}: AccountFormProps ) => {
	const [ editedAccount, setEditedAccount ] = useState<AccountType>( { ...account } );

	useEffect( () => {
		setEditedAccount( account );
	}, [ account ] );

	return (
		<View style={ styles.container }>
			<TextInput
				label={ __( 'Name' ) }
				value={ editedAccount?.name }
				placeholder={ `${ __( 'Example' ) }: ${ __( 'Investment Account' ) }` }
				onChangeText={ name => setEditedAccount(
					Object.assign( { ...editedAccount }, { name } )
				 ) } />
			<TextInput
				label={ __( 'Notes' ) }
				value={ editedAccount?.notes }
				placeholder={ `${ __( 'Enter notes here' ) }...` }
				onChangeText={ notes => setEditedAccount( 
					Object.assign( { ...editedAccount }, { notes } )
				) }
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