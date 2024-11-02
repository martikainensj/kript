import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { PanGestureHandler, ScrollView, HandlerStateChangeEvent, PanGestureHandlerEventPayload, GestureEvent } from "react-native-gesture-handler";
import { BorderRadius, Duration, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";

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
	const translationY = useRef(new Animated.Value(500)).current; // Start off-screen

	useEffect(() => {
		// Show the BottomSheet when it becomes visible
		if (isVisible) {
			Animated.spring(translationY, {
				toValue: 0,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(translationY, {
				toValue: 500, // Move it off-screen
				duration: Duration.fast,
				useNativeDriver: true,
			}).start();
		}
	}, [isVisible]);

	const onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
		// Update the translationY value based on the gesture
		translationY.setValue(Math.max(event.nativeEvent.translationY, 0));
	};

	const onHandlerStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
		if (event.nativeEvent.state === 5) { // Gesture state: END
			if (event.nativeEvent.translationY > 100) { // Adjust the threshold as needed
				Animated.timing(translationY, {
					toValue: 500, // Move it off-screen
					duration: Duration.fast,
					useNativeDriver: true,
				}).start(() => onClose());
			} else {
				Animated.spring(translationY, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		}
	};

	// Return null if the BottomSheet is not visible
	if (!isVisible) {
		return null;
	}

	return (
		<Animated.View
			style={[
				styles.container,
				{ transform: [{ translateY: translationY }] },
			]}
		>
			<PanGestureHandler
				onGestureEvent={onGestureEvent} // Use the handler function here
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