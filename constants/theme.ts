import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Color } from './colors';

export const Theme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		success: Color.success,
		onSuccess: MD3DarkTheme.colors.onPrimary
	}
}