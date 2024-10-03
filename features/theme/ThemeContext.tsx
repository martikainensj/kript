import { createContext, useContext, useLayoutEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ThemeContext, ThemeProps, ThemeProviderProps } from "./types";
import { DefaultTheme } from "./DefaultTheme";
import { useStorage } from "../storage/useStorage";

const ThemeContext = createContext<ThemeContext>({
	theme: DefaultTheme.light,
	dark: DefaultTheme.light.dark,
	setTheme: () => { },
	setDark: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const { get, set } = useStorage();
	const dark = useColorScheme() === 'dark';

	const [theme, setTheme] = useState<ThemeProps>(DefaultTheme.light);

	const setDark = (dark: boolean) => {
		Appearance.setColorScheme(dark ? 'dark' : 'light');
	}

	useLayoutEffect(() => {
		get('@settings/colorScheme').then(colorScheme => {
			Appearance.setColorScheme(colorScheme);
			setTheme(DefaultTheme[colorScheme]);
		});

		Appearance.addChangeListener(({ colorScheme }) => {
			set("@settings/colorScheme", colorScheme);
		});
	}, []);

	return (
		<ThemeContext.Provider value={{
			theme,
			dark,
			setTheme,
			setDark,
		}}>
			<PaperProvider theme={theme}>
				{children}
			</PaperProvider>
		</ThemeContext.Provider>
	);
}