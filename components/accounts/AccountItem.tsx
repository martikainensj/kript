import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Row } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { Account } from "../../models/Account";

interface AccountItemProps {
	account: Account,
	onPress?: ( account: Account ) => void
}

export const AccountItem: React.FC<AccountItemProps> = ( {
	account,
	onPress
} ) => {
	function onPressHandler() {
		onPress( account );
	}

	const name = account.name;

	return (
		<TouchableRipple
			onPress={ onPressHandler }
			theme={ Theme }>
			<View style={ styles.container}>
				<Row>
					<Text style={ styles.name }>{ name }</Text>
				</Row>
			</View>
		</TouchableRipple>
	)
}

export default AccountItem;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	name: {
		fontWeight: FontWeight.bold
	},
	value: {
		fontWeight: FontWeight.bold
	},
	valueValueStyle: {
		
	}
} );