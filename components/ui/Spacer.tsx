import { View } from 'react-native';
import { Spacing } from '../../constants';
import React from 'react';

interface SpaceProps {
	size?: keyof typeof Spacing
}

export const Spacer: React.FC<SpaceProps> = ( { size = 'md' } ) => {
	return (
		<View style={ { paddingTop: Spacing[size] } }></View>
	);
}