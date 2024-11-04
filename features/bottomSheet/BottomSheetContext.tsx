import React, { createContext, useContext, useRef, useState } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { useTheme } from "../theme/ThemeContext";
import { BlurView } from "../../components/ui/BlurView";
import { BlurIntensity } from "../../constants";

// TODO: Koita show, hide systeemillä
// ELi ei rekisteröidä valmiiks mitään vaa setataan sisältö vaan 
// show.ssa ja hidessa vaan nulliks
interface BottomSheetContextType {
	register: (args: { id: string; component: React.ReactNode }) => string;
	open: (id: string) => void;
	close: () => void;
}

interface BottomSheetEntry {
	id: string;
	component: React.ReactNode;
	isVisible: boolean;
	translationYAnim: Animated.Value;
	height: number;
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export const useBottomSheet = (): BottomSheetContextType => {
	const context = useContext(BottomSheetContext);
	if (!context) {
		throw new Error("useBottomSheet must be used within a BottomSheetProvider");
	}
	return context;
};

export const BottomSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { theme } = useTheme();
	const [bottomSheets, setBottomSheets] = useState<BottomSheetEntry[]>([]);
	const blurIntensityAnim = useRef(new Animated.Value(0)).current;

	const register = ({ id, component }: { id: string; component: React.ReactNode }) => {
		setBottomSheets((prev) => {
			const screenHeight = Dimensions.get("screen").height;
	
			// Check if the BottomSheet with the given id already exists
			const existingIndex = prev.findIndex((sheet) => sheet.id === id);
	
			if (existingIndex !== -1) {
				// If found, create a new array with the updated BottomSheet
				const updatedSheets = [...prev];
				updatedSheets[existingIndex] = {
					...updatedSheets[existingIndex],
					component,
				};
				return updatedSheets;
			}
	
			// If not found, add a new BottomSheet to the array
			return [
				...prev,
				{
					id,
					component,
					isVisible: false,
					translationYAnim: new Animated.Value(screenHeight),
					height: 0,
				},
			];
		});
	
		return id;
	};

	const open = (id: string) => {
		setBottomSheets((prev) =>
			prev.map((sheet) => {
				if (sheet.id === id) {
					Animated.spring(sheet.translationYAnim, {
						toValue: 0,
						useNativeDriver: true,
					}).start();

					if (!sheet.translationYAnim.hasListeners()) {
						sheet.translationYAnim.addListener(({ value }) => {
							const intensity = Math.max(0, Math.min(BlurIntensity.lg, (1 - value / sheet.height) * BlurIntensity.lg));
							blurIntensityAnim.setValue(intensity);
						});
					}

					return { ...sheet, isVisible: true };
				}
				return sheet;
			})
		);
	};

	const close = () => {
		setBottomSheets((prev) =>
			prev.map((sheet) => {
				if (sheet.isVisible) {
					Animated.spring(sheet.translationYAnim, {
						toValue: sheet.height,
						useNativeDriver: true,
					}).start();
				}

				return { ...sheet, isVisible: false };
			})
		);
	};

	const setBottomSheetHeight = (id: string, height: number) => {
		setBottomSheets((prev) => prev.map((sheet) => (sheet.id === id ? { ...sheet, height } : sheet)));
	};

	return (
		<BottomSheetContext.Provider value={{ register, open, close }}>
			<View style={styles.container}>
				{children}

				<View
					style={StyleSheet.absoluteFill}
					pointerEvents={bottomSheets.some((sheet) => sheet.isVisible) ? "auto" : "none"}
				>
					<BlurView
						intensity={blurIntensityAnim}
						style={StyleSheet.absoluteFill}
						tint={theme.dark ? "light" : "dark"}
					/>
				</View>

				{bottomSheets.map((sheet) => (
					<BottomSheet
						key={sheet.id}
						enableContentScroll
						isVisible={sheet.isVisible}
						onClose={close}
						translationYAnim={sheet.translationYAnim}
						setBottomSheetHeight={(height) => setBottomSheetHeight(sheet.id, height)}
					>
						{sheet.component}
					</BottomSheet>
				))}
			</View>
		</BottomSheetContext.Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});