import React, { useState, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { Duration } from '../../constants';

interface Props {
	components: React.ReactNode[],
	activeIndex: number,
}

const Switcher: React.FC<Props> = ({ components, activeIndex }) => {
  const [ currentComponent, setCurrentComponent ] = useState( activeIndex );
  const fadeAnim = useRef( new Animated.Value( 1 )).current;
	const scale = fadeAnim.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ 0.9, 1 ],
	});
	
	const duration = Duration.normal;

  useEffect(() => {
    if (currentComponent !== activeIndex) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
				easing: Easing.out( Easing.cubic )
      }).start(() => {
        setCurrentComponent(activeIndex);

        fadeAnim.setValue(0);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
					easing: Easing.out( Easing.cubic )
        }).start();
      });
    }
  }, [activeIndex]);

  return (
	<View style={styles.container}>
		<Animated.View
			style={[
				styles.componentContainer,
				{ opacity: fadeAnim, transform: [{ scale }]},
			]}
		>
			{components[currentComponent]}
		</Animated.View>
	</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  componentContainer: {
		flex: 1,
    //...StyleSheet.absoluteFillObject,
  },
});

export default Switcher;