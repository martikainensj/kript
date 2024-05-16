import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Color } from './colors';

export const Theme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		success: Color.success,
		onSuccess: MD3LightTheme.colors.onPrimary
	}
}