import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Duration, GlobalStyles, Spacing } from "../../constants";
import { TransactionForm } from "./TransactionForm";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { Value } from "../ui/Value";
import { Grid } from "../ui/Grid";
import { Transaction } from "../../models/Transaction";
import { useTypes } from "../../hooks/useTypes";
import { Checkbox } from "../inputs/Checkbox";
import ConditionalView from "../ui/ConditionalView";
import { ProgressBar } from "../ui/ProgressBar";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useData } from "../../features/data/DataContext";

interface TransactionItemProps {
	transaction: Transaction;
	showHolding?: boolean;
	isSelectable?: boolean;
	isSelected?: boolean;
	onPressSelect?: ( transaction: Transaction ) => void;
	onLongPress?: ( transaction: Transaction ) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ( { transaction, showHolding, isSelectable, isSelected, onPressSelect, onLongPress } ) => {
	const {theme} = useTheme();
	const { __ } = useI18n();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { getAccountBy, saveTransaction } = useData();
	const { TradingTypes, CashTypes, AdjustmentTypes, LoanTypes } = useTypes();
	const [ longPressProgress, setLongPressProgress ] = useState( 0 );

  const progressAnim = useRef( new Animated.Value( 0 )).current;
	const opacity = progressAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ 0, 1 ],
	});

	if ( ! transaction?.isValid() ) return;

	const onLongPressHandler = () => {
		onLongPress && onLongPress( transaction );
	};

	const onPressHandler = () => {
		if ( longPressProgress > 0.1 ) {
			return;
		}

		if ( isSelectable && onPressSelect ) {
			return onPressSelect( transaction );
		}

		openBottomSheet(
			__( 'Edit Transaction' ),
			<TransactionForm
				transaction={ transaction }
				account={ getAccountBy( '_id', transaction.account_id ) }
				onSubmit={ transaction => saveTransaction( transaction ).then( closeBottomSheet ) } />
		)
	};

	const onPressIn = () => {
		if ( isSelectable ) {
			return;
		}

		Animated.timing( progressAnim, {
			toValue: 1,
			duration: Duration.slow,
			useNativeDriver: true,
			easing: Easing.out( Easing.cubic ),
			delay: Duration.normal
		}).start();
	};

	const onPressOut = () => {
		Animated.timing( progressAnim, {
			toValue: 0,
			duration: Duration.normal,
			useNativeDriver: true,
			easing: Easing.out( Easing.cubic )
		}).start();
	};

	const { amount, date, price, total, holding_name } = {
		...transaction,
		amount: Math.abs( transaction.amount ),
		total: Math.abs( transaction.total ),
	};

	const type = useMemo( () => {
		switch ( transaction?.type ) {
			case 'trading':
				return TradingTypes.find(type => type.id === transaction.sub_type )
			case 'cash':
				return CashTypes.find(type => type.id === transaction.sub_type )
			case 'adjustment':
				return AdjustmentTypes.find(type => type.id === transaction.sub_type )
			case 'loan':
				return LoanTypes.find(type => type.id === transaction.sub_type )
		}
	}, [ transaction ] )

	const meta = [
		<View style={ styles.header }>
			<ConditionalView
				condition={ isSelectable }
				initialValues={{
					width: Number.MIN_VALUE,
					scaleX: 0.5,
					scaleY: 0.5
				}}
				targetValues={{
					width: 16 + Spacing.sm
				}}>
				<Checkbox value={ isSelected } />
			</ConditionalView>
			<Text style={ [ styles.date, { color: theme.colors.primary } ] }>{ new Date( date ).toLocaleDateString( 'fi' ) }</Text>
			{ ( showHolding && holding_name )
				&& <Text numberOfLines={ 1 } style={ styles.holding }>{ holding_name }</Text>
			}
		</View>,
		<Text style={ [ styles.type, { color: type?.color } ] }>{ type?.name }</Text>
	];

	const values = [];

	if ( price ) {
		values.push( <Value label={ __( 'Price' ) } value={ price } isVertical={ true } unit={ '€' } /> );
	}
	
	const isAmountCurrencyType = transaction?.type === 'cash' || transaction?.type === 'loan';

	if ( isAmountCurrencyType || amount > 1 ) {
		values.push(
			<Value
				label={ __( 'Amount' ) }
				value={ amount } isVertical={ true }
				unit={ isAmountCurrencyType && '€' } />
		);
	}

	if ( total ) {
		values.push( <Value label={ __( 'Total' ) } value={ total } isVertical={ true } unit={ '€' } /> );
	}


	progressAnim.addListener(( state ) => {
		setLongPressProgress( state.value );
	});

	useEffect(() => {
		if ( longPressProgress === 1 ) {
			onLongPressHandler();
		}
	}, [ longPressProgress ]);

	return (
		<TouchableRipple
			onPress={ onPressHandler }
			onPressIn={ onPressIn }
			onPressOut={ onPressOut }
		>
			<View style={ styles.container }>
				<Grid
					columns={ 2 }
					items={ meta } />
				<Grid
					columns={ 4 }
					items= { values } />
				<View style={ styles.progressBarWrapper }>
					<ProgressBar
						progress={ longPressProgress }
						style={ { opacity } } />
				</View>
			</View>
		</TouchableRipple>
	)
}

export default TransactionItem;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.gutter,
		position: 'relative',
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	date: {
		...GlobalStyles.bold,
		marginRight: Spacing.sm
	},
	type: {
		...GlobalStyles.bold,
		textAlign: 'right'
	},
	holding: {
		...GlobalStyles.bold,
	},
	progressBarWrapper: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	}
} );