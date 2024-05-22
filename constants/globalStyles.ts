import { StyleSheet, Platform, StatusBar } from "react-native";
import { Spacing } from "./variables";
import { FontSize, FontWeight } from "./font";
import { Color } from "./colors";
import { Theme } from "./theme";

export const GlobalStyles = StyleSheet.create({
	androidSafeArea: {
    paddingTop: Platform.OS === "android"
			? StatusBar.currentHeight
			: 0
  },
	container: {
		flex: 1
	},
	footer: {
		backgroundColor: Theme.colors.background,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderColor: Theme.colors.outlineVariant
	},
	gutter: {
		paddingHorizontal: Spacing.md
	},
	shadow: {
		elevation: 1,
		shadowColor: Theme.colors.shadow,
		shadowRadius: Spacing.sm,
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.1,
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
	isColorPositive: {
		color: Theme.colors.tertiary,
		fontWeight: FontWeight.bold
	},
	isColorNegative: {
		color: Theme.colors.error,
		fontWeight: FontWeight.bold
	},
	isBold: {
		fontWeight: FontWeight.bold
	},
	form: {
		gap: Spacing.sm,
		paddingVertical: Spacing.md
	}
})