import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme, MD3Theme, PaperProvider } from "react-native-paper";
import { useStorage } from "../../hooks";
import { Appearance, ColorSchemeName, useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

interface ThemeProps extends MD3Theme {
	colors: MD3Theme['colors'] & {
    success: string;
    onSuccess: string;
  };
}

interface ThemeContext {
	theme: ThemeProps;
	setSourceColor: React.Dispatch<React.SetStateAction<string>>
	setColorMode: React.Dispatch<React.SetStateAction<ColorSchemeName>>
}

const ThemeContext = createContext<ThemeContext>( {
	theme: {
		...MD3LightTheme,
		colors: {
			...MD3LightTheme.colors,
			success: '#66A077',
			onSuccess: MD3LightTheme.colors.onPrimary
		}
	} as ThemeProps,
	setSourceColor: () => {},
	setColorMode: () => {},
} );

export const useTheme = () => useContext( ThemeContext );

interface ThemeProviderProps {
	children: React.ReactNode,
	sourceColor?: string
	fallbackSourceColor?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ( { children, sourceColor, fallbackSourceColor = '#4963C1' } ) => {
	const [ theme, setTheme ] = useState<ThemeProps>();
	const { theme: materialTheme, updateTheme } = useMaterial3Theme( { sourceColor, fallbackSourceColor } );
	
	const { getData, setData } = useStorage();
	const colorScheme = useColorScheme();

	const setSourceColor = ( sourceColor: string ) => {
		updateTheme( sourceColor );
	}

	const setColorMode = ( colorMode: ColorSchemeName ) => {
		setData( '@settings/colorMode', colorMode );
		Appearance.setColorScheme( colorMode );
	}

	useEffect( () => {
		setTheme( colorScheme === 'dark' ? {
			...MD3DarkTheme,
			colors: {
				...materialTheme.dark,
				success: '#66a077',
				onSuccess: materialTheme.dark.onPrimary
			}
		} : {
			...MD3LightTheme,
			colors: {
				...materialTheme.light,
				success: '#66a077',
				onSuccess: materialTheme.light.onPrimary
			}
		} );
	}, [ colorScheme, materialTheme ] );

	useLayoutEffect( () => {
		getData( '@settings/colorMode' ).then( colorMode => {
			Appearance.setColorScheme( colorMode );
		});
	}, [ getData ] );

  return (
    <ThemeContext.Provider value={ {
			theme,
			setSourceColor,
			setColorMode
		} }>
			<PaperProvider theme={ theme }>
				{ children }
			</PaperProvider>
    </ThemeContext.Provider>
  );
}