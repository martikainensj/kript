import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { GlobalStyles, Spacing } from "../../constants";

interface TitleProps {
	children: string,
}

export const Title: React.FC<TitleProps> = ( {
	children
} ) => {
	return (
		<Text numberOfLines={ 1 } style={ styles.title }>
			{ children }
		</Text>
	);
}

const styles = StyleSheet.create( {
	title: {
		...GlobalStyles.title,
		flexShrink: 1,
		marginBottom: Spacing.sm
	}
} );