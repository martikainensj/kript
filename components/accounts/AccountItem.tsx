import React, { useCallback, useRef } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { MenuItemProps, Text, TouchableRipple } from "react-native-paper";

import { Icon, Row } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { Account, AccountType } from "../../models/Account";
import { MenuItem, useMenu } from "../contexts/MenuContext";
import { useAccount } from "../../hooks";
import { __ } from "../../helpers";
import { useBottomSheet } from "../contexts";
import { AccountForm } from "./AccountForm";

interface AccountItemProps {
	id: AccountType['_id'],
	onPress?: ( account: Account ) => void
}

export const AccountItem: React.FC<AccountItemProps> = ( {
	id,
	onPress
} ) => {
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet } = useBottomSheet();
	const { account, saveAccount } = useAccount( { id } )

	function onPressHandler() {
	}

	const onLongPress = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems = [
			{
				leadingIcon: () => <Icon name={ 'pencil'} />,
				title: __( 'Edit' ),
				onPress: () => {
					setTitle( __( 'Edit Account' ) );
					setContent( <AccountForm account={ account } onSubmit={ saveAccount } /> )
					openBottomSheet();
				}
			}
		];

		openMenu( anchor, menuItems );
	}, [ account ] );

	return (
		<TouchableRipple
			//onPress={ onPressHandler }
			onLongPress={ onLongPress }
			theme={ Theme }>
			<View style={ styles.container}>
				<Row>
					<Text style={ styles.name }>{ account.name }</Text>
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