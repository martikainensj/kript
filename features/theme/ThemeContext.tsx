import { createContext, useContext } from "react";
import { ThemeContext, ThemeProviderProps } from "./Types";
import { DefaultTheme } from "./DefaultTheme";

const ThemeContext = createContext<ThemeContext>({
	theme: DefaultTheme.light,
	dark: DefaultTheme.light.dark,
	setTheme: () => { },
	setDark: () => { },
});

export const useTheme = () => useContext(ThemeContext);

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