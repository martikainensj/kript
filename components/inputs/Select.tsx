import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { BorderRadius, GlobalStyles, Spacing } from '../../constants';
import { useTheme } from '../../features/theme/ThemeContext';
import { Text } from '../ui/Text';

export interface OptionProps {
	value: string;
	disabled?: boolean;
	selectedColor?: string;
	deselectedColor?: string;
	label?: string;
	style?: StyleProp<ViewStyle>;
	labelStyle?: StyleProp<TextStyle>;
}

interface Props {
	label?: string;
	value: string | number;
	setValue: React.Dispatch<React.SetStateAction<Props['value']>>;
	options: OptionProps[];
	style?: StyleProp<ViewStyle>;
	horizontal?: boolean;
	disabled?: boolean;
}

export const Select: React.FC<Props> = ({
	label,
	value,
	setValue,
	options,
	style,
	horizontal = true,
	disabled,
}) => {
	const { theme } = useTheme();

	return (
		<View style={styles.container}>
			{label && (
				<Text fontWeight="semiBold">
					{label}
				</Text>
			)}

			<View
				style={[
					styles.optionsContainer,
					{ backgroundColor: theme.colors.surfaceVariant },
					horizontal && { flexDirection: "row" },
					disabled && { ...GlobalStyles.disabled },
					style
				]}
			>
				{options?.map((option, index) => {
					const active = option.value === value;

					return (
						<TouchableOpacity
							key={index}
							style={[
								styles.buttonContainer,
								active && { backgroundColor: theme.colors.background }
							]}
							onPress={() => setValue(option.value)}
							disabled={active}
						>
							<Text
								textAlign='center'
								style={[
									active && {
										color: option.selectedColor ?? theme.colors.onBackground,
									}
								]}
							>
								{option.label}
							</Text>
						</TouchableOpacity>
					)
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: Spacing.sm
	},
	optionsContainer: {
		padding: Spacing.xs,
		borderRadius: BorderRadius.md,
		gap: Spacing.xs
	},
	buttonContainer: {
		...GlobalStyles.button,
		flexGrow: 1,
		alignItems: 'center',
		borderRadius: BorderRadius.md - Spacing.xs,
		overflow: 'hidden',
	}
});