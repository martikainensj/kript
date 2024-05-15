import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import { BSON, User } from "realm";
import { useRealm, useUser } from "@realm/react";
import { useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../localization";
import { useAccount } from "../../hooks";
import { Header, Icon, ItemList } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { AccountForm } from "../../components/accounts";
import { FABProvider, useFAB } from "../../components/contexts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import HoldingItem from "../../components/holdings/HoldingItem";

const AccountPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new BSON.ObjectID( params.id );
	const user: User = useUser();
	const realm = useRealm();

	const { account, saveAccount, removeAccount, addTransaction } = useAccount( { id: accountId } );

	const { openMenu } = useMenu();
	const { setActions } = useFAB();
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
					);

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
				onPress: () => {
					setTitle( __( 'New Transaction' ) );
					setContent(
						<TransactionForm
							transaction={ {
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: ''
							} }
							account={ account }
							onSubmit={ ( transaction ) => {
								addTransaction( transaction ).then( closeBottomSheet );
								/** TODO
								 * - TYHJENNÄ REALM JA PISTÄ KOKO PASKA UUSIKS KÄYNTIIN
								 * - Tee addTransaction setit useAccountiin
								 * 		- Sinne kaikki uusien holdingien käsittely jne
								 * - Lisää useTransaction johon saveTransaction ja deleteTransaction
								 */
							}	} />
					);

					openBottomSheet();
				}
			}
		])
	}, [ account ] );
	
	return (
		<View style={ styles.container }>
			<FABProvider>
				<Header
					title={ account?.name }
					left={ <BackButton /> }
					right={ <IconButton
						icon={ 'ellipsis-vertical' }
						onPress={ onPressOptions } />
					} />
				<View style={ styles.contentContainer }>
					<ItemList
						title={ __( 'Holdings' ) }
						noItemsTitleText={ __( 'No holdings' ) }
						noItemsDescriptionText={ __( 'Create a new holding by clicking the "+" button in the bottom right corner.' ) }
						items={ account.holdings.map( holding => {
							return <HoldingItem holding={ holding } />
						} ) } />
				</View>
			</FABProvider>
		</View>
	)
}

export default AccountPage;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md
	}
} );