import React from 'react';
import { GestureResponderEvent, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { BorderRadius, GlobalStyles, Spacing } from '../../constants';

export interface OptionProps {
	value: string;
	icon?: IconSource;
	disabled?: boolean;
	accessibilityLabel?: string;
	checkedColor?: string;
	uncheckedColor?: string;
	onPress?: ( event: GestureResponderEvent ) => void;
	label?: string;
	showSelectedCheck?: boolean;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
	testID?: string;
}

interface SelectProps {
	label?: string;
	value: any;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	options: OptionProps[];
	style?: StyleProp<ViewStyle>;
}

export const Select: React.FC<SelectProps> = ( {
	label,
	value,
	setValue,
	options,
	style
} ) => {
	const theme = useTheme();
	const onValueChange = ( value ) => {
		setValue( value );
	}
	
	return (
		<View style={ styles.container }>
			{ label && (
				<Text style={ GlobalStyles.label }>
					{ label }
				</Text>
			) }

			<SegmentedButtons
				value={ value }
				onValueChange={ onValueChange }
				theme={ { roundness: 0 } }
				buttons={ options?.filter( option => option.label ).map( option => {
					return {
						...option,
						showSelectedCheck: true,
						style: [
							styles.buttonContainer,
							option.value === value && {
								backgroundColor: theme.colors.background
							}
						]
					}	
				} ) }
				style={ [
					styles.segmentedButtonsContainer,
					{ backgroundColor: theme.colors.surfaceVariant },
					style
				] } />
		</View>
	);
}

const styles = StyleSheet.create( {
	container: {
		gap: Spacing.xs
	},
	segmentedButtonsContainer: {
		padding: Spacing.xs,
		borderRadius: BorderRadius.md,
		gap: Spacing.xs
	},
	buttonContainer: {
		borderTopLeftRadius: BorderRadius.sm,
		borderTopRightRadius: BorderRadius.sm,
		borderBottomLeftRadius: BorderRadius.sm,
		borderBottomRightRadius: BorderRadius.sm,
		borderTopWidth: 0,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderBottomWidth: 0,
		overflow: 'hidden',
	}
} );