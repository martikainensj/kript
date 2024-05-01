import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { BSON } from "realm";
import { useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../helpers";
import { useAccount } from "../../hooks";
import { Header } from "../../components/ui";
import { BackButton } from "../../components/buttons";

const Account: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new BSON.ObjectID( params.id );
	const { account } = useAccount( { id: accountId } );
	
	return (
		<View style={ styles.container }>
			<Header
				title={ account.name }
				left={ <BackButton /> } />
			<View style={ styles.contentContainer }>
				<Text>{ account.name }</Text>
			</View>
		</View>
	)
}

export default Account;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.gutter,
		paddingTop: Spacing.md
	}
} );