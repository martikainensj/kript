import React, { useRef, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Animated, View } from 'react-native';
import { BorderRadius, Duration, IconSize, Spacing } from '../../constants';
import { Icon } from '../ui/Icon';
import { useTheme } from '../../features/theme/ThemeContext';
import { Text } from '../ui/Text';

interface IconButtonProps extends TouchableOpacityProps {
	icon: React.ComponentProps<typeof Ionicons>['name'];
	size?: number;
	label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
	icon,
	size = IconSize.md,
	label,
	...rest
}) => {
	const { theme } = useTheme();
	const [iconQueue, setIconQueue] = useState([icon]);
	const [isAnimating, setIsAnimating] = useState(false);
	const [isRotated, setIsRotated] = useState(false);

	const fadeAnimOut = useRef(new Animated.Value(1)).current;
	const fadeAnimIn = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (iconQueue[0] === icon || isAnimating) return;

		setIconQueue((prevQueue) => [...prevQueue, icon]);
	}, [icon]);

	useEffect(() => {
		if (
			iconQueue.length < 2 ||
			isAnimating
		) {
			return;
		}

		fadeAnimIn.setValue(0);
		setIsAnimating(true);

		Animated.parallel([
			Animated.timing(fadeAnimOut, {
				toValue: 0,
				duration: Duration.fast,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnimIn, {
				toValue: 1,
				duration: Duration.fast,
				useNativeDriver: true,
			}),
		]).start(() => {
			setIconQueue((prevQueue) => prevQueue.slice(1)); 
			fadeAnimOut.setValue(1);
			setIsAnimating(false);
			setIsRotated(!isRotated);
		});
	}, [iconQueue]);
	
	const rotate = fadeAnimIn.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg']
	});

	return (
		<TouchableOpacity
			{...rest}
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.surfaceVariant,
					height: size + 24,
					aspectRatio: 1,
				},
				rest.style,
			]}
		>
			{label && (
				<Text
					numberOfLines={1}
					fontSize="md"
					style={styles.label}
				>
					{label}
				</Text>
			)}

			{/* First icon in the queue (fading out) */}
			<Animated.View
				style={[
					styles.iconWrapper,
					{
						opacity: fadeAnimOut,
						transform: [{ rotate }]
					}
				]}
			>
				<Icon name={iconQueue[0]} size={size} color={theme.colors.primary} />
			</Animated.View>

			{/* Second icon in the queue (fading in) */}
			{iconQueue[1] && (
				<Animated.View
					style={[
						styles.iconWrapper,
						{
							opacity: fadeAnimIn,
							transform: [{ rotate }]
						}
					]}
				>
					<Icon name={iconQueue[1]} size={size} color={theme.colors.primary} />
				</Animated.View>
			)}
		</TouchableOpacity>
	);
};

export default IconButton;

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: BorderRadius.xl,
		
		position: 'relative',
	},
	iconWrapper: {
		position: 'absolute',
	},
	label: {
		position: 'absolute',
		right: '100%',
		width: 150,
		paddingRight: Spacing.md,
		textAlign: 'right'
	}
});