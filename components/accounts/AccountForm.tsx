import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs";
import { Title } from "../ui";
import { GlobalStyles } from "../../constants";
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
			<Title>
				{ 
					editedAccount._id
						? __( 'Edit Account' )
						: __( 'New Account' )
				}
			</Title>
			<TextInput
				label={ __( 'Name' ) }
				value={ editedAccount?.name }
				onChangeText={ name => setEditedAccount( {
					...editedAccount,
					name
				} ) } />
			<TextInput
				label={ __( 'Notes' ) }
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