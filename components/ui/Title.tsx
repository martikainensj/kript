import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from "react-native";

import { GlobalStyles } from "../../constants";
import { Text } from './Text';

interface TitleProps {
	children: string,
	style?: StyleProp<TextStyle>
}

export const Title: React.FC<TitleProps> = ({
	children,
	style
}) => {
	if (!children) {
		return;
	}

	return (
		<Text
			fontSize="md"
			numberOfLines={1}
			style={[
				styles.title,
				style
			]}
		>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	title: {
		flexShrink: 1
	}
});