import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import Realm from "realm";

import { FontWeight, GlobalStyles, Spacing } from "../../constants";
import { TransactionForm } from "./TransactionForm";
import { useI18n } from '../../contexts/I18nContext';
import { MenuItem, useMenu } from "../../contexts/MenuContext";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { Icon } from "../ui/Icon";
import { Value } from "../ui/Value";
import { Grid } from "../ui/Grid";
import { Transaction } from "../../models/Transaction";
import { useTypes } from "../../hooks/useTypes";
import { Checkbox } from "../inputs/Checkbox";

interface TransactionItemProps {
	transaction: Transaction;
	showHolding?: boolean;
	isSelectable?: boolean;
	isSelected?: boolean;
	onPressSelect?: ( transaction: Transaction ) => void;
	onLongPress?: ( transaction: Transaction ) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ( { transaction, showHolding, isSelectable, isSelected, onPressSelect, onLongPress } ) => {
	const theme = useTheme();
	const { __ } = useI18n();
	const { TradingTypes, CashTypes, AdjustmentTypes } = useTypes();

	if ( ! transaction?.isValid() ) return;

	const onLongPressHandler = useCallback( () => {
		onLongPress && onLongPress( transaction );
	}, [ transaction ]);

	const onPressHandler = useCallback( () => {
		if ( isSelectable && onPressSelect ) {
			onPressSelect( transaction );
		}
	}, [ transaction ] );

	const { amount, date, price, total, holding_name } = {
		...transaction,
		amount: Math.abs( transaction.amount ),
		total: Math.abs( transaction.total ),
	};

	const type = useMemo( () => {
		switch ( transaction?.type) {
			case 'trading':
				return TradingTypes.find(type => type.id === transaction.sub_type )
			case 'cash':
				return CashTypes.find(type => type.id === transaction.sub_type )
			case 'adjustment':
				return AdjustmentTypes.find(type => type.id === transaction.sub_type )
		}
	}, [ transaction ] )
	
	const meta = [
		<View style={ styles.header }>
			{ isSelectable && <Checkbox value={ isSelected } /> }
			<Text style={ [ styles.date, { color: theme.colors.primary } ] }>{ new Date( date ).toLocaleDateString( 'fi' ) }</Text>
			{ ( showHolding && holding_name )
				&& <Text numberOfLines={ 1 } style={ styles.holding }>{ holding_name }</Text>
			}
		</View>,
		<Text style={ [ styles.type, { color: type?.color } ] }>{ type?.name }</Text>
	];

	const values = [];

	if ( amount ) {
		values.push( <Value label={ __( 'Amount' ) } value={ amount } isVertical={ true } /> );
	}

	if ( price ) {
		values.push( <Value label={ __( 'Price' ) } value={ price } isVertical={ true } unit={ '€' } /> );
	}

	if ( total ) {
		values.push( <Value label={ __( 'Total' ) } value={ total } isVertical={ true } unit={ '€' } /> );
	}

	return (
		<TouchableRipple onPress={ onPressHandler } onLongPress={ onLongPressHandler }>
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