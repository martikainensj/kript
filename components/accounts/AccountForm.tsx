import { View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants";
import { AccountType } from "../../models/Account";
import { TextInput } from "../inputs";
import { useEffect, useState } from "react";
import { IconButton } from "../buttons";
import { Text } from "react-native-paper";
import { __ } from "../../helpers";
import { Title } from "../ui/Title";

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
			<Title>
				{ 
					editedAccount._id
						? __( 'Edit Account' )
						: __( 'New Account' )
				}
			</Title>
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