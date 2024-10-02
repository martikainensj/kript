import { ColorSchemeName } from "react-native";
import { MD3Theme } from "react-native-paper";

export interface ThemeProps extends MD3Theme {
	colors: MD3Theme['colors'] & {
		success: string;
		onSuccess: string;
		successContainer: string;
		onSuccessContainer: string;
	};
}

export interface ThemeContext {
	theme: ThemeProps;
	dark: ThemeProps['dark'];
	setTheme: React.Dispatch<React.SetStateAction<ThemeContext['theme']>>
	setDark: React.Dispatch<React.SetStateAction<ThemeContext['dark']>>
}

export interface ThemeProviderProps {
	children: React.ReactNode
}
