import { StyleSheet, Platform, StatusBar } from "react-native";
import { Spacing } from "./variables";
import { FontFamily, FontSize, FontWeight } from "./font";

export const GlobalStyles = StyleSheet.create({
	androidSafeArea: {
    paddingTop: Platform.OS === "android"
			? StatusBar.currentHeight
			: 0
  },
	container: {
		flex: 1,
	},
	gutter: {
		paddingHorizontal: Spacing.md
	},
	title: {
		fontSize: FontSize.md,
		fontWeight: FontWeight.regular,
		fontFamily: FontFamily.regular,
	},
	label: {
		fontSize: FontSize.xs,
		fontWeight: FontWeight.bold,
		fontFamily: FontFamily.bold,
	},
	lead: {
		fontSize: FontSize.md,
		fontWeight: FontWeight.regular,
		fontFamily: FontFamily.regular,
	},
	paragraph: {
		fontSize: FontSize.sm,
		fontWeight: FontWeight.regular,
		fontFamily: FontFamily.regular,
	},
	headerRightContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	bold: {
		fontWeight: FontWeight.bold,
		fontFamily: FontFamily.bold,
	},
	regular: {
		fontWeight: FontWeight.regular,
		fontFamily: FontFamily.regular,
	},
	light: {
		fontWeight: FontWeight.light,
		fontFamily: FontFamily.light,
	},
	form: {
		gap: Spacing.sm,
		paddingTop: Spacing.md
	}
})