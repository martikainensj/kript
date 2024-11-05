import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, LayoutChangeEvent } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { useTheme } from "../theme/ThemeContext";
import { BlurView } from "../../components/ui/BlurView";
import { BottomSheetContextProps, BottomSheetOptions, BottomSheetProviderProps } from "./types";
import { GestureEvent, HandlerStateChangeEvent, PanGestureHandlerEventPayload, State } from "react-native-gesture-handler";
import { ANIMATION_DURATION, DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR } from "./constants";
import { BlurIntensity } from "../../constants";
import { debounce } from "../../helpers";

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
		setBottomSheets((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
	};

	const debouncedSetHeight = useRef(
		debounce((newHeight: number) => {
			setHeight(newHeight);
			translationYAnim.setValue(newHeight);
			Animated.spring(translationYAnim, { toValue: 0, useNativeDriver: true }).start();
		})
	).current;

	const onGestureEvent = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
		const { translationY } = e.nativeEvent;
		const resistanceValue = translationY < 0 ? translationY / (1 - translationY * DRAG_RESISTANCE_FACTOR) : translationY;
		translationYAnim.setValue(resistanceValue);
	};

	const onHandlerStateChange = (e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
		if (e.nativeEvent.state === State.END) {
			const shouldDismiss = e.nativeEvent.translationY > DISMISS_THRESHOLD && e.nativeEvent.velocityY > 0;

			if (shouldDismiss) {
				Animated.timing(translationYAnim, {
					toValue: height,
					duration: ANIMATION_DURATION,
					useNativeDriver: true,
				}).start(() => dismiss());
			} else {
				Animated.spring(translationYAnim, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		}
	};

	const onLayout = (event: LayoutChangeEvent) => {
		const { height: newHeight } = event.nativeEvent.layout;
		debouncedSetHeight(newHeight);
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
			<View style={styles.container}>
				{children}

				<View style={StyleSheet.absoluteFill} pointerEvents={bottomSheets.length ? "auto" : "none"}>
					<BlurView intensity={blurIntensityAnim} style={StyleSheet.absoluteFill} tint={theme.dark ? "light" : "dark"} />
				</View>

				{bottomSheets[0] && (
					<BottomSheet
						enableContentScroll={bottomSheets[0].enableContentScroll}
						onGestureEvent={onGestureEvent}
						onHandlerStateChange={onHandlerStateChange}
						onLayout={onLayout}
						translationYAnim={translationYAnim}
					>
						{bottomSheets[0].children}
					</BottomSheet>
				)}
			</View>
		</BottomSheetContext.Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});