import React, {
	useRef,
	useState,
} from "react";
import {
	StyleSheet,
	View,
} from "react-native";
import { ChipProps, Chips } from "./Chips";
import { FontSize, Spacing, Theme } from "../../constants";
import { Holding } from "../../models/Holding";
import { BSON } from "realm";
import { TextInput } from "./TextInput";
import { Icon } from "../ui";
import { IconButton } from "../buttons";

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
	const [ inputValue, setInputValue ] = useState( value?.name );
	const [ chipsValue, setChipsValue ] = useState( value );
	const [ canShowChips, setCanShowChips ] = useState( false );
	const [ filteredHoldings, setFilteredHoldings ] = useState( holdings );

	const chipsVisible = ! value || canShowChips;

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
				mode={ 'flat' }
				autoCorrect={ false }
				label={ label }
				placeholder={ placeholder }
				onChangeText={ onChangeText }
				onSubmitEditing={ onSubmitHandler }
				onBlur={ onSubmitHandler }
				onFocus={ onFocusHandler }
				theme={ Theme }
				style={ {
					fontSize: FontSize.sm,
				} }
				right={ inputValue && 
					<IconButton
						icon={ 'close' }
						size={ 16 }
						onPress={ onClear } />
				} />

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