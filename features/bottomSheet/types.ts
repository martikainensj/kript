import { Animated, LayoutChangeEvent } from "react-native";
import { GestureEvent, HandlerStateChangeEvent, PanGestureHandlerEventPayload } from "react-native-gesture-handler";

export interface BottomSheetProps {
	children: React.ReactNode;
  enableContentScroll?: boolean;
	translationYAnim: Animated.AnimatedValue;
	onDismiss: () => void;
}

export type BottomSheetOptions = {
	children: BottomSheetProps["children"];
	enableContentScroll?: BottomSheetProps["enableContentScroll"];
}

export interface BottomSheetContextProps {
	show: (options: BottomSheetOptions) => void;
	dismiss: () => void;
	bottomSheets: BottomSheetOptions[];
}

export interface BottomSheetProviderProps {
	children: React.ReactNode;
}