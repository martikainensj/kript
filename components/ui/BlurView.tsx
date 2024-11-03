import React from 'react';
import { Animated } from 'react-native';
import { BlurView as RNBlurView, BlurViewProps } from 'expo-blur';

const AnimatedBlurView = Animated.createAnimatedComponent(RNBlurView);

interface Props extends Omit<BlurViewProps, "intensity"> {
	intensity?: number | Animated.Value | Animated.AnimatedInterpolation<string | number>
}

export const BlurView: React.FC<Props> = ({
	intensity,
	...rest
}) => {
	return (
		<AnimatedBlurView
			{...rest}
			style={rest.style}
			intensity={intensity}
		/>
	);
};