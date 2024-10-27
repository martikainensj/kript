import React, { useRef, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Animated, View, StyleProp, TextStyle } from 'react-native';
import { BorderRadius, Duration, IconSize, Spacing } from '../../constants';
import { Icon } from '../ui/Icon';
import { useTheme } from '../../features/theme/ThemeContext';
import { Text } from '../ui/Text';

interface IconButtonProps extends TouchableOpacityProps {
	icon: React.ComponentProps<typeof Ionicons>['name'];
	size?: number;
	label?: string;
	labelStyle?: StyleProp<TextStyle>;
}

export const IconButton: React.FC<IconButtonProps> = ({
	icon,
	size = IconSize.md,
	label,
	labelStyle,
	...rest
}) => {
	const { theme } = useTheme();
	const [iconQueue, setIconQueue] = useState([icon]);
	const [isAnimating, setIsAnimating] = useState(false);

	const animation = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		if (iconQueue[0] === icon || isAnimating) return;

		setIconQueue((prevQueue) => [...prevQueue, icon]);
	}, [icon]);

	useEffect(() => {
		if (iconQueue.length < 2 || isAnimating) return;

		animation.setValue(0);
		setIsAnimating(true);

		Animated.timing(animation, {
			toValue: 1,
			duration: Duration.normal,
			useNativeDriver: true,
		}).start(() => {
			setIconQueue((prevQueue) => prevQueue.slice(1));
			setIsAnimating(false);
		});
	}, [iconQueue]);

	const outgoingOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0], // Fades out
		extrapolate: 'clamp',
	});

	const incomingOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1], // Fades in
		extrapolate: 'clamp',
	});

	const rotation = animation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
		extrapolate: 'clamp',
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
					style={[styles.label, labelStyle]}
				>
					{label}
				</Text>
			)}

			{/* Outgoing icon */}
			{iconQueue[0] && (
				<Animated.View
					style={[
						styles.iconWrapper,
						{
							opacity: iconQueue.length > 1 ? outgoingOpacity : 1,
							transform: [{ rotate: rotation }],
						}
					]}
				>
					<Icon name={iconQueue[0]} size={size} color={theme.colors.primary} />
				</Animated.View>
			)}

			{/* Incoming icon */}
			{iconQueue[1] && (
				<Animated.View
					style={[
						styles.iconWrapper,
						{
							opacity: incomingOpacity,
							transform: [{ rotate: rotation }],
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