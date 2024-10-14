import { Text as RNText, StyleProp, StyleSheet, TextProps, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "../../features/theme/ThemeContext";
import { FontFamily, FontSize, FontWeight, FontWeightKey, TextAlignKey } from "../../constants";

interface Props extends TextProps {
	children: string | number;
	fontSize?: keyof typeof FontSize;
	fontWeight?: FontWeightKey;
	textAlign?: TextAlignKey;
	style?: StyleProp<TextStyle>;
}

export const Text: React.FC<Props> = ({
	children,
	fontSize = 'sm',
	fontWeight = 'regular',
	textAlign = 'left',
	style,
	...rest
}) => {
	const { theme } = useTheme();

	return (
		<RNText
			{ ...rest }
			style={[
				styles.container,
				{
					fontSize: FontSize[fontSize],
					fontFamily: FontFamily[fontWeight],
					fontWeight: FontWeight[fontWeight],
					color: theme.colors.onBackground,
					textAlign,
				},
				style
			]}
		>
			{children}
		</RNText>
	)
}

const styles = StyleSheet.create({
	container: {
	}
})