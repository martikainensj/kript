import React, { useState, useEffect, useRef, Children } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { Duration } from '../../constants';

interface Props {
	condition: boolean,
	children: React.ReactNode,
	initialValues?: {
		scaleX?: number,
		scaleY?: number,
		translateX?: number,
		translateY?: number,
		width?: number,
		height?: number,
	},
	targetValues?: {
		scaleX?: number,
		scaleY?: number,
		translateX?: number,
		translateY?: number,
		width?: number,
		height?: number,
	},
}

const ConditionalView: React.FC<Props> = ({
	condition,
	children,
	initialValues,
	targetValues
}) => {
	const [ shouldRender, setShouldRender ] = useState( condition );
  const fadeAnim = useRef( new Animated.Value( condition ? 1 : 0 )).current;
	const scaleX = fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [
			initialValues?.scaleX ?? 1,
			targetValues?.scaleX ?? 1
		],
	});
	const scaleY = fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [
			initialValues?.scaleY ?? 1,
			targetValues?.scaleY ?? 1
		],
	});

	const translateX = fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [
			initialValues?.translateX ?? 1,
			targetValues?.translateX ?? 1
		],
	});
	const translateY = fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [
			initialValues?.translateY ?? 1,
			targetValues?.translateY ?? 1
		],
	});

	const width = ( initialValues?.width && targetValues?.width ) && fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [
			initialValues.width,
			targetValues.width
		],
	});
	const height = ( initialValues?.height && targetValues?.height ) && fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [
			initialValues.height,
			targetValues.height
		],
	});
	
	const duration = Duration.normal;

  useEffect(() => {
    if (condition) {
      setShouldRender(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: false,
      }).start(() => setShouldRender(false)); // Remove the component after fade-out
    }
  }, [condition]);

  return (
    shouldRender && (
      <Animated.View style={[
				styles.container,
				{
					width,
					height,
					opacity: fadeAnim,
					transform: [
						{ scaleX },
						{ scaleY },
						{ translateX },
						{ translateY }
					]
				}
			]}>
        { children }
      </Animated.View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
});

export default ConditionalView;