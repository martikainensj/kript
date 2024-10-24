import React, { useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, TextInputProps, View, TextInput as RNTextInput } from "react-native";
import { Text } from "../ui/Text";
import { useTheme } from "../../features/theme/ThemeContext";
import { BorderRadius, IconSize, Spacing } from "../../constants";
import { IconButton } from "../buttons";

interface Props extends Omit<TextInputProps, 'value' | 'onChangeText'> {
	label: string;
	value: string | number;
	onChangeText: ((text: string | number) => void) & Function;
	disabled?: boolean;
	max?: number;
	min?: number;
	keyboardType?:
	| 'default'
	| 'numeric'
	| 'email-address'
	| 'phone-pad'
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
	const ref = useRef<RNTextInput>(null);
	const inputAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
	const rightIsVisible = !disabled && editable && value;

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
	};

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

	useEffect(() => {
		Animated.timing(inputAnim, {
			toValue: isFocused || !!inputValue ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [isFocused, inputValue]);

	const labelYTranslate = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -Spacing.sm - 1],
	});
	const labelScale = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0.9],
	});
	const labelOpacity = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0.7],
	});
	const labelXTranslate = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [Spacing.sm, -1],
	});

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.surfaceVariant }
			]}
		>
			<Animated.View
				style={[
					styles.labelWrapper,
					{
						opacity: labelOpacity,
						transform: [
							{ translateX: labelXTranslate },
							{ translateY: labelYTranslate },
							{ scale: labelScale }
						]
					}
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
			</Animated.View>

			<Animated.View
				style={[
					styles.inputWrapper,
					{
						opacity: inputAnim,
					}
				]}
			>
				<RNTextInput
					{...rest}
					ref={ref}
					value={inputValue?.toString()}
					onChangeText={onChangeTextHandler}
					placeholder={placeholder}
					keyboardType={keyboardType}
					editable={editable}
					multiline={multiline}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					style={[
						styles.inputContainer,
						{ color: theme.colors.onBackground }
					]}
				/>

				{ rightIsVisible && (
					<IconButton
						icon="close-circle"
						onPress={() => {
							onChangeText( null ),
							ref.current.blur();
						}}
					/>
				)}
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		borderRadius: BorderRadius.md,
	},
	labelWrapper: {
		position: 'absolute',
		left: Spacing.sm
	},
	labelContainer: {
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputContainer: {
		paddingHorizontal: Spacing.sm,
		paddingTop: Spacing.md + 8,
		paddingBottom: Spacing.md - 8,
		flexGrow: 1
	},
});