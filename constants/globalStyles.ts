import { StyleSheet, Platform, StatusBar } from "react-native";
import { Spacing } from "./variables";
import { FontSize, FontWeight } from "./font";

export const GlobalStyles = StyleSheet.create({
	androidSafeArea: {
    paddingTop: Platform.OS === "android"
			? StatusBar.currentHeight
			: 0
  },
	container: {
		flex: 1
	},
	gutter: {
		paddingHorizontal: Spacing.md
	},
	title: {
		fontSize: FontSize.lg,
		fontWeight: FontWeight.regular
	},
	label: {
		fontSize: FontSize.xs,
		fontWeight: FontWeight.bold
	},
	headerRightContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	isBold: {
		fontWeight: FontWeight.bold
	},
	form: {
		gap: Spacing.sm,
		paddingTop: Spacing.md
	}
})