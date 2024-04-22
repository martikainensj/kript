import { StyleSheet, Platform, StatusBar } from "react-native";
import { Spacing } from "./variables";
import { FontSize, FontWeight } from "./font";
import { Color } from "./colors";

export const GlobalStyles = StyleSheet.create({
	androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
	container: {
		flex: 1
	},
	title: {
		fontSize: FontSize.md,
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
	isColorPositive: {
		color: Color.success,
		fontWeight: FontWeight.bold
	},
	isColorNegative: {
		color: Color.failure,
		fontWeight: FontWeight.bold
	},
	isBold: {
		fontWeight: FontWeight.bold
	},
	gutter: {
		paddingHorizontal: Spacing.lg
	},
	form: {
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	}
})