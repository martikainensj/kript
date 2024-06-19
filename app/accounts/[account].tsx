import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import Realm from "realm";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { useAccount } from "../../hooks";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { AccountForm } from "../../components/accounts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../components/contexts/I18nContext';
import { useBottomSheet } from "../../components/contexts/BottomSheetContext";
import { FABProvider, useFAB } from "../../components/contexts/FABContext";
import { useUser } from "../../hooks/useUser";
import { Card } from "../../components/ui/Card";
import { useTypes } from "../../hooks/useTypes";
import { Tabs } from "../../components/ui/Tabs";
import { Icon } from "../../components/ui/Icon";
import { Value } from "../../components/ui/Value";
import { Header } from "../../components/ui/Header";
import { Grid } from "../../components/ui/Grid";
import { Title } from "../../components/ui/Title";
import { ItemList } from "../../components/ui/ItemList";

const AccountPage: React.FC = ( {} ) => {
	const params = useLocalSearchParams<{ id: string }>();
	const accountId = new Realm.BSON.UUID( params.id );
	const { user } = useUser();
	const { __ } = useI18n();
	const { account, saveAccount, removeAccount, addTransaction, balance, value, returnValue, returnPercentage } = useAccount( { id: accountId } );
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { SortingTypes } = useTypes();

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
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: '',
								account_id: account._id,
								type: 'trading',
								sub_type: 'buy'
							} }
							account={ account }
							onSubmit={ ( transaction ) => {
								addTransaction( transaction ).then( closeBottomSheet );
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

	const { _id, name, notes, holdings, transactions } = account;

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
								<View style={ styles.contentContainer }>
									<Card style={ { marginTop: Spacing.md } }>
										<Title>{ __( 'Overview' ) }</Title>
									</Card>
								</View>
							)
						},
						{
							label: __( 'Holdings' ),
							content: (
								<View style={ styles.contentContainer }>
									<ItemList
										noItemsText={ __( 'No Holdings' ) }
										contentContainerStyle={ styles.itemListcontentContainer }
										data={ [ ...holdings ] }
										sortingOptions={ [
											SortingTypes.sortName,
										] } />
								</View>
							),
							disabled: ! holdings?.length
						},
						{
							label: __( 'Transactions' ),
							content: (
								<View style={ styles.contentContainer }>
									<ItemList
										noItemsText={ __( 'No Transactions' ) }
										contentContainerStyle={ styles.itemListcontentContainer }
										data={ [ ...transactions ] }
										showHolding
										sortingOptions={ [
											SortingTypes.sortNewestFirst,
											SortingTypes.sortOldestFirst
										] } />
								</View>
							),
							disabled: ! holdings?.length
						},
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