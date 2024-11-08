import React, { createContext, useContext, useRef, useState } from "react";
import { Animated, Dimensions } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { BottomSheetContextProps, BottomSheetOptions, BottomSheetProviderProps } from "./types";

const BottomSheetContext = createContext<BottomSheetContextProps>({
	show: () => { },
	dismiss: () => { },
	bottomSheets: [],
});

export const useBottomSheet = () => useContext(BottomSheetContext);

export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({ children }) => {
	const [bottomSheets, setBottomSheets] = useState<BottomSheetOptions[]>([]);
	const translationYAnim = useRef(new Animated.Value(Dimensions.get("screen").height)).current;

	const show = (options: BottomSheetOptions) => {
		translationYAnim.setValue(Dimensions.get("screen").height);
		setBottomSheets((prev) => [options, ...prev]);
	};

	const dismiss = () => {
		setBottomSheets((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
	};

	return (
		<BottomSheetContext.Provider value={{ show, dismiss, bottomSheets }}>
			{children}

			{bottomSheets[0] && (
				<BottomSheet
					enableContentScroll={bottomSheets[0].enableContentScroll}
					translationYAnim={translationYAnim}
					onDismiss={dismiss}
				>
					{bottomSheets[0].children}
				</BottomSheet>
			)}
		</BottomSheetContext.Provider>
	);
};