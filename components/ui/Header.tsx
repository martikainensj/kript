import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles, Spacing, Theme } from "../../constants";
import { Divider, Text } from "react-native-paper";
import { Row } from "./Row";

interface HeaderProps {
	title: string,
	right?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ( {
	title,
	right
} ) => {
	const insets = useSafeAreaInsets();
	const statusBarHeight = insets.top;

	return ( <>
		<View style={ [
			styles.container,
			{ paddingTop: statusBarHeight }
		] }>
				<Row style={ styles.row }>
					<Text numberOfLines={ 1 } style={ styles.title }>
						{ title }
					</Text>
					<View style={ styles.right }>
						{ right }
					</View>
				</Row>
		</View>
	</> );
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.shadow,
		width: '100%',
		backgroundColor: Theme.colors.background
	},
	title: {
		...GlobalStyles.title,
		flexShrink: 1
	},
	row: {
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md,
		flexWrap: 'nowrap',
		flexGrow: 0
	},
	right: {
		gap: Spacing.md
	}
} );