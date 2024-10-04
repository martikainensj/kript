import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { BorderRadius, Duration } from '../../constants';
import { Icon } from '../ui/Icon';
import { TouchableRipple } from 'react-native-paper';
import { useTheme } from '../../features/theme/ThemeContext';

interface CheckboxProps {
	value: boolean;
	setValue?: React.Dispatch<React.SetStateAction<CheckboxProps['value']>>;
	activeColor?: string;
	inactiveColor?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ( {
	value,
	setValue,
	activeColor,
	inactiveColor,
} ) => {
	const { theme } = useTheme();
	const opacity = useRef( new Animated.Value( 0 ) ).current;

	const onPressHandler = () => {
		setValue && setValue( ! value );
	}

	useEffect( () => {
		Animated.timing( opacity, {
			toValue: value ? 1 : 0,
			duration: Duration.normal,
			useNativeDriver: true,
			easing: Easing.out( Easing.cubic )
		} ).start();
	}, [ value ] );

	const backgroundColor = opacity.interpolate( {
		inputRange: [ 0, 1 ],
		outputRange: [
			inactiveColor ?? theme.colors.surfaceVariant,
			activeColor ?? theme.colors.surfaceVariant,
		],
	} );

	return (
		<TouchableRipple onPress={ onPressHandler } pointerEvents={ !! setValue ? 'auto' : 'none' }>
			<Animated.View style={[ 
				styles.container,
				{ backgroundColor }
			]}>
				<Animated.View style={[
					styles.iconWrapper,
					{ opacity }
				]}>
					<Icon name={ 'checkmark' } size={ 14 } />
				</Animated.View>
			</Animated.View>
		</TouchableRipple>
	)
}

const styles = StyleSheet.create( {
	container: {
		height: 16,
		aspectRatio: 1,
		borderRadius: BorderRadius.xs,
		alignItems: 'center',
		justifyContent: 'center', 
	},
	iconWrapper: {
		aspectRatio: 1,
	}
} )