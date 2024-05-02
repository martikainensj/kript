import React from "react";
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { BSON } from "realm";
import { useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../helpers";
import { useAccount } from "../../hooks";
import { Header } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { useMenu } from "../../components/contexts/MenuContext";

const Account: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new BSON.ObjectID( params.id );
	const { account } = useAccount( { id: accountId } );
	const { openMenu } = useMenu();
	
	return (
		<View style={ styles.container }>
			<Header
				title={ account.name }
				left={ <BackButton /> }
				right={ <IconButton icon={ 'ellipsis-vertical' } />} />
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