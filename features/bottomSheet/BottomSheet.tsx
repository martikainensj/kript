import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { PanGestureHandler, ScrollView, HandlerStateChangeEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";
import { BorderRadius, Duration, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";

interface Props {
	children: React.ReactNode;
	enableContentScroll?: boolean;
}

export const BottomSheet: React.FC<Props> = ({
	children,
	enableContentScroll
}) => {
	const { theme } = useTheme();
	const translationY = useRef(new Animated.Value(0)).current;
	const [isVisible, setIsVisible] = useState(true);
	const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
	const handleHeight = useRef(0);
	const contentHeight = useRef(0);

	const calculateHeight = () => {
		if (handleHeight.current && contentHeight.current) {
			setBottomSheetHeight(handleHeight.current + contentHeight.current);
		}
	};

	const onGestureEvent = Animated.event(
		[{ nativeEvent: { translationY } }],
		{ useNativeDriver: false }
	);

	const onHandlerStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
		if (event.nativeEvent.state === 5) {
			if (event.nativeEvent.translationY > bottomSheetHeight / 2) {
				Animated.timing(translationY, {
					toValue: bottomSheetHeight,
					duration: Duration.fast,
					useNativeDriver: true,
				}).start(() => setIsVisible(false));
			} else {
				Animated.spring(translationY, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		}
	};

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
				onGestureEvent={onGestureEvent}
				onHandlerStateChange={onHandlerStateChange}
			>
				<View
					style={[
						styles.handleContainer,
						{ backgroundColor: theme.colors.surface }
					]}
					onLayout={(event) => {
						handleHeight.current = event.nativeEvent.layout.height;
						calculateHeight();
					}}
				>
					<View
						style={[
							styles.handleIndicator,
							{ backgroundColor: theme.colors.surfaceVariant}
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
				onLayout={(event) => {
					contentHeight.current = event.nativeEvent.layout.height;
					calculateHeight();
				}}
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