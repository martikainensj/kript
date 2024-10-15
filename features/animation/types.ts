import { Animated } from "react-native";

export interface AnimationProps {
	animation: Animated.Value,
	callback?: () => void
}