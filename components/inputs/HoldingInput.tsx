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
import { BSON, List, User } from "realm";
import { TextInput } from "./TextInput";
import { useUser } from "@realm/react";
import { Transaction } from "../../models/Transaction";

interface HoldingInputProps {
	value: Holding
	setValue: React.Dispatch<React.SetStateAction<Holding>>
	label: string
	placeholder: string,
	holdings: Holding[]
}

export const HoldingInput: React.FC<HoldingInputProps> = ({
	value,
	setValue,
	label,
	placeholder,
	holdings
}) => {
	const user: User = useUser();

	const [ inputValue, setInputValue ] = useState( value?.name );
	const [ chipsValue, setChipsValue ] = useState( value );
	const [ canShowChips, setCanShowChips ] = useState( false );
	const [ filteredHoldings, setFilteredHoldings ] = useState( holdings );

	const chipsVisible = !! filteredHoldings.length && ( ! value || canShowChips );

	const onFocusHandler = () => {
		setCanShowChips( true );
	}

	const onClear = () => {
		setInputValue( '' );
		setValue( null );
		setChipsValue( null );
		setFilteredHoldings( holdings );
	}
	
	const onChangeText = ( value: string ) => {
		setInputValue( value );

		const filteredHoldings = !! value
			? holdings.filter( holding => {
					const label = holding.name?.toLowerCase();
					return label.includes( value.toString().toLowerCase() );
				} )
			: holdings;

		if ( !! value && ! filteredHoldings.length  ) {
			filteredHoldings.push( {
				_id: new BSON.ObjectID(),
				name: value,
				owner_id: user.id,
				transactions: new List<Transaction>
			} );
		}

		setFilteredHoldings( filteredHoldings );

		if ( ! value ) {
			return setChipsValue( null );
		}

		setChipsValue( 
			!! filteredHoldings.length && filteredHoldings[0]
		);
	}

	const onSubmitHandler = () => {
		if ( ! chipsValue ) {
			return onClear();
		}

		setValue( chipsValue );
		setInputValue( chipsValue.name );
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
								value: holding
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