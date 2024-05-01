import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles, Spacing } from "../../constants";
import { Row } from "./Row";
import { Title } from "./Title";

interface HeaderProps {
	title: string,
	left?: React.ReactNode,
	right?: React.ReactNode,
	isScreenHeader?: boolean
}

export const Header: React.FC<HeaderProps> = ( {
	title,
	left,
	right,
	isScreenHeader = true
} ) => {
	const insets = useSafeAreaInsets();

	return ( <>
		<View style={ [
			styles.container,
			isScreenHeader && {
				...GlobalStyles.header,
				paddingTop: insets.top
			}
		] }>
			<Row style={ styles.row }>
				{ left &&
					<View style={ styles.left }>
						{ left }
					</View>
				}

				<Title>{ title }</Title>

				{ right && 
					<View style={ styles.right }>
						{ right }
					</View>
				}
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

	left: {
		gap: Spacing.md
	},
	right: {
		gap: Spacing.md
	}
} );