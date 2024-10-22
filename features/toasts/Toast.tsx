import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { ToastProps } from "./types";
import { Animated, StyleSheet, View } from "react-native";
import { ANIMATION_DURATION, DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR, TRANSLATE_Y } from "./constants";
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler";
import { BorderRadius, Spacing } from "../../constants";
import { Text } from "../../components/ui/Text";
import { DefaultButton, IconButton } from "../../components/buttons";

export const Toast: React.FC<ToastProps> = ({
	id,
	title,
	text,
	actions,
	type = 'info',
	timeout = 4000,
	isDismissable = true,
	autoDismiss = true,
	onDismiss
}) => {
	const { theme } = useTheme();
	const timeoutHandle = useRef<NodeJS.Timeout | null>(null);
	const translateYAnim = useRef(new Animated.Value(TRANSLATE_Y)).current;
	const [isDragging, setIsDragging] = useState(false);

	const opacity = translateYAnim.interpolate({
		inputRange: [0, TRANSLATE_Y],
		outputRange: [1, 0],
		extrapolate: 'clamp'
	});

	const handleDismiss = () => {
		clearTimeout(timeoutHandle.current!);

		Animated.timing(translateYAnim, {
			toValue: TRANSLATE_Y,
			duration: ANIMATION_DURATION,
			useNativeDriver: true,
		}).start(() => onDismiss?.(id));
	}

	const handleTimer = (action: 'start' | 'clear') => {
		if (!autoDismiss) {
			return;
		}

		if (action === 'start') {
			timeoutHandle.current = setTimeout(handleDismiss, timeout);
		} else {
			clearTimeout(timeoutHandle.current!);
		}
	};

	const onGestureEvent = (e: PanGestureHandlerGestureEvent) => {
		if (!isDismissable) {
			return;
		}

		const { translationY } = e.nativeEvent;

		if (translationY > 0) {
			translateYAnim.setValue(translationY / (1 + translationY * DRAG_RESISTANCE_FACTOR));
		} else {
			translateYAnim.setValue(translationY);
		}
	}

	const onHandlerStateChange = (e: PanGestureHandlerGestureEvent) => {
		if (!isDismissable) {
			return;
		}

		const { state, translationY } = e.nativeEvent;

		if (state === State.ACTIVE) {
			setIsDragging(true);
			handleTimer('clear');
		} else if (state === State.END) {
			setIsDragging(false);
			handleTimer('start');
		}

		if (state === State.END || state === State.CANCELLED) {
			if (translationY > DISMISS_THRESHOLD) {
				handleDismiss();
			} else {
				Animated.spring(translateYAnim, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		}
	};

	useEffect(() => {
		Animated.spring(translateYAnim, {
			toValue: 0,
			useNativeDriver: true,
		}).start();

		handleTimer('start');

		return () => {
			handleTimer('clear');
		}
	}, []);

	return (
		<PanGestureHandler
			onGestureEvent={onGestureEvent}
			onHandlerStateChange={onHandlerStateChange}
		>
			<Animated.View
				style={[
					styles.container,
					{
						backgroundColor: theme.colors.surfaceVariant,
						opacity,
						transform: [{ translateY: translateYAnim }],
						zIndex: isDragging ? 1 : 0,
					},
					type === 'info' && styles.info,
					type === 'success' && styles.success,
					type === 'error' && styles.error,
				]}
			>
				{title && (
					<Text fontSize="md">
						{title}
					</Text>
				)}

				{text && (
					<Text>
						{text}
					</Text>
				)}

				{isDismissable && (
					<IconButton
						icon="close"
						onPress={handleDismiss}
						style={styles.dismissButton}
					/>
				)}

				{actions?.length && (
					<View style={styles.actionsContainer}>
						{actions?.map((action, index) => {
							return (
								<DefaultButton
									key={index}
									onPress={() => {
										action.onPress();
										handleDismiss();
									}}
									mode="inverted"
								>
									{action.label}
								</DefaultButton>
							);
						})}
					</View>
				)}
			</Animated.View>
		</PanGestureHandler>
	)
};

const styles = StyleSheet.create({
	container: {
		padding: Spacing.md,
		borderRadius: BorderRadius.md,
	},
	dismissButton: {
		position: 'absolute',
		top: 0,
		right: 0
	},
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: Spacing.sm,
		marginTop: Spacing.md
	},
	info: {},
	success: {},
	error: {},
})