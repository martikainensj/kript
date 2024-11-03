import React, { createContext, useContext, useState } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { BlurView } from "expo-blur";
import { useTheme } from "../theme/ThemeContext";
import { BlurIntensity } from "../../constants";

interface BottomSheetContextType {
	register: ({ id, component }: { id: string; component: React.ReactNode }) => string;
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
// TODO: korjaa alotuksessa sheettien näkyminen 
	const register = ({ id, component }: { id: string; component: React.ReactNode }) => {
		setBottomSheets((prev) => {
			if (!prev.some((sheet) => sheet.id === id)) {
				return [
					...prev,
					{
						id,
						component,
						isVisible: false,
						translationYAnim: new Animated.Value(Dimensions.get("screen").height),
						height: 0,
					},
				];
			}
			return prev;
		});
		return id;
	};

	const open = (id: string) => {
		setBottomSheets((prev) =>
			prev.map((sheet) => ({
				...sheet,
				isVisible: sheet.id === id,
			}))
		);
	};

	const close = () => {
		setBottomSheets((prev) =>
			prev.map((sheet) => ({
				...sheet,
				isVisible: false,
			}))
		);
	};

	const setBottomSheetHeight = (id: string, height: number) => {
		setBottomSheets((prev) =>
			prev.map((sheet) =>
				sheet.id === id ? { ...sheet, height } : sheet
			)
		);
	};

	const blurOpacity = bottomSheets.reduce((acc, sheet) => {
		if (sheet.isVisible) {
			const opacity = sheet.translationYAnim.interpolate({
				inputRange: [0, sheet.height],
				outputRange: [1, 0],
				extrapolate: "clamp",
			});
			return Animated.add(acc, opacity);
		}
		return acc;
	}, new Animated.Value(0));

	return (
		<BottomSheetContext.Provider value={{ register, open, close }}>
			<View style={styles.container}>
				{children}
				
				{bottomSheets.some((sheet) => sheet.isVisible) && (
					<Animated.View
						style={[
							StyleSheet.absoluteFill,
							{
								opacity: blurOpacity,
							},
						]}
					>
						<BlurView
							intensity={BlurIntensity.lg}
							style={StyleSheet.absoluteFill}
							tint={theme.dark ? "light" : "dark"}
						/>
					</Animated.View>
				)}

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