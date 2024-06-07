import React from "react";
import { StyleSheet, View } from "react-native"

import { UserDataValue, useUser } from "../../hooks/useUser";
import { DefaultButton } from "../buttons";
import { useI18n } from "../contexts/I18nContext";
import { Spacing } from "../../constants";
import { EditableValue } from "../ui/EditableValue";

interface UserProps {}

export const UserInfo: React.FC<UserProps> = () => {
	const { __ } = useI18n();
	const { data, logOut, setData, removeUser } = useUser();

	return <View style={ styles.container }>
		<View style={ styles.dataContainer}>
			<EditableValue 
				label={ __( 'Name' ) }
				value={ data.name }
				setValue={ ( value ) => setData( 'name', value as UserDataValue<'name'> )} />
		</View>

		<View style={ styles.buttonsContainer}>
			<DefaultButton onPress={ logOut }>
				{ __( 'Logout' ) }
			</DefaultButton>

			<DefaultButton onPress={ removeUser } mode={ 'text' }>
				{ __( 'Remove' ) }
			</DefaultButton>
		</View>
	</View>
}

const styles = StyleSheet.create( {
	container: {
		paddingVertical: Spacing.md,
		gap: Spacing.xl
	},
	dataContainer: {
		gap: Spacing.sm
	},
	buttonsContainer: {
		gap: Spacing.sm
	}
} );