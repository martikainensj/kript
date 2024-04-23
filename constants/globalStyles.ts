import { StyleSheet, Platform, StatusBar } from "react-native";
import { Spacing } from "./variables";
import { FontSize, FontWeight } from "./font";
import { Color } from "./colors";
import { Theme } from "./theme";

export const GlobalStyles = StyleSheet.create({
	androidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
	container: {
		flex: 1
	},
	gutter: {
		paddingHorizontal: Spacing.md
	},
	shadow: Platform.OS === 'ios' ? {
		shadowRadius: Spacing.sm,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.1,
	} : { elevation: 1 },
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
	form: {
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	}
})