import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { MD3Theme, PaperProvider } from "react-native-paper";
import { useStorage } from "../hooks/useStorage";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import themes from "../themes";

export interface ThemeProps extends MD3Theme {
	colors: MD3Theme['colors'] & {
		success: string;
		onSuccess: string;
		successContainer: string;
		onSuccessContainer: string;
	};
}
interface ThemeContext {
	theme: ThemeProps;
	selectedTheme: keyof typeof themes;
	colorScheme: ColorSchemeName;
	setTheme: React.Dispatch<React.SetStateAction<ThemeContext['theme']>>
	setSelectedTheme: React.Dispatch<React.SetStateAction<ThemeContext['selectedTheme']>>
	setColorScheme: React.Dispatch<React.SetStateAction<ThemeContext['colorScheme']>>
}

const ThemeContext = createContext<ThemeContext>({
	theme: themes.base.light,
	selectedTheme: 'base',
	colorScheme: 'light',
	setTheme: () => { },
	setSelectedTheme: () => { },
	setColorScheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
	children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const { getData, setData } = useStorage();
	const colorScheme = useColorScheme();

	const [theme, setTheme] = useState<ThemeProps>(themes.base.light);
	const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('base');

	const setColorScheme = (colorScheme: ColorSchemeName) => {
		Appearance.setColorScheme(colorScheme);;
	}

	useEffect(() => {
		getData('@settings/selectedTheme').then(storageSelectedTheme => {
			if (storageSelectedTheme !== selectedTheme) {
				setData('@settings/selectedTheme', selectedTheme);
			}
		});

		setTheme(themes[selectedTheme][colorScheme]);
	}, [selectedTheme, themes]);

	useLayoutEffect(() => {
		getData('@settings/selectedTheme').then(selectedTheme => {
			setSelectedTheme(selectedTheme ?? 'base');
		})

		getData('@settings/colorScheme').then(colorScheme => {
			Appearance.setColorScheme(colorScheme);
			setTheme(themes[selectedTheme][colorScheme]);
		});

		Appearance.addChangeListener(({ colorScheme }) => {
			setData("@settings/colorScheme", colorScheme);

			getData("@settings/selectedTheme").then( selectedTheme => {
				setTheme(themes[selectedTheme ?? 'base'][colorScheme]);
			})
		});
	}, []);

	return (
		<ThemeContext.Provider value={{
			theme,
			selectedTheme,
			colorScheme,
			setTheme,
			setSelectedTheme,
			setColorScheme,
		}}>
			<PaperProvider theme={theme}>
				{children}
			</PaperProvider>
		</ThemeContext.Provider>
	);
}