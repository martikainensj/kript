import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "react-native-paper";

import { BorderRadius, Spacing, Theme } from "../../constants";

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

	const onPressHandler = ( item: ChipProps ) => {
		setValue( item );
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
					selected={ chip === value }
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
		gap: Spacing.sm,
		paddingHorizontal: Spacing.md
	},
	chip: {
		borderRadius: BorderRadius.xl
	}
} );