import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native"
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FontSize, FontWeight, GlobalStyles, Spacing } from "../../constants";
import { BackButton, IconButton } from "../buttons";
import { AccountForm } from "../accounts";
import { TransactionForm } from "../transactions/TransactionForm";
import { prettifyNumber } from "../../helpers";
import { useBottomSheet } from "../../contexts/BottomSheetContext";
import { FABProvider, useFAB } from "../../contexts/FABContext";
import { Icon } from "../ui/Icon";
import { Value } from "../ui/Value";
import { Header } from "../ui/Header";
import { Grid } from "../ui/Grid";
import { ItemList } from "../ui/ItemList";
import HoldingItem from "../holdings/HoldingItem";
import TransactionItem from "../transactions/TransactionItem";
import { useSelector } from "../../hooks/useSelector";
import { Transaction } from "../../models/Transaction";
import { Account } from "../../models/Account";
import { LineChart } from "../charts/LineChart";
import { useChartSheet } from "../../contexts/ChartSheetContext";
import { LineChartButton } from "../buttons/LineChartButton";
import ConditionalView from "../ui/ConditionalView";
import { useAccount } from "../../hooks/useAccount";
import { useI18n } from "../../features/i18n/I18nContext";
import { useData } from "../../features/data/DataContext";
import { useUser } from "../../features/realm/useUser";
import { useSorting } from "../../features/data/useSorting";
import { useCharts } from "../../features/charts/useCharts";
import { TabsScreenProps } from "../../features/tabs/types";
import { TabsProvider } from "../../features/tabs/TabsContext";
import { Tab } from "../../features/tabs/Tab";

interface AccountViewProps {
	account: Account;
}
const AccountView: React.FC<AccountViewProps> = ({ account }) => {
	const { saveAccount, removeObjects, addTransaction } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const { setActions } = useFAB();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { openChartSheet } = useChartSheet();
	const { SortingTypes } = useSorting();
	const { TimeframeTypes } = useCharts();
	const insets = useSafeAreaInsets();
	const { isSelecting, selectedType, selectedObjects, select, deselect, canSelect, hasObject, validate } = useSelector();

	useAccount({ account });

	const onLongPressTransaction = useCallback((transaction: Transaction) => {
		!isSelecting && select('Transaction', transaction);
	}, []);

	const onPressSelectTransaction = useCallback((transaction: Transaction) => {
		hasObject(transaction)
			? deselect(transaction)
			: select('Transaction', transaction);
	}, [selectedObjects]);

	useEffect(() => {
		setActions([
			{
				icon: ({ size }) => <Icon name={'create-outline'} size={size} />,
				label: __('Edit'),
				onPress: () => {
					openBottomSheet(
						__('Edit Account'),
						<AccountForm
							account={account}
							onSubmit={(editedAccount) => {
								saveAccount(editedAccount).then(closeBottomSheet);
							}} />
					);
				},
			},
			{
				icon: ({ size }) => <Icon name={'trash-outline'} size={size} />,
				label: __('Remove'),
				onPress: () => {
					removeObjects('Account', [account]).then(
						() => router.navigate('/accounts')
					);
				},
				containerStyle: styles.fabAction,
				style: styles.fabAction,
			},
			{
				icon: ({ size }) => <Icon name={'receipt-outline'} size={size} />,
				label: __('Add Transaction'),
				onPress: () => {
					openBottomSheet(
						__('New Transaction'),
						<TransactionForm
							transaction={{
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: '',
								account_id: account._id,
								type: 'trading',
								sub_type: 'buy'
							}}
							account={account}
							onSubmit={(transaction) => {
								addTransaction(transaction).then(closeBottomSheet);
							}} />
					);
				}
			}
		])
	}, [account]);

	if (!account?.isValid()) {
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
		loanAmount,
		loanHistoryData,
		returnPercentage,
		valueHistoryData,
		returnHistoryData,
		dividendHistoryData,
	} = account;

	const values = [
		<Value
			label={__('Value')}
			value={prettifyNumber(value, 0)}
			unit={'€'}
			isVertical={true}
			isNegative={value < 0} />,
		<Value
			label={__('Return')}
			value={prettifyNumber(returnValue, 0)}
			unit={'€'}
			isVertical={true}
			isPositive={returnValue > 0}
			isNegative={returnValue < 0} />,
		<Value
			label={__('Return')}
			value={prettifyNumber(returnPercentage, 0)}
			unit={'%'}
			isVertical={true}
			isPositive={returnPercentage > 0}
			isNegative={returnPercentage < 0} />,
		<Value
			label={__('Balance')}
			value={prettifyNumber(balance, 0)}
			unit={'€'}
			isVertical={true}
			isNegative={balance < 0} />,
	];

	const overviewCharts = [];

	if (valueHistoryData) {
		overviewCharts.push(
			<LineChartButton
				label={__("Net Value")}
				unit={"€"}
				data={valueHistoryData}
				onPress={() => {
					openChartSheet(
						'',
						<LineChart
							id={`${account._id.toString()}-value-chart`}
							label={__("Net Value")}
							unit={"€"}
							data={valueHistoryData}
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

	if (returnHistoryData) {
		overviewCharts.push(
			<LineChartButton
				label={__("Return")}
				unit={"€"}
				data={returnHistoryData}
				onPress={() => {
					openChartSheet(
						'',
						<LineChart
							id={`${account._id.toString()}-return-chart`}
							label={__("Return")}
							unit={"€"}
							data={returnHistoryData}
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

	if (dividendHistoryData) {
		overviewCharts.push(
			<LineChartButton
				label={__("Dividend")}
				unit={"€"}
				data={dividendHistoryData}
				onPress={() => {
					openChartSheet(
						'',
						<LineChart
							id={`${account._id.toString()}-dividend-chart`}
							label={__("Dividend")}
							unit={"€"}
							data={dividendHistoryData}
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

	if (loanHistoryData) {
		overviewCharts.push(
			<LineChartButton
				label={__("Debt")}
				unit={"€"}
				data={loanHistoryData.map(data => {
					return {
						...data,
						value: -data.value
					}
				})}
				onPress={() => {
					openChartSheet(
						'',
						<LineChart
							id={`${account._id.toString()}-loan-chart`}
							label={__("Debt")}
							unit={"€"}
							data={loanHistoryData.map(data => {
								return {
									...data,
									value: -data.value
								}
							})}
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
		<View style={styles.container}>
			<Header
				title={name}
				left={<BackButton />}
				right={
					<ConditionalView
						condition={isSelecting}
						initialValues={{
							scaleX: 0.5,
							scaleY: 0.5
						}}>
						<IconButton
							icon={'trash'}
							onPress={() => { removeObjects(selectedType, selectedObjects).then(validate) }} />
					</ConditionalView>
				}
				showDivider={false}>
				<Grid
					columns={4}
					items={values} />
			</Header>

			<TabsProvider>
				<Tab label={__('Overview')}>
					<View style={[
						styles.contentContainer,
						styles.overviewContainer
					]}>
						<Value
							label={__('Balance')}
							value={prettifyNumber(balance, 0)}
							unit="€"
							isVertical
							valueStyle={styles.value} />
						<Grid columns={2} items={overviewCharts} />
					</View>
				</Tab>
				<Tab label={__('Holdings')}>
					<View style={styles.contentContainer}>
						<FABProvider side='left' insets={insets}>
							<ItemList
								id={`list-account-${account._id}-holdings`}
								noItemsText={__('No Holdings')}
								data={holdings.map(holding => {
									return {
										item: holding,
										renderItem: <HoldingItem holding={holding} />
									}
								})}
								sortingContainerStyle={{ marginBottom: insets.bottom }}
								sortingOptions={[
									SortingTypes.name,
									SortingTypes.highestReturn,
									SortingTypes.lowestReturn,
									SortingTypes.highestValue
								]} />
						</FABProvider>
					</View>
				</Tab>
				<Tab label={__('Transactions')}>
					<View style={styles.contentContainer}>
						<FABProvider side='left' insets={insets}>
							<ItemList
								id={`list-account-${account._id}-transactions`}
								noItemsText={__('No Transactions')}
								data={[
									...transactions,
									...holdings.flatMap(holding => {
										return [...holding.transactions]
									})
								].map(transaction => {
									return {
										item: transaction,
										renderItem: (
											<TransactionItem
												transaction={transaction}
												onPressSelect={onPressSelectTransaction}
												onLongPress={onLongPressTransaction}
												isSelectable={canSelect('Transaction') && isSelecting}
												isSelected={hasObject(transaction)}
												showHolding />
										)
									}
								})}
								sortingContainerStyle={{ marginBottom: insets.bottom }}
								sortingOptions={[
									SortingTypes.newestFirst,
									SortingTypes.oldestFirst
								]} />
						</FABProvider>
					</View>
				</Tab>
			</TabsProvider>
		</View>
	)
}

export default AccountView;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	},
	overviewContainer: {
		paddingVertical: Spacing.md,
		gap: Spacing.md,
	},
	value: {
		fontSize: FontSize.lg,
		fontWeight: FontWeight.bold,
	},
	fabAction: {
		marginBottom: Spacing.xl,
	}
});