import React, { useCallback, useEffect, useMemo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import Realm from "realm";
import { useRealm, useUser } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../localization";
import { useAccount } from "../../hooks";
import { Grid, Header, Icon, ItemList, Value } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { AccountForm } from "../../components/accounts";
import { FABProvider, useFAB } from "../../components/contexts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import HoldingItem from "../../components/holdings/HoldingItem";
import { TransferForm } from "../../components/transfers/TransferForm";
import TransferItem from "../../components/transfers/TransferItem";
import { GestureHandlerRootView, NativeViewGestureHandler } from "react-native-gesture-handler";

const AccountPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string }>();
	const accountId = new Realm.BSON.UUID( params.id );
	const user: Realm.User = useUser();
	const realm = useRealm();
	const { account, saveAccount, removeAccount, addTransaction, addTransfer, getBalance, getValue } = useAccount( { id: accountId } );
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
					openBottomSheet(
						__( 'Edit Account' ),
						<AccountForm
							account={ account }
							onSubmit={ ( editedAccount ) => {
								saveAccount( editedAccount ).then( closeBottomSheet );
							}	} />
					);
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( props ) => 
					<Icon name={ 'trash' } { ...props } />,
				onPress: removeAccount,
			},
			{
				title: __( 'Transfers' ),
				leadingIcon: ( props ) => 
					<Icon name={ 'swap-horizontal-outline' } { ...props } />,
				onPress: () => {
					openBottomSheet(
						__( 'Transfers' ),
						<ItemList
							noItemsTitleText={ __( 'No Transfers' ) }
							noItemsDescriptionText={ __( 'Create a new transfers by clicking the "+" button in the bottom right corner.' ) }
							items={ account.transfers.map( ( transfers ) => {
								return <TransferItem { ...transfers } />
							} ) }
							style={ styles.bottomSheetItemList } />
					);
				},
				startsSection: true
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
								account_id: account._id
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
								account_id: account._id,
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
		<View style={ styles.container }>
			<FABProvider>
				<Header
					title={ account?.name }
					left={ <BackButton /> }
					right={ <IconButton
						icon={ 'ellipsis-vertical' }
						onPress={ onPressOptions } />
					}>
						<Grid
							columns={ 4 }
							items= { values } />
				</Header>
				<View style={ styles.contentContainer }>
					<ItemList
						title={ __( 'Holdings' ) }
						noItemsTitleText={ __( 'No holdings' ) }
						noItemsDescriptionText={ __( 'Create a new holding by clicking the "+" button in the bottom right corner.' ) }
						items={ account.holdings.map( ( holding ) => {
							return <HoldingItem { ...holding } />
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
	},
	bottomSheetItemList: {
		flex: 0,
		height: 300
	}
} );