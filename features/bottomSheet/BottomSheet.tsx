import React from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import {
	PanGestureHandler,
	ScrollView,
} from "react-native-gesture-handler";
import { BorderRadius, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetProps } from "./types";

export const BottomSheet: React.FC<BottomSheetProps> = ({
	children,
	enableContentScroll,
	translationYAnim,
	onLayout,
	onGestureEvent,
	onHandlerStateChange
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();

	return (<>
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
			>
				{children}
			</ScrollView>
		</Animated.View>
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
	},
	fillerContainer: {
		...StyleSheet.absoluteFillObject,
		top: "100%",
		height: Dimensions.get("screen").height,
		pointerEvents: "none",
	},
});