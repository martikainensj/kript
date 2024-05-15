import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { IconButton } from "../buttons";
import { DateInput, HoldingInput, Select, TextInput } from "../inputs";
import { GlobalStyles, IconSize, TransactionTypes } from "../../constants";
import { __ } from "../../localization";
import { Transaction } from "../../models/Transaction";
import { Holding } from "../../models/Holding";
import { Account } from "../../models/Account";
import { Icon } from "../ui";

interface TransactionFormProps {
	transaction: Transaction,
	account: Account,
	onSubmit: ( transaction: Transaction, holding: Holding ) => void;
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

	useEffect( () => {
		setEditedTransaction( { ...transaction } );
	}, [ transaction ] );


	return (
		<View style={ styles.container }>
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
						value: transactionType.id
					}
				} ) } />
			<DateInput
				label={ __( 'Date' ) }
				value={ editedTransaction.date }
				setValue={ date => setEditedTransaction(
					Object.assign( { ...editedTransaction }, { date } )
				) } />
			<HoldingInput
				label={ __( 'Holding' ) }
				value={ editedTransaction.holding_name }
				account={account }
				placeholder={ `${ __( 'Example' ) }: Apple Inc` }
				setValue={ holding_name => setEditedTransaction(
					Object.assign( { ...editedTransaction }, { holding_name } )
				) } />
			<TextInput
				label={ __( 'Price' ) }
				value={ editedTransaction?.price?.toString() }
				placeholder={ '0' }
				inputMode={ 'decimal' }
				onChangeText={ price => setEditedTransaction(
					Object.assign( { ...editedTransaction }, {
						price: price && parseFloat( price )
					} )
				) } />

			<TextInput
				label={ __( 'Amount' ) }
				value={ editedTransaction?.amount?.toString() }
				placeholder={ '0' }
				inputMode={ 'decimal' }
				onChangeText={ amount => setEditedTransaction(
					Object.assign( { ...editedTransaction }, {
						amount: amount && parseFloat( amount ) 
					} )
				) } />

			<TextInput
				label={ __( 'Total' ) }
				value={ editedTransaction?.total?.toString() }
				placeholder={ '0' }
				inputMode={ 'decimal' }
				onChangeText={ total => setEditedTransaction(
					Object.assign( { ...editedTransaction }, {
						total: total && parseFloat( total )
					} )
				) } />

			<TextInput
				label={ __( 'Notes' ) }
				value={ editedTransaction?.notes }
				placeholder={ `${ __( 'Enter notes here' ) }...` }
				onChangeText={ notes => setEditedTransaction(
					Object.assign( { ...editedTransaction }, { notes } )
				) }
				multiline={ true } />

			<IconButton
				icon={ 'save' }
				size={ IconSize.xl }
				style={ styles.submitButton }
				disabled={ ! editedTransaction }
				onPress={ onSubmit.bind( this, editedTransaction ) } />
		</View>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.form
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
} );