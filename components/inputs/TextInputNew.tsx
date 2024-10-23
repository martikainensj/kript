import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, TextInputProps, View, TextInput as RNTextInput } from "react-native";
import { Text } from "../ui/Text";
import { useTheme } from "../../features/theme/ThemeContext";
import { BorderRadius, Spacing } from "../../constants";

interface Props extends Omit<TextInputProps, 'value' | 'onChangeText'> {
	label: string;
	value: string | number,
	onChangeText: ((text: string | number) => void) & Function,
	disabled?: boolean;
	max?: number,
	min?: number,
}

export const TextInput: React.FC<Props> = ({
	label,
	value,
	onChangeText,
	placeholder = 'Write here...',
	keyboardType = 'default',
	editable = true,
	multiline = false,
	disabled,
	max,
	min,
	...rest
}) => {
	const { theme } = useTheme();
	const [inputValue, setInputValue] = useState(value);
	const [isFocused, setIsFocused] = useState(false);
	const rightIsVisible =
		!disabled && editable && value;

	const onChangeTextHandler = (string: string) => {
		if (keyboardType === 'numeric') {
			string = string.replace(/[^0-9.]/g, '');
			const maxPartLength = 12;

			if (max && parseFloat(string) > max) {
				return setInputValue(max.toFixed(maxPartLength));
			}

			if (min && parseFloat(string) < min) {
				return setInputValue(min.toFixed(maxPartLength));
			}

			const parts = string.split('.');

			// Prevent multiple dots in the string
			if (parts.length > 2) {
				return;
			}

			let wholePart = parts[0];
			let decimalPart = parts[1];

			// Limit the whole part length
			if (wholePart?.length > maxPartLength) {
				return;
			}

			// Limit the decimal part length
			if (decimalPart?.length > maxPartLength) {
				return;
			}

			// Prefix string with '0' if it starts with a dot
			if (string.startsWith('.')) {
				return setInputValue(`0${string}`);
			}
		}

		setInputValue(string);
	}

	useEffect(() => {
		if (keyboardType === 'numeric') {
			const numberValue = parseFloat(inputValue?.toString());

			if (isNaN(numberValue)) {
				return onChangeText(null);
			}

			return onChangeText(numberValue);
		}

		onChangeText(inputValue);
	}, [inputValue]);

	useEffect(() => {
		if (value?.toString() !== inputValue?.toString()) {
			setInputValue(value ?? '');
		}
	}, [value]);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.surfaceVariant }
			]}
		>
			<Animated.Text
				style={[
					styles.labelWrapper
				]}
			>
				<Text
					fontSize="sm"
					style={[
						styles.labelContainer
					]}
				>
					{label}
				</Text>
			</Animated.Text>

			<Animated.View
				style={[
					styles.inputWrapper
				]}
			>
				<RNTextInput
					{...rest}
					value={inputValue?.toString()}
					onChangeText={onChangeTextHandler}
					placeholder={placeholder}
					keyboardType={keyboardType}
					editable={editable}
					multiline={multiline}
					style={[
						styles.inputContainer,
						{ color: theme.colors.onBackground }
					]}
				/>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		borderRadius: BorderRadius.sm,
		padding: Spacing.md
	},
	labelWrapper: {
		position: 'absolute',
		left: Spacing.md
	},
	labelContainer: {
	},
	inputWrapper: {

	},
	inputContainer: {

	}
});