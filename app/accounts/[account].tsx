import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { BSON } from "realm";
import { useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../helpers";
import { useAccount } from "../../hooks";

const Account: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new BSON.ObjectID( params.id );
	const { account } = useAccount( { id: accountId } );
	
	return (
		<View style={ styles.container }>
			<Text>{ account.name }</Text>
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