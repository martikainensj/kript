import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import Realm from "realm";
import { useUser } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles } from "../../constants";
import { useHolding } from "../../hooks";
import { Grid, Header, Icon, ItemList, Tabs, Value } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { FABProvider, useFAB } from "../../components/contexts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { TransferForm } from "../../components/transfers/TransferForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";
import TransactionItem from "../../components/transactions/TransactionItem";
import TransferItem from "../../components/transfers/TransferItem";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../components/contexts/I18nContext';

const HoldingPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ _id: string, account_id: string }>();
	const _id = new Realm.BSON.UUID( params._id );
	const account_id = new Realm.BSON.UUID( params.account_id );
	const user: Realm.User = useUser();
	const { __ } = useI18n();
	const {
		holding, saveHolding, removeHolding,
		account,
		addTransaction,
		dividends, addTransfer,
		value, amount, returnValue, returnPercentage
	}	= useHolding( { _id, account_id } );
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();

	const onPressOptions = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( props ) => 
					<Icon name={ 'create' } { ...props }/>,
				onPress: () => {
					openBottomSheet(
						__( 'Edit Holding' ),
						<HoldingForm
							holding={ holding }
							onSubmit={ holding => {
								saveHolding( holding ).then( closeBottomSheet ) }
							} />
					);
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( props ) => 
					<Icon name={ 'trash' } { ...props } />,
				onPress: () => {
					removeHolding().then( router.back	)
				}
			},
		];

		openMenu( anchor, menuItems );
	}, [ holding, account ] );
	useEffect( () => {
		setActions( [
			{
				icon: ( props ) => { return (
					<Icon name={ 'pricetag' } { ...props } />
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
								holding_name: holding.name,
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
				icon: ( props ) => { return (
					<Icon name={ 'swap-horizontal-outline' } { ...props } />
				) },
				label: __( 'Add Dividend' ),
				onPress: () => {
					openBottomSheet(
						__( 'New Dividend' ),
						<TransferForm
							transfer={ {
								_id: new Realm.BSON.UUID(),
								account_id: account._id,
								owner_id: user.id,
								date: Date.now(),
								amount: null,
								holding_name: holding.name
							} }
							account={ account }
							onSubmit={ ( transfer ) => {
								addTransfer( transfer ).then( closeBottomSheet );
							}	} />
					);
				}
			}
		])
	}, [ holding, account ] );

	const values = [
		<Value label={ __( 'Amount' ) } value={ prettifyNumber( amount ) } isVertical={ true } />,
		<Value label={ __( 'Value' ) } value={ prettifyNumber( value ) } unit={ '€' } isVertical={ true } />,
		<Value label={ __( 'Return' ) } value={ prettifyNumber( returnValue ) } unit={ '€' } isVertical={ true } />,
		<Value label={ __( 'Return' ) } value={ prettifyNumber( returnPercentage ) } unit={ '%' } isVertical={ true } />,
	];

	if ( ! holding?.isValid() ) {
		router.back();
		return;
	}

	const { name, transactions } = holding;
	
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
							label: __( 'Transactions' ),
							content: (
								<ItemList
									noItemsText={ __( 'No Transactions' ) }
									items={ transactions.map( transaction =>
										<TransactionItem { ...transaction } />
									) } />
							)
						},
						{
							label: __( 'Dividends' ),
							content: (
								<ItemList
									noItemsText={ __( 'No Dividends' ) }
									items={ dividends.map( dividend =>
										<TransferItem { ...dividend } />
									) } />
							)
						}
					] }>
					</Tabs>
				</View>
			</FABProvider>
	)
}

export default HoldingPage;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
} );