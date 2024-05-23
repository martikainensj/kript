import { View } from 'react-native';
import { Spacing } from '../../constants';
import React from 'react';

interface SpacerProps {
	size?: keyof typeof Spacing
}

export const Spacer: React.FC<SpacerProps> = ( { size = 'md' } ) => {
	return (
		<View style={ { paddingTop: Spacing[size] } }></View>
	);
}