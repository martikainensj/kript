import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Duration, FontWeight, IconSize, Spacing } from "../../constants";
import { IconButton } from "../../components/buttons";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
	const animation = useRef(new Animated.Value(0)).current;
	const [isExtended, setIsExtended] = useState(false);
	const [shouldRenderActions, setShouldRenderActions] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const actionDelay = Duration.normal / actions.length;

	useEffect(() => {
		setIsAnimating(true);
		
		if (isExtended) {
			setShouldRenderActions(true);
		}

		Animated.spring(animation, {
			toValue: isExtended ? 1 : 0,
			useNativeDriver: true,
		}).start(() => {
			setIsAnimating(false);

			if (!isExtended) {
				setShouldRenderActions(false);
			}
		});
	}, [isExtended]);

return (
	<>
		<Animated.View
			style={[
				styles.background,
				shouldRenderActions && {
					backgroundColor: `${theme.colors.background}ee`,
					pointerEvents: 'auto'
				},
				{ opacity: animation }
			]}
			pointerEvents="none"
		/>

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
			{shouldRenderActions && actions.map((action, index) => {
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
							disabled={isAnimating}
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
				disabled={isAnimating}
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