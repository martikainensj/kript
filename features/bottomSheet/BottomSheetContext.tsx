import React, { createContext, useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { BlurView } from "expo-blur";

// Define the interface for the context
interface BottomSheetContextType {
  addBottomSheet: (component: React.ReactNode) => string;
  openBottomSheet: (id: string) => void;
  closeBottomSheet: () => void;
}

// Define the type for each bottom sheet entry
interface BottomSheetEntry {
  id: string;
  component: React.ReactNode;
  isVisible: boolean;
}

// Create the context with the defined type
const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

// Custom hook to use the BottomSheetContext
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

	console.log(bottomSheets.length)
  // Add a new bottom sheet and return its ID
  const addBottomSheet = (component: React.ReactNode) => {
    const id = Math.random().toString(36).substr(2, 9); // Generate a unique ID
    setBottomSheets((prev) => [...prev, { id, component, isVisible: false }]);
    return id;
  };

  // Open a bottom sheet by its ID
  const openBottomSheet = (id: string) => {
    setBottomSheets((prev) =>
      prev.map((sheet) => ({
        ...sheet,
        isVisible: sheet.id === id,
      }))
    );
    setActiveSheetId(id);
  };

  // Close the currently active bottom sheet
  const closeBottomSheet = () => {
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
      value={{ addBottomSheet, openBottomSheet, closeBottomSheet }}
    >
      <View style={styles.container}>
        {children}

        {/* Render the BlurView when a bottom sheet is open */}
        {activeSheetId && (
          <BlurView intensity={50} style={StyleSheet.absoluteFill}>
            <View style={styles.blurOverlay} />
          </BlurView>
        )}

        {/* Render all bottom sheets with visibility control */}
        {bottomSheets.map((sheet) => (
          <BottomSheet
            key={sheet.id}
            enableContentScroll
            isVisible={sheet.isVisible}
            onClose={closeBottomSheet}
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