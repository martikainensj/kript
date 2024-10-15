import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { BorderRadius, Spacing } from "../../constants";
import { ChipButton } from "../buttons/ChipButton";

export interface ChipProps {
	label: string
	value: any
}

interface ChipsProps {
	value: any,
	setValue: React.Dispatch<React.SetStateAction<any>>
	items: ChipProps[]
}

export const Chips: React.FC<ChipsProps> = ( {
	value,
	setValue,
	items,
} ) => {
	const uniqueValues = useMemo( () => {
		const seen = new Set();

		return items.filter( item => {
			const value = item.value;
			if ( seen.has( value ) ) {
				return false;
			} 
			
			seen.add( value );
			return true;
		} );
	}, [items] );

	const onPressHandler = ( item: ChipProps ) => {
		setValue( item );
	}
	
	return (
		<ScrollView
			horizontal={ true }
			keyboardShouldPersistTaps="handled"
			showsHorizontalScrollIndicator={ false }
			contentContainerStyle={ styles.contentContainer }>
			{ uniqueValues.map( ( chip, key ) => (
				<ChipButton
					key={ key }
					selected={ chip.value === value }
					onPress={ onPressHandler.bind( this, chip ) }
					style={ styles.chip }>
					{ chip.label }
				</ChipButton>
			) ) }
		</ScrollView>
	);
}

const styles = StyleSheet.create( {
	contentContainer: {
		gap: Spacing.sm,
		paddingHorizontal: Spacing.md
	},
	chip: {
		borderRadius: BorderRadius.xl
	}
} );