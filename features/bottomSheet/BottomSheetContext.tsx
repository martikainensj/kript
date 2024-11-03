import React, { createContext, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { BlurView } from "expo-blur";

interface BottomSheetContextType {
	register: ({ id, component }: { id: string, component: React.ReactNode }) => string;
	open: (id: string) => void;
	close: () => void;
}

interface BottomSheetEntry {
	id: string;
	component: React.ReactNode;
	isVisible: boolean;
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
	const [bottomSheets, setBottomSheets] = useState<BottomSheetEntry[]>([]);
	const [activeSheetId, setActiveSheetId] = useState<string | null>(null);
	
	const register = ({ id, component }: { id: string, component: React.ReactNode }) => {
		console.log(id);
		setBottomSheets((prev) => {
			const updatedSheets = prev.map(sheet =>
				sheet.id === id ? { id, component, isVisible: false } : sheet
			);
	
			if (!prev.some(sheet => sheet.id === id)) {
				updatedSheets.push({ id, component, isVisible: false });
			}
	
			return updatedSheets;
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
		setActiveSheetId(id);
	};

	const close = () => {
		setBottomSheets((prev) =>
			prev.map((sheet) => ({
				...sheet,
				isVisible: false,
			}))
		);
		setActiveSheetId(null);
	};

	return (
		<BottomSheetContext.Provider
			value={{ register, open, close }}
		>
			<View style={styles.container}>
				{children}

				{activeSheetId && (
					<BlurView intensity={50} style={StyleSheet.absoluteFill}>
						<View style={styles.blurOverlay} />
					</BlurView>
				)}

				{bottomSheets.map((sheet) => (
					<BottomSheet
						key={sheet.id}
						enableContentScroll
						isVisible={sheet.isVisible}
						onClose={close}
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
	blurOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
});