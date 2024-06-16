import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import Realm, { BSON } from "realm";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { useHolding } from "../../hooks";
import { Grid, Header, Icon, ItemList, Tabs, Title, Value } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { TransferForm } from "../../components/transfers/TransferForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";
import TransactionItem from "../../components/transactions/TransactionItem";
import TransferItem from "../../components/transfers/TransferItem";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../components/contexts/I18nContext';
import { FABProvider, useFAB } from "../../components/contexts/FABContext";
import { useBottomSheet } from "../../components/contexts/BottomSheetContext";
import { useUser } from "../../hooks/useUser";
import { Card } from "../../components/ui/Card";

const HoldingPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ _id: string, account_id: string }>();
	const _id = new Realm.BSON.UUID( params._id );
	const account_id = new Realm.BSON.UUID( params.account_id );
	const { user } = useUser();
	const { __ } = useI18n();
	const {
		holding, saveHolding, removeHolding,
		account,
		addTransaction,
		dividends, transactions,
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
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: holding.name,
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
			},
		])
	}, [ holding, account ] );

	const values = [
		<Value
			label={ __( 'Amount' ) }
			value={ prettifyNumber( amount ) }
			isVertical={ true } />,
		<Value
			label={ __( 'Value' ) }
			value={ prettifyNumber( value ) }
			unit={ '€' }
			isVertical={ true } />,
		<Value
			label={ __( 'Return' ) }
			value={ prettifyNumber( returnValue ) }
			unit={ '€' }
			isVertical={ true }
			isPositive={ returnValue > 0 }
			isNegative={ returnValue < 0 } />,
		<Value
			label={ __( 'Return' ) }
			value={ prettifyNumber( returnPercentage ) }
			unit={ '%' }
			isVertical={ true }
			isPositive={ returnPercentage > 0 }
			isNegative={ returnPercentage < 0 } />,
	];

	if ( ! holding?.isValid() ) {
		router.back();
		return;
	}

	const { name } = holding;
	
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
							label: __( 'Transactions' ),
							content: (
								<View style={ styles.contentContainer }>
									<ItemList
										noItemsText={ __( 'No Transactions' ) }
										items={ transactions.map( transaction =>
											<TransactionItem { ...transaction } />
										) } />
								</View>
							),
							disabled: ! transactions?.length
						},
						{
							label: __( 'Dividends' ),
							content: (
								<View style={ styles.contentContainer }>
									<ItemList
										noItemsText={ __( 'No Dividends' ) }
										items={ dividends.map( dividend =>
											<TransferItem { ...dividend } />
										) } />
								</View>
							),
							disabled: ! dividends?.length
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
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	},
} );