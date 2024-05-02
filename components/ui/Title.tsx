import React from 'react';
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import { Text } from "react-native-paper";

import { GlobalStyles } from "../../constants";

interface TitleProps {
	children: string,
	style?: StyleProp<TextStyle>
}

export const Title: React.FC<TitleProps> = ( {
	children,
	style
} ) => {
	return (
		<Text numberOfLines={ 1 } style={ [ styles.title, style ] }>
			{ children }
		</Text>
	);
}

const styles = StyleSheet.create( {
	title: {
		...GlobalStyles.title,
		flexShrink: 1
	}
} );