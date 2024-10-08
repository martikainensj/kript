import React from "react";
import { StyleSheet, View } from "react-native"

import { DefaultButton } from "../buttons";
import { Spacing } from "../../constants";
import { EditableValue } from "../ui/EditableValue";
import { useI18n } from "../../features/i18n/I18nContext";
import { useUser } from "../../features/realm/useUser";
import { UserValue } from "../../features/realm/types";

interface UserProps {}

export const UserInfo: React.FC<UserProps> = () => {
	const { __ } = useI18n();
	const { data, logOut, set, removeUser } = useUser();

	return <View style={ styles.container }>
		<View style={ styles.dataContainer}>
			<EditableValue 
				label={ __( 'Name' ) }
				value={	data.name }
				setValue={ ( value ) => set( 'name', value as UserValue<'name'> )} />
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