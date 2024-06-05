import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { MD3DarkTheme, MD3LightTheme, MD3Theme, PaperProvider } from "react-native-paper";
import { useStorage } from "../../hooks/useStorage";
import { Appearance, ColorSchemeName, Platform, useColorScheme } from "react-native";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

export interface ThemeProps extends MD3Theme {
	colors: MD3Theme['colors'] & {
    success: string;
    onSuccess: string;
  };
}

interface ThemeContext {
	theme: ThemeProps;
	sourceColor: string;
	colorScheme: ColorSchemeName;
	defaultSourceColor: string;
	setSourceColor: React.Dispatch<React.SetStateAction<string>>
	setColorScheme: React.Dispatch<React.SetStateAction<ColorSchemeName>>
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
	sourceColor: null,
	colorScheme: 'light',
	defaultSourceColor: null,
	setSourceColor: () => {},
	setColorScheme: () => {},
} );

export const useTheme = () => useContext( ThemeContext );

interface ThemeProviderProps {
	children: React.ReactNode,
	sourceColor?: string
	fallbackSourceColor?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ( { children, sourceColor, fallbackSourceColor = '#66B2FF' } ) => {
	const defaultSourceColor = fallbackSourceColor;
	const [ theme, setTheme ] = useState<ThemeProps>();
	const [ _sourceColor, _setSourceColor ] = useState( null );
	const { theme: materialTheme, updateTheme, resetTheme } = useMaterial3Theme( { sourceColor, fallbackSourceColor } );
	
	const { getData, setData } = useStorage();
	const colorScheme = useColorScheme();

	const setSourceColor = ( sourceColor?: string, skipStorage = false ) => {
		if ( sourceColor ) {
			updateTheme( sourceColor );
		} else {
			resetTheme();
		}
		
		_setSourceColor( sourceColor );
		
		if ( ! skipStorage ) {
			setData( '@settings/sourceColor', sourceColor );
		}
	}

	const setColorScheme = ( colorScheme: ColorSchemeName, skipStorage = false ) => {
		Appearance.setColorScheme( colorScheme );

		if ( ! skipStorage ) {
			setData( '@settings/colorScheme', colorScheme );
		}
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
		getData( '@settings/colorScheme' ).then( colorScheme => {
			setColorScheme( colorScheme, true );
		} );

		Platform.OS === 'android' && (
			getData( '@settings/sourceColor' ).then( sourceColor => {
				setSourceColor( sourceColor, true );
			} )
		)
	}, [] );

  return (
    <ThemeContext.Provider value={ {
			theme,
			sourceColor: _sourceColor,
			colorScheme,
			defaultSourceColor,
			setSourceColor,
			setColorScheme,
		} }>
			<PaperProvider theme={ theme }>
				{ children }
			</PaperProvider>
    </ThemeContext.Provider>
  );
}