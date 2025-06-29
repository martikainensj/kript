import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { BlurIntensity, Duration, FontWeight, IconSize, Spacing } from "../../constants";
import { IconButton } from "../../components/buttons";
import { useTheme } from "../theme/ThemeContext";
import { Action } from "../../constants/types";
import { BlurView } from "../../components/ui/BlurView";

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
	const animation = useRef(new Animated.Value(0)).current;
	const [isExtended, setIsExtended] = useState(false);

	const actionDelay = Duration.normal / actions.length;

	useEffect(() => {
		Animated.spring(animation, {
			toValue: isExtended ? 1 : 0,
			useNativeDriver: true,
		}).start();
	}, [isExtended]);

	return (
		<>
			<Animated.View
				style={[
					styles.background,
					{
						opacity: animation,
						pointerEvents: isExtended ? "auto" : "none"
					}
				]}
			>
				<BlurView
					intensity={BlurIntensity.lg}
					style={StyleSheet.absoluteFill}
				/>
			</Animated.View>

			<View
				style={[
					styles.container,
					{ marginBottom: Spacing.sm },
					side === 'left' && {
						left: Spacing.md,
						right: 'auto',
						alignItems: 'flex-start'
					}
				]}
			>
				{actions.map((action, index) => {
					const reversedIndex = actions.length - 1 - index;

					const actionOpacity = animation.interpolate({
						inputRange: [
							(reversedIndex * actionDelay) / Duration.normal,
							((reversedIndex + 1) * actionDelay) / Duration.normal,
						],
						outputRange: [0, 1],
						extrapolate: 'clamp',
					});

					const translateY = animation.interpolate({
						inputRange: [
							(reversedIndex * actionDelay) / Duration.normal,
							((reversedIndex + 1) * actionDelay) / Duration.normal,
						],
						outputRange: [Spacing.xl, 0],
						extrapolate: 'clamp',
					});

					return (
						<Animated.View
							key={index}
							style={[
								styles.actionsWrapper,
								{
									opacity: actionOpacity,
									transform: [{ translateY }],
									pointerEvents: isExtended ? "auto" : "none"
								}
							]}
						>
							<IconButton
								icon={action.icon}
								onPress={() => {
									action.onPress();
									setIsExtended(false);
								}}
								onLongPress={action.onLongPress}
								size={IconSize.sm}
								label={action.label}
								labelSide={ side === "right" ? "before" : "after"}
							/>
						</Animated.View>
					);
				})}

				<IconButton
					icon={isExtended ? 'close' : icon}
					onPress={() => setIsExtended(!isExtended)}
					size={IconSize.lg}
					label={label}
					onLongPress={onLongPress}
					style={[
						styles.actionButton,
					]}
					labelStyle={[
						{ fontWeight: FontWeight.bold },
					]}
					labelSide={ side === "right" ? "before" : "after"}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	background: {
		...StyleSheet.absoluteFillObject,
	},
	container: {
		position: 'absolute',
		right: Spacing.md,
		bottom: Spacing.md,
		alignItems: 'flex-end',
		zIndex: 1000
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