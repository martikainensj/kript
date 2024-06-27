import React, { useCallback, useEffect } from "react";
import Realm from "realm";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { router, useGlobalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../../constants";
import { BackButton, IconButton } from "../../../components/buttons";
import { MenuItem, useMenu } from "../../../contexts/MenuContext";
import { AccountForm } from "../../../components/accounts";
import { TransactionForm } from "../../../components/transactions/TransactionForm";
import { prettifyNumber } from "../../../helpers";
import { useI18n } from '../../../contexts/I18nContext';
import { useBottomSheet } from "../../../contexts/BottomSheetContext";
import { useFAB } from "../../../contexts/FABContext";
import { useUser } from "../../../hooks/useUser";
import { Card } from "../../../components/ui/Card";
import { useTypes } from "../../../hooks/useTypes";
import { Tabs } from "../../../components/ui/Tabs";
import { Icon } from "../../../components/ui/Icon";
import { Value } from "../../../components/ui/Value";
import { Header } from "../../../components/ui/Header";
import { Grid } from "../../../components/ui/Grid";
import { Title } from "../../../components/ui/Title";
import { ItemList } from "../../../components/ui/ItemList";
import HoldingItem from "../../../components/holdings/HoldingItem";
import TransactionItem from "../../../components/transactions/TransactionItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../../contexts/DataContext";

const AccountPage: React.FC = ( {} ) => {
	const { getAccountBy, saveAccount, removeAccount, addTransaction } = useData();
  const params = useGlobalSearchParams<{ accountId: string, name: string }>();
	const account = getAccountBy( '_id', new Realm.BSON.UUID( params.accountId ) );
	const { user } = useUser();
	const { __ } = useI18n();
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { SortingTypes } = useTypes();
	const insets = useSafeAreaInsets();

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
				onPress: removeAccount.bind( this, account ),
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

	if ( ! account?.isValid() ) {
		router.back();
		return;
	}

	const {
		name,
		notes,
		holdings,
		transactions,
		balance,
		value,
		returnValue,
		returnPercentage
	} = account;

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

	return (
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
								data={ holdings.map( holding => {
									return {
										item: holding,
										renderItem: <HoldingItem holding={ holding } />
									}
								}) }
								sortingContainerStyle={ { marginBottom: insets.bottom } }
								sortingOptions={ [
									SortingTypes.name,
									SortingTypes.highestReturn,
									SortingTypes.lowestReturn,
									SortingTypes.highestValue
								] } />
						</View>
					)
				},
				{
					label: __( 'Transactions' ),
					content: (
						<View style={ styles.contentContainer }>
							<ItemList
								noItemsText={ __( 'No Transactions' ) }
								data={ transactions.map( transaction => {
									return {
										item: transaction,
										renderItem: <TransactionItem transaction={ transaction } showHolding />
									}
								})}
								sortingContainerStyle={ { marginBottom: insets.bottom } }
								sortingOptions={ [
									SortingTypes.newestFirst,
									SortingTypes.oldestFirst
								] } />
						</View>
					)
				},
			] } />
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
} );