import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";

import { IconButton } from "../buttons";
import { DateInput, HoldingInput, Select, TextInput } from "../inputs";
import { GlobalStyles, IconSize, Spacing, TransactionTypes } from "../../constants";
import { __ } from "../../localization";
import { Transaction } from "../../models/Transaction";
import { Account } from "../../models/Account";
import { Divider, Icon, Spacer } from "../ui";
import { allSet, stripRealmListsFromObject } from "../../helpers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TransactionFormProps {
	transaction: Transaction,
	account: Account,
	onSubmit: ( transaction: Transaction ) => void;
}

export const TransactionForm = ( {
	transaction,
	account,
	onSubmit
}: TransactionFormProps ) => {
	const [ buy, sell ] = TransactionTypes;
	const [ transactionType, setTransactionType ] = useState( buy.id );
	const [ editedTransaction, setEditedTransaction ]
		= useState( { ...transaction } );

	const { date, price, amount, total, holding_name, notes } = useMemo( () => {
		return editedTransaction
	}, [ editedTransaction ] );

	const handleDismissKeyboard = ( ) => {
    Keyboard.dismiss();
  };

	const onSubmitHandler = () => {
		handleDismissKeyboard();
		onSubmit( stripRealmListsFromObject( editedTransaction ) )
	}
		
	useEffect( () => {
		setEditedTransaction( { ...transaction } );
	}, [ transaction ] );

	return (
    <TouchableWithoutFeedback onPress={ handleDismissKeyboard }>
			<View style={ styles.container }>
				<DateInput
					label={ __( 'Date' ) }
					value={ date }
					setValue={ date => setEditedTransaction(
						Object.assign( { ...editedTransaction }, { date } )
					) } />

				<Select
					value={ transactionType }
					setValue={ setTransactionType }
					options={ TransactionTypes.map( transactionType => {
						return {
							icon: ( { size, color } ) => {
								return (
									<Icon
										name={transactionType.icon}
										size={ size }
										color={ color } />
								)
							},
							label: transactionType.name,
							value: transactionType.id,
							checkedColor: transactionType.color
						}
					} ) } />

				<HoldingInput
					label={ __( 'Holding' ) }
					value={ holding_name }
					account={ account }
					placeholder={ `${ __( 'Example' ) }: Apple Inc` }
					setValue={ holding_name => setEditedTransaction(
						Object.assign( { ...editedTransaction }, { holding_name } )
					) }
					disabled={ !! transaction.holding_name } />

				<Divider />
				
				<TextInput
					label={ __( 'Price' ) }
					value={ price }
					placeholder={ '0' }
					keyboardType={ 'numeric' }
					inputMode={ 'decimal' }
					onChangeText={ price => setEditedTransaction(
						Object.assign( { ...editedTransaction }, { price } )
					) } />

				<TextInput
					label={ __( 'Amount' ) }
					value={ amount }
					placeholder={ '0' }
					keyboardType={ 'numeric' }
					inputMode={ 'decimal' }
					onChangeText={ amount => setEditedTransaction(
						Object.assign( { ...editedTransaction }, { amount } )
					) } />

				<TextInput
					label={ __( 'Total' ) }
					value={ total }
					placeholder={ '0' }
					keyboardType={ 'numeric' }
					inputMode={ 'decimal' }
					onChangeText={ total => setEditedTransaction(
						Object.assign( { ...editedTransaction }, { total } )
					) } />

				<TextInput
					label={ __( 'Notes' ) }
					value={ notes }
					placeholder={ `${ __( 'Enter notes here' ) }...` }
					onChangeText={ notes => setEditedTransaction(
						Object.assign( { ...editedTransaction }, { notes } )
					) }
					multiline={ true } />

				<Divider />

				<IconButton
					icon={ 'save' }
					size={ IconSize.xl }
					style={ styles.submitButton }
					disabled={ ! allSet( holding_name, price, amount, total ) }
					onPress={ onSubmitHandler } />
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.form,
		
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
} );