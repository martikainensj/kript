import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { PanGestureHandler, ScrollView, HandlerStateChangeEvent, PanGestureHandlerEventPayload, GestureEvent, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { BorderRadius, Duration, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";
import { ANIMATION_DURATION, DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR } from "./constants";

interface Props {
	children: React.ReactNode;
	enableContentScroll?: boolean;
	isVisible: boolean;
	onClose: () => void;
}

export const BottomSheet: React.FC<Props> = ({
	children,
	enableContentScroll,
	isVisible,
	onClose
}) => {
	const { theme } = useTheme();
	const translationYAnim = useRef(new Animated.Value(500)).current; // Start off-screen

	useEffect(() => {
		if (isVisible) {
			Animated.spring(translationYAnim, {
				toValue: 0,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(translationYAnim, {
				toValue: 500,
				duration: ANIMATION_DURATION,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible]);

	const onGestureEvent = (e: PanGestureHandlerGestureEvent) => {
		const { translationY } = e.nativeEvent;

		if (translationY < 0) {
			translationYAnim.setValue(translationY / (1 - translationY * DRAG_RESISTANCE_FACTOR));
		} else {
			translationYAnim.setValue(translationY);
		}
	}

	const onHandlerStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
		if (event.nativeEvent.state === 5) {
			if (event.nativeEvent.translationY > DISMISS_THRESHOLD) {
				Animated.timing(translationYAnim, {
					toValue: 500,
					duration: Duration.fast,
					useNativeDriver: true,
				}).start(() => onClose());
			} else {
				Animated.spring(translationYAnim, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		}
	};

	return (
		<Animated.View
			style={[
				styles.container,
				{
					transform: [{ translateY: translationYAnim }],
				},
			]}
		>
			<PanGestureHandler
				onGestureEvent={onGestureEvent}
				onHandlerStateChange={onHandlerStateChange}
			>
				<View
					style={[
						styles.handleContainer,
						{ backgroundColor: theme.colors.surface }
					]}
				>
					<View
						style={[
							styles.handleIndicator,
							{ backgroundColor: theme.colors.surfaceVariant }
						]}
					/>
				</View>
			</PanGestureHandler>
			<ScrollView
				scrollEnabled={enableContentScroll}
				style={{flexGrow: 1}}
				contentContainerStyle={[
					styles.contentContainer,
					{ backgroundColor: theme.colors.background }
				]}
			>
				{children}
			</ScrollView>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 0,
		width: "100%",
	},
	handleContainer: {
		...GlobalStyles.content,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderTopLeftRadius: BorderRadius.lg,
		borderTopRightRadius: BorderRadius.lg,
		overflow: "hidden"
	},
	handleIndicator: {
		height: Spacing.xs,
		width: Spacing.xl,
		borderRadius: BorderRadius.sm
	},
	contentContainer: {
		...GlobalStyles.content,
	},
});