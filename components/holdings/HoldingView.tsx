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
import { FABProvider, useFAB } from "../../contexts/FABContext";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useUser } from "../../hooks/useUser";
import { Tabs } from "../../components/ui/Tabs";
import { Icon } from "../../components/ui/Icon";
import { Value } from "../../components/ui/Value";
import { Header } from "../../components/ui/Header";
import { Grid } from "../../components/ui/Grid";
import { ItemList } from "../../components/ui/ItemList";
import { useTypes } from "../../hooks/useTypes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";
import { Holding } from "../../models/Holding";
import { useHolding } from "../../hooks/useHolding";
import { useSelector } from "../../hooks/useSelector";
import { Transaction } from "../../models/Transaction";
import Switcher from "../ui/Switcher";
import { LineChart } from "../charts/LineChart";
import { LineChartButton } from "../buttons/LineChartButton";
import { useChartSheet } from "../../contexts/ChartSheetContext";

interface HoldingViewProps {
	holding: Holding;
}

const HoldingView: React.FC<HoldingViewProps> = ( { holding } ) => {
	const { getAccountBy, saveHolding, removeObjects, addTransaction, getTransactions } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const account = getAccountBy( '_id', holding.account_id );
	const transactions = getTransactions( { accountId: holding.account_id, holdingId: holding._id } );
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { openChartSheet } = useChartSheet();
	const { SortingTypes, TimeframeTypes } = useTypes();
	const insets = useSafeAreaInsets();
	const { isSelecting, select, deselect, selectedType, selectedObjects, validate, hasObject, canSelect } = useSelector();

	useHolding( { holding } );

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

	const onLongPressTransaction = useCallback(( transaction: Transaction ) => {
		! isSelecting && select( 'Transaction', transaction );	
	}, []);

	const onPressSelectTransaction = useCallback(( transaction: Transaction ) => {
		hasObject( transaction )
			? deselect( transaction )
			: select( 'Transaction', transaction );
	}, [ selectedObjects ]);

	useEffect( () => {
		setActions( [
			{
				icon: ( props ) => { return (
					<Icon name={ 'receipt' } { ...props } />
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

	const { name, amount, value, returnValue, returnPercentage, valueHistoryData, returnHistoryData, feesHistoryData } = holding;

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

	const charts = [];

	if ( returnHistoryData ) {
		charts.push(
			<LineChartButton
				label={ __( "Return") }
				unit={ "€" }
				data={ returnHistoryData }
				onPress={ () => {
					openChartSheet(
						'',
						<LineChart
							id={ `${ holding._id.toString() }-return-chart` }
							label={ __( "Return") }
							unit={ "€" }
							data={ returnHistoryData }
							timeframeOptions={[
								TimeframeTypes.ytd,
								TimeframeTypes["1year"],
								TimeframeTypes["3year"],
								TimeframeTypes["5year"],
								TimeframeTypes.max
							]} />
					)
				}} />
		)
	}

	if ( feesHistoryData ) {
		charts.push(
			<LineChartButton
				label={ __( "Fees") }
				unit={ "€" }
				data={ feesHistoryData }
				onPress={ () => {
					openChartSheet(
						'',
						<LineChart
							id={ `${ holding._id.toString() }-fees-chart` }
							label={ __( "Fees") }
							unit={ "€" }
							data={ feesHistoryData }
							timeframeOptions={[
								TimeframeTypes.ytd,
								TimeframeTypes["1year"],
								TimeframeTypes["3year"],
								TimeframeTypes["5year"],
								TimeframeTypes.max
							]} />
					)
				}} />
		)
	}
	
	return (
		<View style={ styles.container }>
			<Header
				title={ name }
				left={ <BackButton /> }
				right={ <Switcher
					components={[
						<IconButton
							icon={ 'trash' }
							onPress={ () => { removeObjects( selectedType, selectedObjects ).then( validate )}} />,
						<IconButton
							icon={ 'ellipsis-vertical' }
							onPress={ onPressOptions } />
					]}
					activeIndex={ isSelecting ? 0 : 1 } />
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
							<Grid columns={ 2 } items={ charts } style={ styles.gridContainer } />
						</View>
					)
				},
				{
					label: __( 'Transactions' ),
					content: (
						<View style={ styles.contentContainer }>
							<FABProvider side='left' insets={insets} iconName={ "funnel-outline" }>
								<ItemList
									noItemsText={ __( 'No Transactions' ) }
									data={ transactions.map( transaction => {
										return {
											item: transaction,
											renderItem: (
												<TransactionItem
													transaction={ transaction }
													onPressSelect={ onPressSelectTransaction }
													onLongPress={ onLongPressTransaction }
													isSelectable={ canSelect( 'Transaction' ) && isSelecting }
													isSelected={ hasObject( transaction ) } />
											)
										}
									}) }
									sortingContainerStyle={ { marginBottom: insets.bottom } }
									sortingOptions={ [
										SortingTypes.newestFirst,
										SortingTypes.oldestFirst
									] }  />
							</FABProvider>
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
	gridContainer: {
		paddingTop: Spacing.md
	}
} );