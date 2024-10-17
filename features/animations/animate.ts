import { Animated } from "react-native";
import { AnimationProps } from "./types";
import { Duration } from "../../constants";

export const animateIn = ({animation, callback}: AnimationProps) => {
	Animated.timing(animation, {
		toValue: 1,
		duration: Duration.fast,
		useNativeDriver: true,
	}).start( callback );
};

export const animateOut = ({animation, callback}: AnimationProps) => {
	Animated.timing(animation, {
		toValue: 0,
		duration: Duration.fast,
		useNativeDriver: true,
	}).start( callback );
};