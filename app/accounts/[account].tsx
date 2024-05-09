import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { BSON } from "realm";
import { useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../helpers";
import { useAccount } from "../../hooks";
import { Header, Icon } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { AccountForm } from "../../components/accounts";
import { FABProvider, useFAB } from "../../components/contexts";

const Account: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new BSON.ObjectID( params.id );
	const { account, saveAccount, removeAccount } = useAccount( { id: accountId } );
	const { openMenu } = useMenu();
	const { setActions, actions } = useFAB();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();

	const onPressOptions = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					setTitle( __( 'Edit Account' ) );
					setContent(
						<AccountForm
							account={ account }
							onSubmit={ ( editedAccount ) => {
								saveAccount( editedAccount ).then( closeBottomSheet );
							}	} />
					)

					openBottomSheet();
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'trash' } color={ color } />,
				onPress: removeAccount
			}
		];

		openMenu( anchor, menuItems );
	}, [ account ] );

	useEffect( () => {
		setActions( [
			{
				icon: ( { color, size } ) => { return (
					<Icon name={ 'pricetag' } size={ size } color={ color } />
				) },
				label: __( 'Add Transaction' ),
				onPress: () => { /* TODO */ }
			}
		])
	}, [] );
	
	return (
		<View style={ styles.container }>
			<FABProvider>
				<Header
					title={ account.name }
					left={ <BackButton /> }
					right={ <IconButton
						icon={ 'ellipsis-vertical' }
						onPress={ onPressOptions } />
					} />
				<View style={ styles.contentContainer }>
					<Text>{ JSON.stringify(account) }</Text>
				</View>
			</FABProvider>
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