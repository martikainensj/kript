import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Duration, FontWeight, IconSize, Spacing } from "../../constants";
import { IconButton } from "../../components/buttons";
import { useTheme } from "../theme/ThemeContext";
import { Action } from "../../constants/types";
import { BlurView } from "expo-blur";

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
				isExtended && { pointerEvents: 'auto' },
				{	opacity: animation }
			]}
			pointerEvents="none"
		>
			<BlurView intensity={40} style={StyleSheet.absoluteFill} />
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
								transform: [{ translateY }]
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
					side === 'left' && {
						left: '100%',
						right: 'auto',
						paddingRight: 0,
						paddingLeft: Spacing.md,
						textAlign: 'left',
					}
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