import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { router } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../contexts/MenuContext";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";
import TransactionItem from "../../components/transactions/TransactionItem";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../contexts/I18nContext';
import { useFAB } from "../../contexts/FABContext";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useUser } from "../../hooks/useUser";
import { Card } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { Icon } from "../../components/ui/Icon";
import { Value } from "../../components/ui/Value";
import { Header } from "../../components/ui/Header";
import { Grid } from "../../components/ui/Grid";
import { Title } from "../../components/ui/Title";
import { ItemList } from "../../components/ui/ItemList";
import { useTypes } from "../../hooks/useTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";
import { Holding } from "../../models/Holding";
import { useHolding } from "../../hooks/useHolding";

interface HoldingViewProps {
	holding: Holding;
}

const HoldingView: React.FC<HoldingViewProps> = ( { holding } ) => {
	useHolding( { holding } );

	const { getAccountBy, saveHolding, removeObjects, addTransaction, getTransactions } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const account = getAccountBy( '_id', holding.account_id );
	const transactions = getTransactions( { accountId: holding.account_id, holdingId: holding._id } );
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
					removeObjects( 'Holding', [ holding ] ).then( router.back )
				}
			},
		];

		openMenu( anchor, menuItems );
	}, [ holding ] );
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

	if ( ! holding?.isValid() ) {
		router.back();
		return;
	}

	const { name, amount, value, returnValue, returnPercentage } = holding;

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
					label: __( 'Transactions' ),
					content: (
						<View style={ styles.contentContainer }>
							<ItemList
								noItemsText={ __( 'No Transactions' ) }
								data={ transactions.map( transaction => {
									return {
										item: transaction,
										renderItem: <TransactionItem transaction={ transaction } />
									}
								}) }
								sortingContainerStyle={ { marginBottom: insets.bottom } }
								sortingOptions={ [
									SortingTypes.newestFirst,
									SortingTypes.oldestFirst
								] }  />
						</View>
					)
				},
			] }>
			</Tabs>
		</View>
	)
}

export default HoldingView;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	},
} );