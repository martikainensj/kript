import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { ThemeProps } from "./types";

export const DefaultTheme = {
	dark: {
		...MD3DarkTheme,
		colors: {
			"primary": "rgb(157, 202, 255)",
			"onPrimary": "rgb(0, 50, 87)",
			"primaryContainer": "rgb(0, 73, 124)",
			"onPrimaryContainer": "rgb(209, 228, 255)",
			"secondary": "rgb(186, 200, 219)",
			"onSecondary": "rgb(37, 49, 64)",
			"secondaryContainer": "rgb(59, 72, 88)",
			"onSecondaryContainer": "rgb(214, 228, 247)",
			"tertiary": "rgb(214, 190, 229)",
			"onTertiary": "rgb(58, 41, 72)",
			"tertiaryContainer": "rgb(82, 64, 96)",
			"onTertiaryContainer": "rgb(242, 218, 255)",
			"error": "rgb(255, 180, 171)",
			"onError": "rgb(105, 0, 5)",
			"errorContainer": "rgb(147, 0, 10)",
			"onErrorContainer": "rgb(255, 180, 171)",
			"background": "rgb(26, 28, 30)",
			"onBackground": "rgb(226, 226, 230)",
			"surface": "rgb(26, 28, 30)",
			"onSurface": "rgb(226, 226, 230)",
			"surfaceVariant": "rgb(66, 71, 78)",
			"onSurfaceVariant": "rgb(195, 199, 207)",
			"outline": "rgb(141, 145, 153)",
			"outlineVariant": "rgb(66, 71, 78)",
			"shadow": "rgb(0, 0, 0)",
			"scrim": "rgb(0, 0, 0)",
			"inverseSurface": "rgb(226, 226, 230)",
			"inverseOnSurface": "rgb(47, 48, 51)",
			"inversePrimary": "rgb(0, 97, 162)",
			"elevation": {
				"level0": "transparent",
				"level1": "rgb(33, 37, 41)",
				"level2": "rgb(37, 42, 48)",
				"level3": "rgb(40, 47, 55)",
				"level4": "rgb(42, 49, 57)",
				"level5": "rgb(44, 52, 62)"
			},
			"surfaceDisabled": "rgba(226, 226, 230, 0.12)",
			"onSurfaceDisabled": "rgba(226, 226, 230, 0.38)",
			"backdrop": "rgba(44, 49, 55, 0.4)",
			"success": "rgb(136, 217, 144)",
			"onSuccess": "rgb(0, 57, 19)",
			"successContainer": "rgb(0, 83, 30)",
			"onSuccessContainer": "rgb(164, 245, 170)"
		}
	} as ThemeProps,
	light: {
		...MD3LightTheme,
		colors: {
			"primary": "rgb(0, 97, 162)",
			"onPrimary": "rgb(255, 255, 255)",
			"primaryContainer": "rgb(209, 228, 255)",
			"onPrimaryContainer": "rgb(0, 29, 53)",
			"secondary": "rgb(83, 95, 112)",
			"onSecondary": "rgb(255, 255, 255)",
			"secondaryContainer": "rgb(214, 228, 247)",
			"onSecondaryContainer": "rgb(15, 28, 43)",
			"tertiary": "rgb(106, 87, 120)",
			"onTertiary": "rgb(255, 255, 255)",
			"tertiaryContainer": "rgb(242, 218, 255)",
			"onTertiaryContainer": "rgb(37, 20, 50)",
			"error": "rgb(186, 26, 26)",
			"onError": "rgb(255, 255, 255)",
			"errorContainer": "rgb(255, 218, 214)",
			"onErrorContainer": "rgb(65, 0, 2)",
			"background": "rgb(253, 252, 255)",
			"onBackground": "rgb(26, 28, 30)",
			"surface": "rgb(253, 252, 255)",
			"onSurface": "rgb(26, 28, 30)",
			"surfaceVariant": "rgb(223, 226, 235)",
			"onSurfaceVariant": "rgb(66, 71, 78)",
			"outline": "rgb(115, 119, 127)",
			"outlineVariant": "rgb(195, 199, 207)",
			"shadow": "rgb(0, 0, 0)",
			"scrim": "rgb(0, 0, 0)",
			"inverseSurface": "rgb(47, 48, 51)",
			"inverseOnSurface": "rgb(241, 240, 244)",
			"inversePrimary": "rgb(157, 202, 255)",
			"elevation": {
				"level0": "transparent",
				"level1": "rgb(240, 244, 250)",
				"level2": "rgb(233, 240, 248)",
				"level3": "rgb(225, 235, 245)",
				"level4": "rgb(223, 233, 244)",
				"level5": "rgb(218, 230, 242)"
			},
			"surfaceDisabled": "rgba(26, 28, 30, 0.12)",
			"onSurfaceDisabled": "rgba(26, 28, 30, 0.38)",
			"backdrop": "rgba(44, 49, 55, 0.4)",
			"success": "rgb(27, 108, 49)",
			"onSuccess": "rgb(255, 255, 255)",
			"successContainer": "rgb(164, 245, 170)",
			"onSuccessContainer": "rgb(0, 33, 8)"
		}
	} as ThemeProps
}