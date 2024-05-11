import React, {
	useRef,
	useState,
} from "react";
import {
	StyleSheet,
	View,
} from "react-native";
import {
	TextInput,
	TextInputProps,
} from "react-native-paper";
import { Chips } from "./Chips";
import { FontSize, Spacing, Theme } from "../../constants";
import { Holding } from "../../models/Holding";
import { BSON } from "realm";

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
	const textInputRef = useRef();
	const [ inputValue, setInputValue ] = useState( value?.name );
	const [ chipsValue, setChipsValue ] = useState( value?._id.toString() );
	const [ canShowChips, setCanShowChips ] = useState( false );
	const [ filteredHoldings, setFilteredHoldings ] = useState( holdings );

	const chipsVisible = ! value || canShowChips;

	const getHolding = ( id: BSON.ObjectID ) => {
		if ( ! id ) return;

		return filteredHoldings?.find( holding => holding._id === id );
	}

	const onFocusHandler = () => {
		setCanShowChips( true );
	}

	const onClear = () => {
		setInputValue( '' );
		setValue( null );
		setChipsValue( '' );
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

		if ( ! filteredHoldings.length ) {
			filteredHoldings.push( {
				_id: new BSON.ObjectID(),
				name: value,
			} );
		}

		setFilteredHoldings( filteredHoldings );

		if ( ! value ) {
			return setChipsValue( '' );
		}

		setChipsValue( 
			!! filteredHoldings.length && filteredHoldings[0]._id.toString()
		);
	}

	const onSubmitHandler = () => {
		if ( ! chipsValue ) {
			return onClear();
		}

		const holding = getHolding( new BSON.ObjectID( chipsValue ) );
		
		setValue( holding );
		
		setInputValue( holding.name );
		setCanShowChips( false );
	}

	const onSelectChip = ( value: string ) => {
		const id = new BSON.ObjectID( value );
		const holding = getHolding( id );

		setChipsValue( holding._id.toString() );
		setValue( holding );
		setInputValue( holding?.name );
		setCanShowChips( false );
	}

	return (
		<View>
			<TextInput
				ref={ textInputRef }
				value={ inputValue }
				mode={ 'outlined' }
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
				right={ ( value ) && 
					<TextInput.Icon
						icon={ 'close' }
						size={ 16 }
						onPress={ onClear } />
				} />
			{ chipsVisible && 
				<View style={ styles.chipsWrapper }>
					<Chips
						items={ filteredHoldings.map( ( holding ) => {
							return {
								label: holding.name,
								value: holding._id.toString()
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
	chipsWrapper: {
		marginHorizontal: -Spacing.md
	},
	contentContainer: {
		paddingHorizontal: Spacing.md
	}
} )