import React, { useCallback } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Realm from "realm";

import { Grid, Icon, Value } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { useTransfer } from "../../hooks";
import { __ } from "../../localization";
import { MenuItem, useBottomSheet, useMenu } from "../contexts";
import { TransferForm } from "./TransferForm";

interface TransferItemProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const TransferItem: React.FC<TransferItemProps> = ( { _id, account_id } ) => {
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { transfer, saveTransfer, removeTransfer, type, account } = useTransfer( { _id, account_id } );

	const onLongPress = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					openBottomSheet(
						__( 'Edit Transfer' ),
						<TransferForm
							account={ account }
							transfer={ transfer }
							onSubmit={ transfer => {
								saveTransfer( transfer ).then( closeBottomSheet ) }
							} />
					);
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'trash' } color={ color } />,
				onPress: removeTransfer
			}
		];

		openMenu( anchor, menuItems );
	}, [ transfer ] );

	if ( ! transfer?.isValid() ) return;
	
	const meta = [
		<Text style={ styles.date }>{ new Date( transfer?.date ).toLocaleDateString( 'fi' ) }</Text>,
		<Text style={ [ styles.type, { color: type.color } ] }>{ type.name }</Text>
	];

	const values = [
		<Value label={ __( 'Amount' ) } value={ transfer?.amount } isVertical={ true } />
	];

	return (
		<TouchableRipple
			onLongPress={ onLongPress }
			theme={ Theme }>
			<View style={ styles.container}>
				<Grid
					columns={ 2 }
					items={ meta } />
				<Grid
					columns={ 4 }
					items= { values } />
			</View>
		</TouchableRipple>
	)
}

export default TransferItem;

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
		
	},
	date: {
		fontWeight: FontWeight.bold
	},
	type: {
		fontWeight: FontWeight.bold,
		textAlign: 'right'
	},
} );