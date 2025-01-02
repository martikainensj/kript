import { Animated, StyleSheet, TextProps } from "react-native";
import { useTheme } from "../../features/theme/ThemeContext";
import { FontFamily, FontSize, FontWeight, FontWeightKey, TextAlignKey } from "../../constants";

interface Props extends Animated.AnimatedProps<TextProps> {
	children: string | number;
	fontSize?: keyof typeof FontSize;
	fontWeight?: FontWeightKey;
	textAlign?: TextAlignKey;
}

export const Text: React.FC<Props> = ({
	children,
	fontSize = 'sm',
	fontWeight = 'regular',
	textAlign = 'left',
	...rest
}) => {
	const { theme } = useTheme();

	return (
		<Animated.Text
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
				rest.style
			]}
		>
			{children}
		</Animated.Text>
	)
}

const styles = StyleSheet.create({
	container: {
		
	}
})