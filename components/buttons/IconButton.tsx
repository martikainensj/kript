import React, { useRef, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Animated, View, StyleProp, TextStyle } from 'react-native';
import { BorderRadius, Duration, GlobalStyles, IconSize, Spacing } from '../../constants';
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
	const [iconQueue, setIconQueue] = useState(new Set([icon]));
	const animation = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		setIconQueue((prevQueue) => {
			const queueArray = [...prevQueue];
			const updatedQueue = new Set([queueArray[queueArray.length - 1], icon]);

			if (updatedQueue.size > 1) {
				animation.setValue(0);

				Animated.timing(animation, {
					toValue: 1,
					duration: Duration.normal,
					useNativeDriver: true,
				}).start(() => {
					setIconQueue((queue) => {
						const newQueueArray = [...queue].slice(1);
						return new Set(newQueueArray);
					});
				});
			}

			return updatedQueue;
		});
	}, [icon, animation]);

	const outgoingOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0],
		extrapolate: 'clamp',
	});

	const incomingOpacity = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
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
				rest.disabled && GlobalStyles.disabled,
				rest.style,
			]}
		>
			{label && (
				<Text
					numberOfLines={1}
					fontSize="md"
					style={[
						styles.label,
						labelStyle
					]}
				>
					{label}
				</Text>
			)}

			{Array.from(iconQueue)[0] && (
				<Animated.View
					style={[
						styles.iconWrapper,
						{
							opacity: iconQueue.size > 1 ? outgoingOpacity : 1,
							transform: [{ rotate: rotation }],
						}
					]}
				>
					<Icon name={Array.from(iconQueue)[0]} size={size} color={theme.colors.primary} />
				</Animated.View>
			)}

			{Array.from(iconQueue)[1] && (
				<Animated.View
					style={[
						styles.iconWrapper,
						{
							opacity: incomingOpacity,
							transform: [{ rotate: rotation }],
						}
					]}
				>
					<Icon name={Array.from(iconQueue)[1]} size={size} color={theme.colors.primary} />
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
		textAlign: 'right',
	}
});