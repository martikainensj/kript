import { StyleSheet, View } from "react-native"

import { Header } from "../../components/ui";
import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../helpers";

const Account: React.FC = ( {} ) => {
	return (
		<View style={ styles.container }>
			
		</View>
	)
}

export default Account;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
		paddingTop: Spacing.md
	}
} );