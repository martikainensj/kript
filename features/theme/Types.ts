export interface ThemeProps {
	dark: boolean;
	colors: {
		primary: string;
		onPrimary: string;
		primaryContainer: string;
		onPrimaryContainer: string;
		secondary: string;
		onSecondary: string;
		secondaryContainer: string;
		onSecondaryContainer: string;
		tertiary: string;
		onTertiary: string;
		tertiaryContainer: string;
		onTertiaryContainer: string;
		error: string;
		onError: string;
		errorContainer: string;
		onErrorContainer: string;
		background: string;
		onBackground: string;
		surface: string;
		onSurface: string;
		surfaceVariant: string;
		onSurfaceVariant: string;
		outline: string;
		outlineVariant: string;
		backdrop: string;
		success: string;
		onSuccess: string;
		successContainer: string;
		onSuccessContainer: string;
	}
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
