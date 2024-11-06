import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, LayoutChangeEvent, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Platform } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { useTheme } from "../theme/ThemeContext";
import { BlurView } from "../../components/ui/BlurView";
import { BottomSheetContextProps, BottomSheetOptions, BottomSheetProviderProps } from "./types";
import { GestureEvent, HandlerStateChangeEvent, PanGestureHandlerEventPayload, State } from "react-native-gesture-handler";
import { ANIMATION_DURATION, DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR } from "./constants";
import { BlurIntensity, GlobalStyles } from "../../constants";

const BottomSheetContext = createContext<BottomSheetContextProps>({
	show: () => { },
	dismiss: () => { },
	bottomSheets: [],
});

export const useBottomSheet = () => useContext(BottomSheetContext);

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
	const { theme } = useTheme();
	const [bottomSheets, setBottomSheets] = useState<BottomSheetOptions[]>([]);
	const [height, setHeight] = useState(0);
	const blurIntensityAnim = useRef(new Animated.Value(0)).current;
	const translationYAnim = useRef(new Animated.Value(Dimensions.get("screen").height)).current;

	const show = (options: BottomSheetOptions) => {
		translationYAnim.setValue(Dimensions.get("screen").height);
		setBottomSheets((prev) => [options, ...prev]);
	};

	const dismiss = () => {
		Animated.timing(translationYAnim, {
			toValue: height,
			duration: ANIMATION_DURATION,
			useNativeDriver: true,
		}).start(() => {
			setBottomSheets((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
		});
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
				dismiss();
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
			useNativeDriver: true
		}).start();
	};

	useEffect(() => {
		const listenerId = translationYAnim.addListener(({ value }) => {
			const intensity = Math.max(0, Math.min(BlurIntensity.lg, (1 - value / height) * BlurIntensity.lg));
			blurIntensityAnim.setValue(intensity);
		});

		return () => translationYAnim.removeListener(listenerId);
	});

	return (
		<BottomSheetContext.Provider value={{ show, dismiss, bottomSheets }}>
			{children}

			<BlurView
				intensity={blurIntensityAnim}
				style={[
					StyleSheet.absoluteFill,
					{ pointerEvents: bottomSheets.length ? "auto" : "none" }
				]}
				tint={theme.dark ? "light" : "dark"}
			>
				<TouchableOpacity
					onPress={dismiss}
					style={StyleSheet.absoluteFill}
				/>
			</BlurView>

			{bottomSheets[0] && (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={0} // Adjust this offset as needed
				>
					<BottomSheet
						enableContentScroll={bottomSheets[0].enableContentScroll}
						onGestureEvent={onGestureEvent}
						onHandlerStateChange={onHandlerStateChange}
						onLayout={onLayout}
						translationYAnim={translationYAnim}
					>
						{bottomSheets[0].children}
					</BottomSheet>
				</KeyboardAvoidingView>
			)}
		</BottomSheetContext.Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},
});