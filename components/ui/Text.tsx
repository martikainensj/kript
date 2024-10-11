import { Text as RNText, StyleProp, StyleSheet, TextProps, TextStyle, View, ViewStyle } from "react-native";
import { useTheme } from "../../features/theme/ThemeContext";
import { FontFamily, FontWeight, FontWeightKey } from "../../constants";

interface Props extends TextProps {
	children: string | number;
	fontWeight?: FontWeightKey;
	style?: StyleProp<TextStyle>;
}

export const Text: React.FC<Props> = ({
	children,
	fontWeight = 'regular',
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
					fontFamily: FontFamily[fontWeight],
					fontWeight: FontWeight[fontWeight],
					color: theme.colors.onBackground
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