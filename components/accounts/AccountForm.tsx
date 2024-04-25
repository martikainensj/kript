import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants";
import { AccountType } from "../../models/Account";
import { TextInput } from "../inputs";
import { useState } from "react";
import { IconButton } from "../buttons";

interface AccountFormProps {
	account: AccountType,
	onSubmit: ( account: AccountType ) => void;
}
export const AccountForm = ( {
	account,
	onSubmit
}: AccountFormProps ) => {
	const [ editedAccount, setEditedAccount ] = useState( account );

	return (
		<View style={ styles.container } keyboardShouldPersistTaps='handled'>
			<TextInput
				label="Name"
				value={ editedAccount?.name }
				onChangeText={ name => setEditedAccount( {
					...editedAccount,
					name
				} ) } />
			<TextInput
				label="Notes"
				value={ editedAccount?.notes }
				onChangeText={ notes => setEditedAccount( {
					...editedAccount,
					notes
				} ) }
				multiline={ true } />
			<IconButton
				icon={ 'save' }
				onPress={ onSubmit.bind( this, editedAccount ) } />
		</View>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.form
	}
} );