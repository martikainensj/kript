import { Animated } from "react-native";
import { AnimationProps } from "./types";
import { Duration } from "../../constants";

export const fadeIn = ({animation, callback}: AnimationProps) => {
	Animated.timing(animation, {
		toValue: 1,
		duration: Duration.normal,
		useNativeDriver: true,
	}).start( callback );
};

export const fadeOut = ({animation, callback}: AnimationProps) => {
	Animated.timing(animation, {
		toValue: 0,
		duration: Duration.normal,
		useNativeDriver: true,
	}).start( callback );
};