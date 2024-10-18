import React, { useState, useEffect, useRef } from "react";
import { Action } from "./types";
import { Animated, StyleSheet, View } from "react-native";
import { Duration, IconSize, Spacing } from "../../constants";
import { IconButton } from "../../components/buttons";
import { useTheme } from "../theme/ThemeContext";

interface Props extends Action {
	actions?: Action[];
}

export const FABActions: React.FC<Props> = ({
	label,
	icon = 'ellipsis-vertical',
	actions = [],
	onPress,
	onLongPress,
}) => {
	const [isExtended, setIsExtended] = useState(false);
	const { theme } = useTheme();
	const animations = actions.map(() => useRef(new Animated.Value(0)).current);

	useEffect(() => {
		if (isExtended) {
			actions.forEach((_, index) => {
				Animated.spring(animations[index], {
					toValue: 1,
					delay: 50 * index,
					useNativeDriver: true,
				}).start();
			});
		} else {
			actions.forEach((_, index) => {
				Animated.spring(animations[index], {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			});
		}
	}, [isExtended]);

	return (<>
			<Animated.View
				style={[
					styles.backgroundOverlay,
					isExtended && {
						backgroundColor: `${theme.colors.background}ee`,
						pointerEvents: 'auto'
					},
				]}
			/>

			{/* Main action buttons container */}
			<View style={styles.buttonsContainer} pointerEvents="auto">
				{/* Render action buttons */}
				{actions.map((action, index) => (
					<Animated.View
						key={index}
						style={[
							styles.actionsWrapper,
							{
								opacity: animations[index], // Animate opacity
								transform: [
									{
										translateY: animations[index].interpolate({
											inputRange: [0, 1],
											outputRange: [20, 0], // Slide up from below
										}),
									},
								],
							},
						]}
					>
						<IconButton
							icon={action.icon}
							onPress={action.onPress}
							onLongPress={action.onLongPress}
							size={IconSize.md}
						/>
					</Animated.View>
				))}

				{/* Main FAB button */}
				<IconButton
					icon={icon}
					onPress={() => setIsExtended(!isExtended)}
					size={IconSize.xl}
					onLongPress={onLongPress}
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		top: 'auto',
		left: 'auto',
		right: Spacing.md,
		bottom: Spacing.md,
		alignItems: 'flex-end',
		justifyContent: 'flex-end'
	},
	backgroundOverlay: {
		...StyleSheet.absoluteFillObject,
		pointerEvents: 'none'
	},
	buttonsContainer: {
	},
	actionsWrapper: {
		marginBottom: 15,
	},
});