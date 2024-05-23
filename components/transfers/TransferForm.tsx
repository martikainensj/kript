import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";

import { IconButton } from "../buttons";
import { DateInput, HoldingInput, Select, TextInput } from "../inputs";
import { GlobalStyles, IconSize, Spacing, TransferTypes } from "../../constants";
import { __ } from "../../localization";
import { Transfer } from "../../models/Transfer";
import { Account } from "../../models/Account";
import { Divider, Icon } from "../ui";
import { allSet, stripRealmListsFromObject } from "../../helpers";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TransferFormProps {
	transfer: Transfer,
	account: Account,
	onSubmit: ( transfer: Transfer ) => void;
}

export const TransferForm = ( {
	transfer,
	account,
	onSubmit
}: TransferFormProps ) => {
	const [ deposit, withdraw, dividend ] = TransferTypes;
	const [ transferType, setTransferType ]
		= useState( !! transfer.holding_name ? dividend.id : deposit.id );
	const [ editedTransfer, setEditedTransfer ]
		= useState( { ...transfer } );

	const { date, amount, holding_name, notes } = useMemo( () => {
		return editedTransfer
	}, [ editedTransfer ] );

	const handleDismissKeyboard = ( ) => {
    Keyboard.dismiss();
  };

	const onSubmitHandler = () => {
		handleDismissKeyboard();

		onSubmit( stripRealmListsFromObject( {
			...editedTransfer,
			amount: transferType === withdraw.id
				? -amount
				: Math.abs( amount )
	 	} ) );
	}
		
	useEffect( () => {
		setEditedTransfer( { ...transfer } );
	}, [ transfer ] );

	useEffect( () => {
		if ( !! transfer.holding_name ) return;

		setEditedTransfer(
			Object.assign( { ...editedTransfer }, { holding_name: '' } )
		);
	}, [ transferType ] )

	return (
    <TouchableWithoutFeedback onPress={ handleDismissKeyboard }>
			<View style={ styles.container }>
				<DateInput
					label={ __( 'Date' ) }
					value={ date }
					setValue={ date => setEditedTransfer(
						Object.assign( { ...editedTransfer }, { date } )
					) } />

				{ ! transfer.holding_name &&
					<Select
						value={ transferType }
						setValue={ setTransferType }
						options={ TransferTypes.map( transferType => {
							return {
								icon: ( { size, color } ) => {
									return (
										<Icon
											name={ transferType.icon }
											size={ size }
											color={ color } />
									)
								},
								label: transferType.name,
								value: transferType.id,
								checkedColor: transferType.color
							}
						} ) } />
				}

				{ transferType === dividend.id &&
					<HoldingInput
						label={ __( 'Holding' ) }
						value={ holding_name }
						account={ account }
						placeholder={ `${ __( 'Example' ) }: Apple Inc` }
						setValue={ holding_name => setEditedTransfer(
							Object.assign( { ...editedTransfer }, { holding_name } )
						) }
						disabled={ !! transfer.holding_name } />
				}

				<Divider />

				<TextInput
					label={ __( 'Amount' ) }
					value={ amount }
					placeholder={ '0' }
					keyboardType={ 'numeric' }
					inputMode={ 'decimal' }
					onChangeText={ amount => setEditedTransfer(
						Object.assign( { ...editedTransfer }, { amount } )
					) } />

				<TextInput
					label={ __( 'Notes' ) }
					value={ notes }
					placeholder={ `${ __( 'Enter notes here' ) }...` }
					onChangeText={ notes => setEditedTransfer(
						Object.assign( { ...editedTransfer }, { notes } )
					) }
					multiline={ true } />

				<Divider />

				<IconButton
					icon={ 'save' }
					size={ IconSize.xl }
					style={ styles.submitButton }
					disabled={ ! allSet( amount, ( transferType !== dividend.id || !! holding_name ) ) }
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