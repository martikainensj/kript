import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Realm from "realm";

import { Grid, Icon, Value } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { useTransaction } from "../../hooks";
import { __ } from "../../localization";
import { MenuItem, useBottomSheet, useMenu } from "../contexts";
import { TransactionForm } from "./TransactionForm";
import { Transaction } from "../../models/Transaction";

interface TransactionItemProps {
	_id: Realm.BSON.UUID,
	holding_id?: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID
}

export const TransactionItem: React.FC<TransactionItemProps> = ( { _id, holding_id, account_id } ) => {
	const { openMenu } = useMenu();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { transaction, saveTransaction, removeTransaction, type } = useTransaction( { _id, holding_id, account_id } );
	const { amount, date, price, total } = useMemo( () => {
		return {
			...transaction,
			amount: Math.abs( transaction.amount ),
			total: Math.abs( transaction.total ),
		}
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
		<Text style={ styles.date }>{ new Date( date ).toLocaleDateString( 'fi' ) }</Text>,
		<Text style={ [ styles.type, { color: type.color } ] }>{ type.name }</Text>
	];

	const values = [
		<Value label={ __( 'Amount' ) } value={ amount } isVertical={ true } />,
		<Value label={ __( 'Price' ) } value={ price } isVertical={ true } unit={ '€' } />,
		<Value label={ __( 'Total' ) } value={ total } isVertical={ true } unit={ '€' } />
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

export default TransactionItem;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	date: {
		fontWeight: FontWeight.bold,
		color: Theme.colors.primary
	},
	type: {
		fontWeight: FontWeight.bold,
		textAlign: 'right'
	},
} );