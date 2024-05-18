import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { router } from 'expo-router';

import { Icon } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { Account } from "../../models/Account";
import { MenuItem, useMenu } from "../contexts/MenuContext";
import { useAccount } from "../../hooks";
import { __ } from "../../localization";
import { useBottomSheet } from "../contexts";
import { AccountForm } from "./AccountForm";
import { Grid, Value } from "../ui";
import { useRealm } from "@realm/react";

interface AccountItemProps {
	id: Account['_id']
}

export const AccountItem: React.FC<AccountItemProps> = ( { id } ) => {
	const realm = useRealm();
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { account, saveAccount, removeAccount, getBalance, getValue } = useAccount( { id } )
	const values = useMemo( () =>  [
		<Value label={ __( 'Balance' ) } value={ getBalance() } isVertical={ true } />,
		<Value label={ __( 'Value' ) } value={ getValue() } isVertical={ true } />,
	], [ realm, account ] );

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
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					openBottomSheet();
					setTitle( __( 'Edit Account' ) );
					setContent(
						<AccountForm
							account={ account }
							onSubmit={ ( editedAccount ) => {
								saveAccount( editedAccount ).then( closeBottomSheet );
							}	} />
					)
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'trash' } color={ color } />,
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
				<Grid
					columns={ 2 }
					items={ [ <Text style={ styles.name }>{ account.name }</Text> ] } />
				<Grid
					columns={ 4 }
					items= { values } />
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