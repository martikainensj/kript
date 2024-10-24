import { createContext, useContext, useLayoutEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { ThemeContextProps, ThemeProps, ThemeProviderProps } from "./types";
import { DefaultTheme } from "./DefaultTheme";
import { useStorage } from "../storage/useStorage";

const ThemeContext = createContext<ThemeContextProps>({
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
		get('@settings/dark').then(dark => {
			Appearance.setColorScheme(dark ? 'dark' : 'light');
			setTheme(DefaultTheme[(dark ? 'dark' : 'light')]);
		});

		Appearance.addChangeListener(({ colorScheme }) => {
			set("@settings/dark", colorScheme === 'dark');
			setTheme(DefaultTheme[colorScheme]);
		});
	}, []);

	return (
		<ThemeContext.Provider value={{
			theme,
			dark,
			setTheme,
			setDark,
		}}>
			{children}
		</ThemeContext.Provider>
	);
}