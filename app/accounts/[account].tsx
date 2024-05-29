import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import Realm from "realm";
import { useRealm, useUser } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles } from "../../constants";
import { __ } from "../../localization";
import { useAccount } from "../../hooks";
import { Grid, Header, Icon, ItemList, Tabs, Value } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { AccountForm } from "../../components/accounts";
import { FABProvider, useFAB } from "../../components/contexts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import HoldingItem from "../../components/holdings/HoldingItem";
import { TransferForm } from "../../components/transfers/TransferForm";
import TransferItem from "../../components/transfers/TransferItem";
import { Text } from "react-native-paper";

const AccountPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new Realm.BSON.UUID( params.id );
	const user: Realm.User = useUser();
	const realm = useRealm();
	const { account, saveAccount, removeAccount, addTransaction, addTransfer, getBalance, getValue } = useAccount( { id: accountId } );
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();

	const { _id, name, notes, holdings, transfers } = account;

	const onPressOptions = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					openBottomSheet(
						__( 'Edit Account' ),
						<AccountForm
							account={ account }
							onSubmit={ ( editedAccount ) => {
								saveAccount( editedAccount ).then( closeBottomSheet );
							}	} />
					);
				},
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( props ) => 
					<Icon name={ 'trash' } { ...props } />,
				onPress: removeAccount,
			},
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
					openBottomSheet(
						__( 'New Transaction' ),
						<TransactionForm
							transaction={ {
								_id: new Realm.BSON.UUID(),
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: '',
								account_id: _id
							} }
							account={ account }
							onSubmit={ ( transaction ) => {
								addTransaction( transaction ).then( closeBottomSheet );
							}	} />
					);
				}
			},
			{
				icon: ( { color, size } ) => { return (
					<Icon name={ 'swap-horizontal-outline' } size={ size } color={ color } />
				) },
				label: __( 'Add Transfer' ),
				onPress: () => {
					openBottomSheet(
						__( 'New Transfer' ),
						<TransferForm
							transfer={ {
								_id: new Realm.BSON.UUID(),
								account_id: _id,
								owner_id: user.id,
								date: Date.now(),
								amount: null,
								holding_name: ''
							} }
							account={ account }
							onSubmit={ ( transfer ) => {
								addTransfer( transfer ).then( closeBottomSheet );
							}	} />
					);
				}
			}
		])
	}, [ account ] );

	if ( ! account?.isValid() ) {
		router.back();
		return;
	}

	const values = [
		<Value label={ __( 'Balance' ) } value={ getBalance(2) } unit={ '€' } isVertical={ true } />,
		<Value label={ __( 'Value' ) } value={ getValue(2) } unit={ '€' } isVertical={ true } />,
	];

	return (
			<FABProvider>
				<View style={ styles.container }>
					<Header
						title={ name }
						left={ <BackButton /> }
						right={ <IconButton
							icon={ 'ellipsis-vertical' }
							onPress={ onPressOptions } />
						}
						showDivider={ false }>
							<Grid
								columns={ 4 }
								items= { values } />
					</Header>

					<Tabs screens={ [
						{
							label: __( 'Overview' ),
							content: (
								<Text>Overview</Text>
							)
						},
						{
							label: __( 'Holdings' ),
							content: (
								<ItemList
									noItemsTitleText={ __( 'No Holdings' ) }
									items={ holdings.map( holding =>
										<HoldingItem { ...holding } />
									) } />
							)
						},
						{
							label: __( 'Transfers' ),
							content: (
								<ItemList
									noItemsTitleText={ __( 'No Transfers' ) }
									items={ transfers.map( transfer =>
										<TransferItem { ...transfer } />
									) } />
							)
						}
					] }>
					</Tabs>
				</View>
			</FABProvider>
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
	},
} );