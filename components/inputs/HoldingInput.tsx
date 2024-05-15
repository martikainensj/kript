import React, {
	useState,
} from "react";
import {
	StyleSheet,
	View,
} from "react-native";
import { ChipProps, Chips } from "./Chips";
import { Spacing } from "../../constants";
import { Holding } from "../../models/Holding";
import Realm from "realm";
import { TextInput } from "./TextInput";
import { useUser } from "@realm/react";
import { Account } from "../../models/Account";

interface HoldingInputProps {
	value: string
	setValue: React.Dispatch<React.SetStateAction<string>>
	label: string
	placeholder: string,
	account: Account
}

export const HoldingInput: React.FC<HoldingInputProps> = ({
	value,
	setValue,
	label,
	placeholder,
	account
}) => {
	const user: Realm.User = useUser();

	const [ inputValue, setInputValue ] = useState( value );
	const [ chipsValue, setChipsValue ] = useState( value );
	const [ canShowChips, setCanShowChips ] = useState( false );
	const [ filteredHoldings, setFilteredHoldings ] = useState( [ ...account.holdings ] );

	const chipsVisible = !! filteredHoldings.length && ( ! value || canShowChips );

	const onFocusHandler = () => {
		setCanShowChips( true );
	}

	const onClear = () => {
		setInputValue( '' );
		setValue( null );
		setChipsValue( null );
		setFilteredHoldings( [ ...account.holdings ] );
	}
	
	const onChangeText = ( value: string ) => {
		setInputValue( value );

		const filteredHoldings = !! value
			? [ ...account.holdings ].filter( holding => {
					const label = holding.name?.toLowerCase();
					return label.includes( value.toString().toLowerCase() );
				} )
			: [ ...account.holdings ];

		if ( !! value && ! filteredHoldings.length  ) {
			filteredHoldings.push( {
				name: value,
				owner_id: user.id,
				account_id: account._id
			} );
		}

		setFilteredHoldings( filteredHoldings );

		if ( ! value ) {
			return setChipsValue( null );
		}

		setChipsValue( 
			!! filteredHoldings.length && filteredHoldings[0].name
		);
	}

	const onSubmitHandler = () => {
		if ( ! chipsValue ) {
			return onClear();
		}

		setValue( chipsValue );
		setInputValue( chipsValue );
		setCanShowChips( false );
	}

	const onSelectChip = ( value: ChipProps ) => {
		setChipsValue( value.value );
		setValue( value.value );
		setInputValue( value.label );
		setCanShowChips( false );
	}

	return (
		<View style={ styles.container }>
			<TextInput
				value={ inputValue }
				label={ label }
				placeholder={ placeholder }
				onChangeText={ onChangeText }
				onSubmitEditing={ onSubmitHandler }
				onBlur={ onSubmitHandler }
				onFocus={ onFocusHandler } />

			{ chipsVisible && 
				<View style={ styles.chipsWrapper }>
					<Chips
						items={ filteredHoldings.map( holding => {
							return {
								label: holding.name,
								value: holding.name
							}
						} ) }
						value={ chipsValue }
						setValue={ onSelectChip } />
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create( {
	container: {
		gap: Spacing.sm
	},
	chipsWrapper: {
		marginHorizontal: -Spacing.md
	},
	contentContainer: {
		paddingHorizontal: Spacing.md
	}
} )