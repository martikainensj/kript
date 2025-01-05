import { StyleSheet } from "react-native";
import { Spacing } from "./variables";

export const GlobalStyles = StyleSheet.create({
	container: {
		flexGrow: 1,
		flexShrink: 1
	},
	content: {
		paddingVertical: Spacing.md,
		gap: Spacing.md
	},
	slice: {
		paddingHorizontal: Spacing.md,
		gap: Spacing.sm
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
	}
})