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
						theme.colors.surfaceVariant
					]
				});

				useEffect(() => {
					Animated.timing(focusAnim, {
						toValue: isFocused ? 1 : 0,
						duration: Duration.fast,
						useNativeDriver: true,
					}).start();
				}, [isFocused]);

				return (
					<TouchableOpacity
						key={index}
						onPress={onPress}
						style={[
							styles.itemContainer,
							{
								marginTop: Spacing.md,
								marginBottom: insets.bottom + Spacing.md
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
								color: isFocused
									? theme.colors.primary
									: theme.colors.secondary,
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
								fontSize="xs"
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
	},
	itemIconContainer: {
		paddingHorizontal: Spacing.lg,
		height: Spacing.xl,
		borderRadius: BorderRadius.xl,
		alignItems: 'center',
		justifyContent: 'center',
	},
	itemLabelContainer: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		bottom: 'auto',
		paddingTop: Spacing.xs,
		alignItems: 'center',
	}
})