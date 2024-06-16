import React, { useCallback } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Realm from "realm";

import { Grid, Icon, Value } from "../ui";
import { FontWeight, GlobalStyles, Spacing } from "../../constants";
import { useTransaction } from "../../hooks";
import { TransactionForm } from "../transactions/TransactionForm";
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from "../contexts/ThemeContext";
import { MenuItem, useMenu } from "../contexts/MenuContext";
import { useBottomSheet } from "../contexts/BottomSheetContext";

interface TransferItemProps {
	_id: Realm.BSON.UUID,
	account_id: Realm.BSON.UUID,
	showHolding?: boolean
}

export const TransferItem: React.FC<TransferItemProps> = ( { _id, account_id, showHolding } ) => {
	const { theme } = useTheme();
	const { __ } = useI18n();
	const { openMenu } = useMenu();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { transaction, saveTransaction, removeTransaction, type } = useTransaction( { _id, account_id } );

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

	const { amount, date, holding_name } = {
		...transaction,
		amount: Math.abs( transaction?.amount ),
	};
	
	const meta = [
		<View style={ styles.header }>
			<Text style={ [ styles.date, { color: theme.colors.primary } ] }>{ new Date( date ).toLocaleDateString( 'fi' ) }</Text>
			{ ( showHolding && holding_name )
				&& <Text numberOfLines={ 1 } style={ styles.holding }>{ holding_name }</Text>
			}
		</View>,
		<Text style={ [ styles.type, { color: type.color } ] }>{ type.name }</Text>
	];

	const values = [
		<Value label={ __( 'Amount' ) } value={ amount } unit={ '€' } isVertical={ true } />
	];

	return (
		<TouchableRipple onLongPress={ onLongPress }>
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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		gap: Spacing.sm
	},
	date: {
		fontWeight: FontWeight.bold,
	},
	type: {
		fontWeight: FontWeight.bold,
		textAlign: 'right'
	},
	holding: {
		fontWeight: FontWeight.bold
	}
} );