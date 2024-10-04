import { MD3Theme } from "react-native-paper";

export interface ThemeProps extends MD3Theme {
	colors: MD3Theme['colors'] & {
		success: string;
		onSuccess: string;
		successContainer: string;
		onSuccessContainer: string;
	};
}

export interface ThemeContextProps {
	theme: ThemeProps;
	dark: ThemeProps['dark'];
	setTheme: React.Dispatch<React.SetStateAction<ThemeContextProps['theme']>>
	setDark: React.Dispatch<React.SetStateAction<ThemeContextProps['dark']>>
}

export interface ThemeProviderProps {
	children: React.ReactNode
}
