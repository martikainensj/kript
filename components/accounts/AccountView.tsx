import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, ScrollView, StyleSheet, View } from "react-native"
import { router } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { BackButton, IconButton } from "../buttons";
import { MenuItem, useMenu } from "../../contexts/MenuContext";
import { AccountForm } from "../accounts";
import { TransactionForm } from "../transactions/TransactionForm";
import { prettifyNumber } from "../../helpers";
import { useI18n } from '../../contexts/I18nContext';
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { useFAB } from "../../contexts/FABContext";
import { useUser } from "../../hooks/useUser";
import { useTypes } from "../../hooks/useTypes";
import { Tabs } from "../ui/Tabs";
import { Icon } from "../ui/Icon";
import { Value } from "../ui/Value";
import { Header } from "../ui/Header";
import { Grid } from "../ui/Grid";
import { ItemList } from "../ui/ItemList";
import HoldingItem from "../holdings/HoldingItem";
import TransactionItem from "../transactions/TransactionItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../../contexts/DataContext";
import { useSelector } from "../../hooks/useSelector";
import { Transaction } from "../../models/Transaction";
import { Account } from "../../models/Account";
import { useAccount } from "../../hooks";
import Switcher from "../ui/Switcher";
import { LineChart } from "../charts/LineChart";

interface AccountViewProps {
	account: Account;
}
const AccountView: React.FC<AccountViewProps> = ( { account } ) => {
	const { saveAccount, removeObjects, addTransaction } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { SortingTypes, TimeframeTypes } = useTypes();
	const insets = useSafeAreaInsets();
	const { isSelecting, selectedType, selectedObjects, select, deselect, canSelect, hasObject, validate } = useSelector();

	useAccount({ account });

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
				onPress: () => removeObjects( 'Account', [ account ] ).then(() => router.navigate( '/accounts' )) ,
			},
		];

		openMenu( anchor, menuItems );
	}, [ account ] );

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
		returnPercentage,
		valueHistoryData,
		returnHistoryData,
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
						<ScrollView
							style={ styles.contentContainer }
							contentContainerStyle={ styles.scrollViewContentContainer }>
							{ valueHistoryData && (
								<LineChart
									id={ `${ account._id.toString() }-value-chart` }
									label={ __( "Value") }
									unit={ "€" }
									data={ valueHistoryData }
									timeframeOptions={[
										TimeframeTypes.ytd,
										TimeframeTypes["1year"],
										TimeframeTypes["3year"],
										TimeframeTypes["5year"],
										TimeframeTypes.max
									]} />
							)}

							{ returnHistoryData && (
								<LineChart
									id={ `${ account._id.toString() }-return-chart` }
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
							)}
						</ScrollView>
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
								data={[
									...transactions,
									...holdings.flatMap( holding => {
										return [ ...holding.transactions ]
									})
								].map( transaction => {
									return {
										item: transaction,
										renderItem: (
											<TransactionItem
												transaction={ transaction }
												onPressSelect={ onPressSelectTransaction }
												onLongPress={ onLongPressTransaction }
												isSelectable={ canSelect( 'Transaction' ) && isSelecting }
												isSelected={ hasObject( transaction ) }
												showHolding />
										)
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

export default AccountView;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	},
	scrollViewContentContainer: {
		paddingBottom: Spacing.xl * 3.5
	}
} );