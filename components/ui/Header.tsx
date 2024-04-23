import { StyleSheet, View } from "react-native";
import { GlobalStyles, Spacing, Theme } from "../../constants";
import { Divider, Text } from "react-native-paper";
import { Row } from "./Row";

interface HeaderProps {
	title: string,
	right?: React.ReactNode
	showDivider?: boolean
}

export const Header: React.FC<HeaderProps> = ( {
	title,
	right,
	showDivider = true
} ) => {
	return ( <>
		<View style={ styles.container }>
				<Row style={ styles.row }>
					<Text numberOfLines={ 1 } style={ styles.title }>
						{ title }
					</Text>
					<View style={ styles.right }>
						{ right }
					</View>
				</Row>
				{ showDivider && <Divider style={ styles.divider } theme={ Theme }/> }
		</View>
	</> );
}

const styles = StyleSheet.create( {
	container: {
		width: '100%'
	},
	title: {
		...GlobalStyles.title,
		flexShrink: 1
	},
	row: {
		paddingVertical: Spacing.md,
		flexWrap: 'nowrap',
		flexGrow: 0
	},
	right: {
		gap: Spacing.md
	},
	divider: {
		marginHorizontal: -Spacing.md
	}
} );