import React, { useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, TextInputProps, View, TextInput as RNTextInput, LayoutChangeEvent } from "react-native";
import { Text } from "../ui/Text";
import { useTheme } from "../../features/theme/ThemeContext";
import { BorderRadius, Duration, GlobalStyles, Spacing } from "../../constants";
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
	suffix?: string;
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
	suffix,
	...rest
}) => {
	const { theme } = useTheme();
	const [inputValue, setInputValue] = useState(value);
	const [isFocused, setIsFocused] = useState(false);
	const [labelWidth, setLabelWidth] = useState(0);
	const [labelHeight, setLabelHeight] = useState(0);
	const ref = useRef<RNTextInput>(null);
	const inputAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
	const rightIsVisible =
		!disabled &&
		editable &&
		value?.toString() &&
		inputValue?.toString();

	const onChangeTextHandler = (string: string) => {
		if (keyboardType === 'numeric') {
			string = string.replace(/,/g, '.');
			string = string.replace(/[^0-9.]/g, '');
			const [wholePart, decimalPart] = string.split('.');

			if (
				wholePart?.length > 12 ||
				decimalPart?.length > 12 ||
				string.split('.').length > 2
			) return;

			const numericValue = parseFloat(string);
			if (max && numericValue > max) return setInputValue(max);
			if (min && numericValue < min) return setInputValue(min);

			if (string.startsWith('.')) {
				string = `0${string}`;
			};
		}

		setInputValue(string ?? 0);
	};

	const onLayoutLabel = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;

		setLabelWidth(width);
		setLabelHeight(height);
	};

	useEffect(() => {
		if (value?.toString() === inputValue?.toString()) {
			return;
		}

		if (keyboardType === "numeric") {
			const numberValue = !!inputValue
				? parseFloat(inputValue.toString())
				: "";

			onChangeText(numberValue);
		} else {
			onChangeText(inputValue);
		}
	}, [inputValue]);

	useEffect(() => {
		if (value?.toString() === inputValue?.toString()) {
			return;
		}

		setInputValue(value ?? '');
	}, [value]);

	useEffect(() => {
		Animated.timing(inputAnim, {
			toValue: (isFocused || !!inputValue) ? 1 : 0,
			duration: Duration.fast,
			useNativeDriver: true,
		}).start();
	}, [isFocused, inputValue]);

	const translateY = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -Spacing.sm - 1],
	});
	const scale = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0.9],
	});
	const opacity = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0.7],
	});
	const translateX = inputAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -labelWidth * 0.05],
	})

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.colors.surfaceVariant },
				disabled && styles.disabled 
			]}
		>
			<Animated.View
				style={[
					styles.labelWrapper,
					{
						opacity,
						transform: [
							{ translateX },
							{ translateY },
							{ scale }
						]
					}
				]}
				onLayout={onLayoutLabel}
			>
				<Text
					fontSize="sm"
					style={[
						styles.labelContainer,
						{ top: -labelHeight * 0.5 }
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
					onFocus={(e) => {
						rest.onFocus?.(e);
						setIsFocused(true)
					}}
					onBlur={(e) => {
						rest.onBlur?.(e);
						setIsFocused(false)
					}}
					style={[
						styles.inputContainer,
						{ color: theme.colors.onBackground },
						rest.style,
					]}
				/>

				{!!suffix && (
					<Text style={[
						!rightIsVisible && { marginRight: Spacing.md }
					]}>
						{suffix}
					</Text>
				)}

				{!!rightIsVisible && (
					<IconButton
						icon="close-circle"
						onPress={() => {
							onChangeText("");
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
		flexGrow: 1
	},
	labelWrapper: {
		position: 'absolute',
		top: '50%',
		left: Spacing.md,
	},
	labelContainer: {
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputContainer: {
		paddingHorizontal: Spacing.md,
		paddingTop: Spacing.lg,
		paddingBottom: Spacing.sm,
		flexGrow: 1,
		flexShrink: 1
	},
	disabled: {
		...GlobalStyles.disabled
	}
});