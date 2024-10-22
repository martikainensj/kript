import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Duration, IconSize, Spacing } from "../../constants";
import { IconButton } from "../../components/buttons";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../components/ui/Icon";
import { Action } from "../../constants/types";

interface Props extends Action {
	actions?: Action[];
	side?: 'left' | 'right';
}

export const FABActions: React.FC<Props> = ({
	label,
	icon = 'ellipsis-vertical',
	actions = [],
	side = 'right',
	onPress,
	onLongPress,
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const animations = actions.map(() => useRef(new Animated.Value(0)).current);
	const lastAnimation = animations[animations.length - 1];
	const [isExtended, setIsExtended] = useState(false);
	const [shouldRenderActions, setShouldRenderActions] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isExtended) {
			setShouldRenderActions(true);
			setIsAnimating(true);

			actions.forEach((_, index) => {
				const delay = Duration.normal / actions.length * (actions.length -1 - index);

				Animated.spring(animations[index], {
					toValue: 1,
					delay,
					useNativeDriver: true,
				}).start(() => {
					if (index === actions.length - 1) {
						setIsAnimating(false);
					}
				});
			});
		} else {
			setIsAnimating(true);

			actions.forEach((_, index) => {
				Animated.spring(animations[index], {
					toValue: 0,
					useNativeDriver: true,
				}).start(() => {
					// Check if it's the last animation
					if (index === actions.length - 1) {
						const timeout = setTimeout(() => {
							setShouldRenderActions(false); // Hide actions after animations
							setIsAnimating(false); // Animation ends
						}, Duration.normal);
						return () => clearTimeout(timeout);
					}
				});
			});
		}
	}, [isExtended]);

	return (
		<>
			<Animated.View
				style={[
					styles.background,
					isExtended && {
						backgroundColor: `${theme.colors.background}ee`,
						pointerEvents: 'auto'
					},
					{ opacity: lastAnimation }
				]}
				pointerEvents="none"
			/>

			<View
				style={[
					styles.container,
					{ marginBottom: insets.bottom },
					side === 'left' && {
						left: Spacing.md,
						right: 'auto',
						alignItems: 'flex-start'
					}
				]}
			>
				{shouldRenderActions && actions.map((action, index) => (
					<Animated.View
						key={index}
						style={[
							styles.actionsWrapper,
							{
								opacity: animations[index],
								transform: [
									{
										translateY: animations[index].interpolate({
											inputRange: [0, 1],
											outputRange: [20, 0],
										})
									},
								],
							},
						]}
					>
						<IconButton
							icon={action.icon}
							onPress={action.onPress}
							onLongPress={action.onLongPress}
							size={IconSize.sm}
							label={action.label}
							labelStyle={[
								side === 'left' && {
									left: '100%',
									right: 'auto',
									paddingRight: 0,
									paddingLeft: Spacing.md,
									textAlign: 'left',
								}
							]}
						/>
					</Animated.View>
				))}

				<IconButton
					icon={isExtended ? 'close' : icon}
					onPress={() => setIsExtended(!isExtended)}
					size={IconSize.lg}
					onLongPress={onLongPress}
					disabled={isAnimating}
					style={[
						styles.actionButton,
					]}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	background: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: 'none',
	},
	container: {
		position: 'absolute',
		right: Spacing.md,
		bottom: Spacing.md,
		alignItems: 'flex-end',
	},
	actionsWrapper: {
		marginBottom: 15,
	},
	actionButton: {
		height: 56
	},
	actionsButton: {
		padding: Spacing.xs
	}
});