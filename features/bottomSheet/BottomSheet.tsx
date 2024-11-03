import React, { useEffect, useState } from "react";
import { Animated, Dimensions, LayoutChangeEvent, StyleSheet, View } from "react-native";
import {
	PanGestureHandler,
	ScrollView,
	HandlerStateChangeEvent,
	PanGestureHandlerEventPayload,
	PanGestureHandlerGestureEvent,
	State,
} from "react-native-gesture-handler";
import { BorderRadius, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";
import { DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR } from "./constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
	children: React.ReactNode;
	enableContentScroll?: boolean;
	isVisible: boolean;
	onClose: () => void;
	translationYAnim: Animated.Value;
	setBottomSheetHeight: (height: number) => void;
}

export const BottomSheet: React.FC<Props> = ({
	children,
	enableContentScroll,
	isVisible,
	onClose,
	translationYAnim,
	setBottomSheetHeight,
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const [height, setHeight] = useState(0);

	useEffect(() => {
		console.log("isVisible", isVisible);
		Animated.spring(translationYAnim, {
			toValue: isVisible ? 0 : height,
			useNativeDriver: true,
		}).start();
	}, [isVisible]);

	const onGestureEvent = (e: PanGestureHandlerGestureEvent) => {
		const { translationY } = e.nativeEvent;

		if (translationY < 0) {
			const resistanceValue = translationY / (1 - translationY * DRAG_RESISTANCE_FACTOR);
			translationYAnim.setValue(resistanceValue);
		} else {
			translationYAnim.setValue(translationY);
		}
	};

	const onHandlerStateChange = (e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
		if (e.nativeEvent.state === State.END) {
			if (e.nativeEvent.translationY > DISMISS_THRESHOLD) {
				Animated.spring(translationYAnim, {
					toValue: height,
					useNativeDriver: true,
				}).start(onClose);
			} else {
				Animated.parallel([
					Animated.spring(translationYAnim, {
						toValue: 0,
						useNativeDriver: true,
					}),
				]).start();
			}
		}
	};

	const onLayout = (event: LayoutChangeEvent) => {
		const { height } = event.nativeEvent.layout;
		console.log("onLayout", height);
		setHeight(height);
		setBottomSheetHeight(height);
	};

	return (
		<>
			<Animated.View
				style={[
					StyleSheet.absoluteFill,
					{
						top: Dimensions.get("screen").height,
						height: Dimensions.get("screen").height,
						backgroundColor: theme.colors.surface,
						transform: [{ translateY: translationYAnim }],
					}
				]}
			/>
			<Animated.View
				style={[
					styles.container,
					{
						transform: [{ translateY: translationYAnim }],
						backgroundColor: theme.colors.background,
					},
				]}
				onLayout={onLayout}
			>
				<PanGestureHandler
					onGestureEvent={onGestureEvent}
					onHandlerStateChange={onHandlerStateChange}
				>
					<View
						style={[
							styles.handleContainer,
							{ backgroundColor: theme.colors.surface },
						]}
					>
						<View
							style={[
								styles.handleIndicator,
								{ backgroundColor: theme.colors.surfaceVariant },
							]}
						/>
					</View>
				</PanGestureHandler>

				<ScrollView
					scrollEnabled={enableContentScroll}
					contentContainerStyle={[
						styles.contentContainer,
						{ paddingBottom: insets.bottom }
					]}
				>
					{children}
				</ScrollView>
			</Animated.View>
		</>
	);
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
		overflow: "hidden",
		paddingVertical: Spacing.sm,
	},
	handleIndicator: {
		height: Spacing.xs,
		width: Spacing.xl,
		borderRadius: BorderRadius.sm,
	},
	contentContainer: {
		...GlobalStyles.content,
	},
});