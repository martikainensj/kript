import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native"
import { router } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { BackButton, IconButton } from "../../components/buttons";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";
import TransactionItem from "../../components/transactions/TransactionItem";
import { prettifyNumber } from "../../helpers";
import { Value } from "../../components/ui/Value";
import { Header } from "../../components/ui/Header";
import { Grid } from "../../components/ui/Grid";
import { ItemList } from "../../components/ui/ItemList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Holding } from "../../models/Holding";
import { useHolding } from "../../hooks/useHolding";
import { useSelector } from "../../hooks/useSelector";
import { Transaction } from "../../models/Transaction";
import { LineChart } from "../charts/LineChart";
import { LineChartButton } from "../buttons/LineChartButton";
import ConditionalView from "../ui/ConditionalView";
import { useI18n } from "../../features/i18n/I18nContext";
import { useData } from "../../features/data/DataContext";
import { useUser } from "../../features/realm/useUser";
import { useSorting } from "../../features/data/useSorting";
import { useCharts } from "../../features/charts/useCharts";
import { TabsProvider } from "../../features/tabs/TabsContext";
import { Tab } from "../../features/tabs/Tab";
import { FAB } from "../../features/fab/FAB";
import { Action } from "../../constants/types";
import { useBottomSheet } from "../../features/bottomSheet/BottomSheetContext";

interface HoldingViewProps {
	holding: Holding;
}

const HoldingView: React.FC<HoldingViewProps> = ({ holding }) => {
	const { getAccountBy, saveHolding, removeObjects, addTransaction, getTransactions } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const account = getAccountBy("_id", holding.account_id);
	const transactions = getTransactions({ accountId: holding.account_id, holdingId: holding._id });
	const { show, dismiss } = useBottomSheet();
	const { SortingTypes } = useSorting();
	const { TimeframeTypes } = useCharts();
	const insets = useSafeAreaInsets();
	const { isSelecting, select, deselect, selectedType, selectedObjects, validate, hasObject, canSelect } = useSelector();

	useHolding({ holding });

	const onLongPressTransaction = useCallback((transaction: Transaction) => {
		!isSelecting && select("Transaction", transaction);
	}, []);

	const onPressSelectTransaction = useCallback((transaction: Transaction) => {
		hasObject(transaction)
			? deselect(transaction)
			: select("Transaction", transaction);
	}, [selectedObjects]);

	const actions = useMemo(() => {
		return [
			{
				icon: "receipt-outline",
				label: __("Add Transaction"),
				onPress: () => {
					show({
						children: (
							<TransactionForm
								label={__("New transaction")}
								transaction={{
									owner_id: user.id,
									date: Date.now(),
									price: null,
									amount: null,
									total: null,
									holding_name: holding.name,
									account_id: account._id,
									type: "trading",
									sub_type: "buy"
								}}
								account={account}
								onSubmit={(transaction) => {
									addTransaction(transaction).then(dismiss);
								}}
							/>
						)
					})
				}
			},
			{
				label: __("Edit"),
				icon: "create-outline",
				onPress: () => {
					show({
						children: (
							<HoldingForm
								label={__("Edit holding")}
								holding={holding}
								onSubmit={holding => {
									saveHolding(holding).then(dismiss)
								}}
							/>
						)
					})
				}
			},
			{
				label: __("Remove"),
				icon: "trash-outline",
				onPress: () => {
					removeObjects("Holding", [holding]).then(router.back)
				}
			},
		] as Action[];
	}, [holding, account]);

	if (!holding?.isValid()) {
		router.back();
		return;
	}

	const { name, amount, value, returnValue, returnPercentage, valueHistoryData, returnHistoryData, feesHistoryData } = holding;

	const values = [
		<Value
			label={__("Amount")}
			value={prettifyNumber(amount)}
			isVertical={true} />,
		<Value
			label={__("Value")}
			value={prettifyNumber(value)}
			unit={"€"}
			isVertical={true} />,
		<Value
			label={__("Return")}
			value={prettifyNumber(returnValue)}
			unit={"€"}
			isVertical={true}
			isPositive={returnValue > 0}
			isNegative={returnValue < 0} />,
		<Value
			label={__("Return")}
			value={prettifyNumber(returnPercentage)}
			unit={"%"}
			isVertical={true}
			isPositive={returnPercentage > 0}
			isNegative={returnPercentage < 0} />,
	];

	const charts = [];

	if (returnHistoryData) {
		charts.push(
			<LineChartButton
				label={__("Return")}
				unit={"€"}
				data={returnHistoryData}
				onPress={() => {
					show({
						children: (
							<LineChart
								id={`${holding._id.toString()}-return-chart`}
								label={__("Return")}
								unit={"€"}
								data={returnHistoryData}
								timeframeOptions={[
									TimeframeTypes.ytd,
									TimeframeTypes["1year"],
									TimeframeTypes["3year"],
									TimeframeTypes["5year"],
									TimeframeTypes.max
								]}
								style={{ marginHorizontal: -Spacing.md }}
							/>
						)
					});
				}}
			/>
		)
	}

	if (feesHistoryData) {
		charts.push(
			<LineChartButton
				label={__("Fees")}
				unit={"€"}
				data={feesHistoryData}
				onPress={() => {
					show({
						children: (
							<LineChart
								id={`${holding._id.toString()}-fees-chart`}
								label={__("Fees")}
								unit={"€"}
								data={feesHistoryData}
								timeframeOptions={[
									TimeframeTypes.ytd,
									TimeframeTypes["1year"],
									TimeframeTypes["3year"],
									TimeframeTypes["5year"],
									TimeframeTypes.max
								]}
								style={{ marginHorizontal: -Spacing.md }}
							/>
						)
					});
				}}
			/>
		)
	}

	return (
		<View style={styles.container}>
			<FAB actions={actions}>
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
								icon={"trash"}
								onPress={() => { removeObjects(selectedType, selectedObjects).then(validate) }} />
						</ConditionalView>
					}
					showDivider={false}>
					<Grid
						columns={4}
						items={values} />
				</Header>

				<TabsProvider>
					<Tab label={__("Overview")}>
						<View style={styles.contentContainer}>
							<Grid columns={2} items={charts} style={styles.gridContainer} />
						</View>
					</Tab>
					<Tab label={__("Transactions")}>
						<View style={styles.contentContainer}>
							<ItemList
								id={`list-holding-${holding._id}-transactions`}
								noItemsText={__("No Transactions")}
								data={transactions.map(transaction => {
									return {
										item: transaction,
										renderItem: (
											<TransactionItem
												transaction={transaction}
												onPressSelect={onPressSelectTransaction}
												onLongPress={onLongPressTransaction}
												isSelectable={canSelect("Transaction") && isSelecting}
												isSelected={hasObject(transaction)} />
										)
									}
								})}
								sortingContainerStyle={{ marginBottom: insets.bottom }}
								sortingOptions={[
									SortingTypes.newestFirst,
									SortingTypes.oldestFirst
								]} />
						</View>
					</Tab>
				</TabsProvider>
			</FAB>
		</View>
	)
}

export default HoldingView;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.slice,
	},
	gridContainer: {
		paddingTop: Spacing.md
	},
	fabAction: {
		marginBottom: Spacing.xl,
	}
});