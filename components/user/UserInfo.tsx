import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { UserDataKey, UserDataValue, useUser } from "../../hooks/useUser";
import { DefaultButton } from "../buttons";
import { useI18n } from "../contexts/I18nContext";
import React, { useState } from "react";
import { Value } from "../ui";
import { Spacing } from "../../constants";
import { EditableValue } from "../ui/EditableValue";

interface UserProps {}

export const UserInfo: React.FC<UserProps> = () => {
	const { __ } = useI18n();
	const { data, logOut, setData } = useUser();

	return <View style={ styles.container }>
		<View style={ styles.dataContainer}>
			<EditableValue 
				label={ __( 'Name' ) }
				value={ data.name }
				setValue={ ( value ) => setData( 'name', value as UserDataValue<'name'> )} />
		</View>

		<DefaultButton onPress={ logOut }>
			{ __( 'Logout' ) }
		</DefaultButton>
	</View>
}

const styles = StyleSheet.create( {
	container: {
		paddingVertical: Spacing.md,
		gap: Spacing.lg
	},
	dataContainer: {
		gap: Spacing.sm
	},
} );