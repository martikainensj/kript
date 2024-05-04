import React, { useCallback, useRef } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { MenuItemProps, Text, TouchableRipple } from "react-native-paper";
import { router } from 'expo-router';

import { Icon, Row } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { Account, AccountType } from "../../models/Account";
import { MenuItem, useMenu } from "../contexts/MenuContext";
import { useAccount } from "../../hooks";
import { __ } from "../../helpers";
import { useBottomSheet } from "../contexts";
import { AccountForm } from "./AccountForm";

interface AccountItemProps {
	id: AccountType['_id']
}

export const AccountItem: React.FC<AccountItemProps> = ( { id } ) => {
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { account, saveAccount, removeAccount } = useAccount( { id } )

	function onPress() {
		router.navigate( {
			pathname: 'accounts/[account]',
			params: {
				id: account._id.toString(),
				name: account.name
			}
		} );
	}

	const onLongPress = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create-outline' } color={ color } />,
				onPress: () => {
					setTitle( __( 'Edit Account' ) );
					setContent(
						<AccountForm
							account={ account }
							onSubmit={ ( editedAccount ) => {
								saveAccount( editedAccount ).then( closeBottomSheet );
							}	} />
					)

					openBottomSheet();
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'trash-outline' } color={ color } />,
				onPress: removeAccount
			}
		];

		openMenu( anchor, menuItems );
	}, [ account ] );

	if ( ! account ) return;

	return (
		<TouchableRipple
			onPress={ onPress }
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