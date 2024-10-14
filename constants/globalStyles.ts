import { StyleSheet, Platform, StatusBar } from "react-native";
import { Spacing } from "./variables";
import { FontFamily, FontSize, FontWeight } from "./font";

export const GlobalStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
	gutter: {
		paddingHorizontal: Spacing.md
	},
	button: {
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
	},
	disabled: {
		opacity: 0.5,
		pointerEvents: 'none'
	},
	headerRightContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	form: {
		gap: Spacing.sm,
		paddingTop: Spacing.md
	}
})