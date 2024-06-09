import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import Realm from "realm";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { useAccount } from "../../hooks";
import { Grid, Header, Icon, ItemList, Tabs, Title, Value } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { AccountForm } from "../../components/accounts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import HoldingItem from "../../components/holdings/HoldingItem";
import { TransferForm } from "../../components/transfers/TransferForm";
import TransferItem from "../../components/transfers/TransferItem";
import { Text } from "react-native-paper";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../components/contexts/I18nContext';
import { useBottomSheet } from "../../components/contexts/BottomSheetContext";
import { FABProvider, useFAB } from "../../components/contexts/FABContext";
import { useUser } from "../../hooks/useUser";
import { Card } from "../../components/ui/Card";

const AccountPage: React.FC = ( {} ) => {
	const params = useLocalSearchParams<{ id: string }>();
	const accountId = new Realm.BSON.UUID( params.id );
	const { user } = useUser();
	const { __ } = useI18n();
	const { account, saveAccount, removeAccount, addTransaction, addTransfer, balance, value, returnValue, returnPercentage } = useAccount( { id: accountId } );
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();

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

	const values = [
		<Value
			label={ __( 'Balance' ) }
			value={ prettifyNumber( balance, 0 ) }
			unit={ '€' }
			isVertical={ true }
			isNegative={ balance < 0 } />,
		<Value
			label={ __( 'Value' ) }
			value={ prettifyNumber( value, 0 ) }
			unit={ '€' }
			isVertical={ true }
			isNegative={ value < 0 } />,
		<Value
			label={ __( 'Return' ) }
			value={ prettifyNumber( returnValue, 0 ) }
			unit={ '€' }
			isVertical={ true }
			isPositive={ returnValue > 0 }
			isNegative={ returnValue < 0 } />,
		<Value
			label={ __( 'Return' ) }
			value={ prettifyNumber( returnPercentage, 0 ) }
			unit={ '%' }
			isVertical={ true }
			isPositive={ returnPercentage > 0 }
			isNegative={ returnPercentage < 0 } />,
	];

	if ( ! account?.isValid() ) {
		router.back();
		return;
	}

	const { _id, name, notes, holdings, transfers } = account;

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
									<Card style={ { marginTop: Spacing.md } }>
										<Title>{ __( 'Overview' ) }</Title>
									</Card>
								)
							},
							{
								label: __( 'Holdings' ),
								content: (
									<ItemList
										noItemsText={ __( 'No Holdings' ) }
										contentContainerStyle={ styles.itemListcontentContainer }
										items={ holdings.map( holding =>
											<HoldingItem { ...holding } />
										) } />
								),
								disabled: ! holdings?.length
							},
							{
								label: __( 'Transfers' ),
								content: (
									<ItemList
										noItemsText={ __( 'No Transfers' ) }
										contentContainerStyle={ styles.itemListcontentContainer }
										items={ transfers.map( transfer =>
											<TransferItem { ...transfer } showHolding={ true } />
										) } />
								),
								disabled: ! transfers?.length
							}
						] } />
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
	itemListcontentContainer: {
		paddingBottom: 80
	}
} );