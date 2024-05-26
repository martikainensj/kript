import React, { useCallback } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Realm from "realm";

import { Grid, Icon, Row, Value } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme, TransactionTypes } from "../../constants";
import { useTransaction } from "../../hooks";
import { __ } from "../../localization";
import { MenuItem, useBottomSheet, useMenu } from "../contexts";
import { router } from "expo-router";
import { TransactionForm } from "./TransactionForm";
import { Transaction } from "../../models/Transaction";

interface TransactionItemProps {
	_id: Realm.BSON.UUID,
	holding_id?: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const TransactionItem: React.FC<TransactionItemProps> = ( { _id, holding_id, account_id } ) => {
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { transaction, saveTransaction, removeTransaction, type } = useTransaction( { _id, holding_id, account_id } );

	const onPress = useCallback( () => {
		/*router.navigate( {
			pathname: 'transactions/[transaction]',
			params: { id, ...transaction }
		} );*/
	}, [ transaction ] );

	const onLongPress = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					openBottomSheet(
						__( 'Edit Transaction' ),
						<TransactionForm
							transaction={ transaction }
							onSubmit={ transaction => {
								saveTransaction( transaction ).then( closeBottomSheet ) }
							} />
					);
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'trash' } color={ color } />,
				onPress: removeTransaction
			}
		];

		openMenu( anchor, menuItems );
	}, [ transaction ] );

	if ( ! transaction?.isValid() ) return;
	
	const meta = [
		<Text style={ styles.date }>{ new Date( transaction?.date ).toLocaleDateString( 'fi' ) }</Text>,
		<Text style={ [ styles.type, { color: type.color } ] }>{ type.name }</Text>
	];

	const values = [
		<Value label={ __( 'Amount' ) } value={ transaction?.amount } isVertical={ true } />,
		<Value label={ __( 'Price' ) } value={ transaction?.price } isVertical={ true } unit={ '€' } />,
		<Value label={ __( 'Total' ) } value={ transaction?.total } isVertical={ true } unit={ '€' } />
	];

	return (
		<TouchableRipple
			onPress={ onPress }
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

export default TransactionItem;

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