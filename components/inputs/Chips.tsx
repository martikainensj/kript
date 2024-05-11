import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

import { BorderRadius, Spacing, Theme } from "../../constants";

interface ChipProps {
	label: string
	value: string | number
}

interface ChipsProps {
	value: ChipProps['value'],
	setValue: React.Dispatch<React.SetStateAction<ChipProps['value']>>
	items: ChipProps[]
}

export const Chips: React.FC<ChipsProps> = ( {
	value,
	setValue,
	items,
} ) => {

	const onPressHandler = ( item ) => {
		setValue( item.value );
	}
	
	return (
		<ScrollView
			horizontal={ true }
			keyboardShouldPersistTaps="handled"
			showsHorizontalScrollIndicator={ false }
			contentContainerStyle={ styles.contentContainer }>
			{ items.map( ( chip, key ) => (
				<Chip
					key={ key }
					mode={ 'flat' }
					selected={ chip.value === value }
					onPress={ onPressHandler.bind( this, chip ) }
					style={ styles.chip }
					theme={ Theme }>
					{ chip.label }
				</Chip>
			) ) }
		</ScrollView>
	);
}

const styles = StyleSheet.create( {
	contentContainer: {
		gap: Spacing.sm
	},
	chip: {
		borderRadius: BorderRadius.xl
	}
} );