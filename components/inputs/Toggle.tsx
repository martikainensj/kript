import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { Duration, Spacing } from '../../constants';
import { Icon } from '../ui/Icon';
import { useTheme } from '../../features/theme/ThemeContext';

interface ToggleProps {
	value: boolean;
	setValue: React.Dispatch<React.SetStateAction<ToggleProps['value']>>;
	activeIcon?: React.ComponentProps<typeof Ionicons>['name'];
	inactiveIcon?: React.ComponentProps<typeof Ionicons>['name'];
	activeColor?: string;
	inactiveColor?: string;
	thumbSize?: number;
}

export const Toggle: React.FC<ToggleProps> = ( {
	value,
	setValue,
	activeIcon,
	inactiveIcon,
	activeColor,
	inactiveColor,
	thumbSize = Spacing.lg,
} ) => {
	const { theme } = useTheme();
  const translateX = useRef( new Animated.Value( 0 ) ).current;
	const iconSize = thumbSize - 8;

	useEffect( () => {
    Animated.timing( translateX, {
      toValue: value ? thumbSize : 0,
      duration: Duration.normal,
      useNativeDriver: true,
			easing: Easing.out( Easing.cubic )
    } ).start();
  }, [ value ] );

	const trackColor = translateX.interpolate( {
    inputRange: [ 0, thumbSize ],
    outputRange: [
			inactiveColor ?? theme.colors.surfaceVariant,
			activeColor ?? theme.colors.surfaceVariant,
		],
  } );

	const icons = [
		<Icon name={ inactiveIcon } size={ iconSize } color={ theme.colors.primary } />,
		<Icon name={ activeIcon } size={ iconSize } color={ theme.colors.primary } />
	]

	return (
    <Pressable onPress={ () => setValue( ! value ) }>
			<Animated.View
				style={ {
					width: thumbSize * 2 + Spacing.xs * 2,
					height: thumbSize + Spacing.xs * 2,
					borderRadius: thumbSize,
					backgroundColor: trackColor,
					padding: Spacing.xs,
				} }>
				<Animated.View style={ styles.iconsContainer }>
					{ icons.map( ( icon, key ) => (
						<View key={ key } style={ [ styles.iconWrapper, {
							height: thumbSize, aspectRatio: 1
						} ] }>
							{ icon }
						</View>
					) ) }
				</Animated.View>

				<Animated.View
					style={ {
						height: thumbSize,
						aspectRatio: 1,
						borderRadius: thumbSize / 2,
						backgroundColor: theme.colors.background,
						transform: [{ translateX }],
					} } />
			</Animated.View>
    </Pressable>
	)
}

const styles = StyleSheet.create( {
	iconsContainer: {
		position: 'absolute',
		top: Spacing.xs,
		left: Spacing.xs,
		right: Spacing.xs,
		bottom: Spacing.xs,
		flexDirection: 'row'
	},
	iconWrapper: {
		alignItems: 'center',
		justifyContent: 'center'
	}
} )