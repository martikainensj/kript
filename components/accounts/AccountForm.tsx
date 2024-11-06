import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs/TextInput";
import { GlobalStyles, IconSize } from "../../constants";
import { Account } from "../../models/Account";
import { stripRealmListsFromObject } from "../../helpers";
import { useI18n } from "../../features/i18n/I18nContext";
import { Text } from "../ui/Text";

interface AccountFormProps {
	label?: string;
	account?: Account,
	onSubmit: (account: Account) => void;
}

export const AccountForm = ({
	label,
	account,
	onSubmit
}: AccountFormProps) => {
	const { __ } = useI18n();
	const [editedAccount, setEditedAccount] = useState<Account>({ ...account });

	const handleDismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const onSubmitHandler = () => {
		handleDismissKeyboard();
		onSubmit(stripRealmListsFromObject(editedAccount))
	}

	useEffect(() => {
		setEditedAccount({ ...account });
	}, [account]);

	return (
		<TouchableWithoutFeedback onPress={handleDismissKeyboard}>
			<View style={styles.container}>
				{label && (
					<Text
						fontSize="md"
					>
						{label}
					</Text>
				)}
				<TextInput
					label={__('Name')}
					value={editedAccount?.name}
					placeholder={`${__('Example')}: ${__('Investment Account')}`}
					onChangeText={name => setEditedAccount(
						Object.assign({ ...editedAccount }, { name })
					)}
				/>

				{/*<TextInput
					label={__('Notes')}
					value={editedAccount?.notes}
					placeholder={`${__('Enter notes here')}...`}
					multiline={true}
					onChangeText={notes => setEditedAccount(
						Object.assign({ ...editedAccount }, { notes })
					)}
				/>*/}

				<IconButton
					icon={'save'}
					size={IconSize.lg}
					style={styles.submitButton}
					disabled={!editedAccount?.name}
					onPressIn={handleDismissKeyboard}
					onPressOut={onSubmitHandler}
				/>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.form
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
});