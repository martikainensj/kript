import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles, Spacing } from "../../constants";
import { Row } from "./Row";
import { Title } from "./Title";

interface HeaderProps {
	title: string,
	right?: React.ReactNode,
	isScreenHeader?: boolean
}

export const Header: React.FC<HeaderProps> = ( {
	title,
	right,
	isScreenHeader = true
} ) => {
	const insets = useSafeAreaInsets();

	return ( <>
		<View style={ [
			styles.container,
			isScreenHeader && { paddingTop: insets.top }
		] }>
			<Row style={ styles.row }>
				<Title>
					{ title }
				</Title>
				<View style={ styles.right }>
					{ right }
				</View>
			</Row>
		</View>
	</> );
}

const styles = StyleSheet.create( {
	container: {
		width: '100%'
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