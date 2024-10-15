import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import { Text } from "../../components/ui/Text";
import { useTheme } from "../theme/ThemeContext";
import { BorderRadius, Duration, IconSize, Spacing } from "../../constants";

interface Props extends BottomTabBarProps {

}

export const TabBar: React.FC<Props> = ({ descriptors, insets, navigation, state }) => {
	const { theme } = useTheme();

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.background,
					borderTopColor: theme.colors.outlineVariant
				}
			]}
		>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const label = options.tabBarLabel || options.title || route.name;
				const isFocused = state.index === index;

				const onPress = () => {
					navigation.navigate(route.name, route.params);
				};

				const focusAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

				useEffect(() => {
					Animated.timing(focusAnim, {
						toValue: isFocused ? 1 : 0,
						duration: Duration.fast,
						useNativeDriver: true,
					}).start();
				}, [isFocused]);

				const focusedColor = theme.colors.primary;
				const iconColor = theme.colors.secondary;
				const translateY = focusAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [
						Spacing.sm,
						0
					]
				});
				const backgroundColor = focusAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [
						theme.colors.background,
						theme.colors.secondaryContainer
					]
				});

				return (
					<TouchableOpacity
						key={index}
						onPress={onPress}
						style={[
							styles.itemContainer,
							{
								marginBottom: insets.bottom
							}
						]}
						disabled={isFocused}
					>
						<Animated.View
							style={[
								styles.itemIconContainer,
								{
									transform: [{	translateY }],
									backgroundColor
								}
							]}
						>
							{options.tabBarIcon({
								focused: isFocused,
								color: isFocused ? focusedColor : iconColor,
								size: IconSize.md
							})}
						</Animated.View>

						<Animated.View
							style={[
								styles.itemLabelContainer,
								{ opacity: focusAnim }
							]}
						>
							<Text
								numberOfLines={1}
								fontSize="sm"
								style={{
									color: theme.colors.onBackground
								}}
							>
								{label.toString()}
							</Text>
						</Animated.View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderTopWidth: StyleSheet.hairlineWidth
	},
	itemContainer: {
		position: 'relative',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: Spacing.md,
		paddingVertical: Spacing.sm,
	},
	itemIconContainer: {
		paddingHorizontal: Spacing.lg,
		paddingVertical: Spacing.sm,
		borderRadius: BorderRadius.xl
	},
	itemLabelContainer: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		bottom: 'auto',
		paddingTop: Spacing.sm,
		alignItems: 'center',
	}
})