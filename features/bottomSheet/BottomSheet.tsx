import React, { useLayoutEffect, useRef, useState } from "react";
import { Animated, Dimensions, KeyboardAvoidingView, LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from "react-native";
import {
	GestureEvent,
	HandlerStateChangeEvent,
	PanGestureHandler,
	PanGestureHandlerEventPayload,
	ScrollView,
	State,
} from "react-native-gesture-handler";
import { BlurIntensity, BorderRadius, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetProps } from "./types";
import { BlurView } from "../../components/ui/BlurView";
import { ANIMATION_DURATION, DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR } from "./constants";

export const BottomSheet: React.FC<BottomSheetProps> = ({
	children,
	enableContentScroll = true,
	translationYAnim,
	onDismiss,
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const [height, setHeight] = useState(0);
	const blurIntensityAnim = useRef(new Animated.Value(0)).current;

	const handleDismiss = () => {
		Animated.timing(translationYAnim, {
			toValue: height,
			duration: ANIMATION_DURATION,
			useNativeDriver: true,
		}).start(onDismiss);
	};

	const onGestureEvent = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
		const { translationY } = e.nativeEvent;
		const resistanceValue = translationY < 0 ? translationY / (1 - translationY * DRAG_RESISTANCE_FACTOR) : translationY;
		translationYAnim.setValue(resistanceValue);
	};

	const onHandlerStateChange = (e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
		if (e.nativeEvent.state === State.END) {
			const shouldDismiss = e.nativeEvent.translationY > DISMISS_THRESHOLD && e.nativeEvent.velocityY > 0;

			if (shouldDismiss) {
				handleDismiss();
			} else {
				Animated.spring(translationYAnim, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		}
	};

	const onLayout = (event: LayoutChangeEvent) => {
		const { height } = event.nativeEvent.layout;
		setHeight(height);

		Animated.spring(translationYAnim, {
			toValue: 0,
			delay: 10,
			useNativeDriver: true,
		}).start();
	};

	useLayoutEffect(() => {
		if (height === 0) {
			return;
		}

		const listenerId = translationYAnim.addListener(({ value }) => {
			const intensity = Math.max(0, Math.min(BlurIntensity.lg, (1 - value / height) * BlurIntensity.lg))

			blurIntensityAnim.setValue(intensity);
		});

		return () => translationYAnim.removeListener(listenerId);
	}, [height]);

	return (<>
		<BlurView
			intensity={blurIntensityAnim}
			style={[
				StyleSheet.absoluteFill,
			]}
			tint={theme.dark ? "light" : "dark"}
		>
			<TouchableOpacity onPress={handleDismiss} style={StyleSheet.absoluteFill} />
		</BlurView>

		<KeyboardAvoidingView behavior="position">
			<Animated.View style={[styles.fillerContainer, { backgroundColor: theme.colors.surface, transform: [{ translateY: translationYAnim }] }]} />
			<Animated.View
				style={[
					styles.container,
					{ transform: [{ translateY: translationYAnim }], backgroundColor: theme.colors.background },
				]}
				onLayout={onLayout}
			>
				<PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
					<View style={[styles.handleContainer, { backgroundColor: theme.colors.surface }]}>
						<View style={[styles.handleIndicator, { backgroundColor: theme.colors.surfaceVariant }]} />
					</View>
				</PanGestureHandler>

				<ScrollView
					scrollEnabled={enableContentScroll}
					contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom }]}
					keyboardShouldPersistTaps={"always"}
				>
					{children}
				</ScrollView>
			</Animated.View>
		</KeyboardAvoidingView>
	</>);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		borderTopLeftRadius: BorderRadius.lg,
		borderTopRightRadius: BorderRadius.lg,
		overflow: "hidden",
	},
	handleContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderTopLeftRadius: BorderRadius.lg,
		borderTopRightRadius: BorderRadius.lg,
		paddingVertical: Spacing.sm,
	},
	handleIndicator: {
		height: Spacing.xs,
		width: Spacing.xl,
		borderRadius: BorderRadius.sm,
	},
	contentContainer: {
		...GlobalStyles.content,
		...GlobalStyles.slice
	},
	fillerContainer: {
		...StyleSheet.absoluteFillObject,
		top: "99%",
		height: Dimensions.get("screen").height,
		pointerEvents: "none",
	},
});