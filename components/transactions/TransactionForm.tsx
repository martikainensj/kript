import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";

import { IconButton } from "../buttons";
import { DateInput, HoldingInput } from "../inputs";
import { GlobalStyles, IconSize } from "../../constants";
import { Transaction } from "../../models/Transaction";
import { Account } from "../../models/Account";
import { allSet, stripRealmListsFromObject } from "../../helpers";
import { OptionProps, Select } from "../inputs/Select";
import { Icon } from "../ui/Icon";
import { useI18n } from "../../features/i18n/I18nContext";
import { useData } from "../../features/data/DataContext";
import { useCategories } from "../../features/data/useCategories";
import { CashCategory, LoanCategory, TradingCategory } from "../../features/data/types";
import { TextInput } from "../inputs/TextInput";
import { Text } from "../ui/Text";

interface TransactionFormProps {
	label?: string;
	transaction: Partial<Transaction>,
	account?: Account,
	onSubmit: (transaction: Transaction) => void;
}

export const TransactionForm = ({
	label,
	transaction,
	account,
	onSubmit
}: TransactionFormProps) => {
	const { __ } = useI18n();
	const { TransactionCategories, TradingCategories, CashCategories, LoanCategories } = useCategories();
	const { getHoldingBy } = useData();
	const [trading, cash, adjustment] = TransactionCategories;
	const [buy, sell] = TradingCategories;
	const [deposit, withdrawal, dividend] = CashCategories;
	const [repayment, disbursement] = LoanCategories;

	const [editedTransaction, setEditedTransaction]
		= useState({ ...transaction });

	const initialTransaction = {
		...editedTransaction,
		holding_name: undefined,
		amount: undefined,
		notes: undefined,
		price: undefined,
		total: undefined,
	} as Transaction;

	const { date, price, amount, total, holding_name, notes, type, sub_type } = {
		...editedTransaction,
		amount: editedTransaction.amount && Math.abs(editedTransaction.amount),
		total: editedTransaction.total && Math.abs(editedTransaction.total),
	};

	const subTypes = useMemo(() => {
		switch (type) {
			case 'trading':
				return TradingCategories;

			case 'cash':
				return CashCategories;

			case 'loan':
				return LoanCategories;

			default:
				return null;
		}
	}, [type]);

	const handleDismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const onSubmitHandler = () => {
		handleDismissKeyboard();
		onSubmit(stripRealmListsFromObject({
			...editedTransaction,
			amount: amount && (
				sub_type === sell.id || sub_type === withdrawal.id
					? -amount
					: Math.abs(amount)
			),
			total: total && (
				sub_type === sell.id
					? -total
					: Math.abs(total)
			)
		}) as Transaction)
	}

	useEffect(() => {
		setEditedTransaction({ ...transaction });
	}, [transaction]);

	useEffect(() => {
		if (!!transaction._id) {
			return;
		}

		const initializedTransaction = { ...initialTransaction };

		if (subTypes?.length) {
			Object.assign(initializedTransaction, { sub_type: subTypes[0].id })
		}

		setEditedTransaction(initializedTransaction);
	}, [subTypes]);

	useEffect(() => {
		if (type === 'adjustment') {
			const holding = getHoldingBy('name', holding_name, { accountId: account._id });

			setEditedTransaction({
				...editedTransaction,
				price: holding?.lastPrice,
				amount: holding?.amount
			});
		}
	}, [holding_name]);

	return (
		<TouchableWithoutFeedback onPress={handleDismissKeyboard}>
			<View style={styles.container}>
				{ label && (
					<Text
						fontSize="md"
					>
						{label}
					</Text>
				)}
				<DateInput
					label={__('Date')}
					value={date}
					setValue={date => setEditedTransaction(
						Object.assign({ ...editedTransaction }, { date })
					)} />

				<Select
					value={type}
					setValue={type => setEditedTransaction(
						Object.assign({ ...editedTransaction }, { type })
					)}
					options={TransactionCategories.map(transactionType => {
						return {
							icon: ({ size, color }) => {
								return (
									<Icon
										name={transactionType.icon}
										size={size}
										color={color} />
								)
							},
							label: transactionType.name,
							value: transactionType.id,
							selectedColor: transactionType.color,
						}
					})}
					disabled={!!transaction._id} />

				{subTypes && <Select
					value={sub_type}
					setValue={sub_type => setEditedTransaction(
						Object.assign({ ...editedTransaction }, { sub_type })
					)}
					options={subTypes.map((subType: TradingCategory | CashCategory | LoanCategory) => {
						return {
							icon: ({ size, color }) => {
								return (
									<Icon
										name={subType.icon}
										size={size}
										color={color} />
								)
							},
							label: subType.name,
							value: subType.id,
							selectedColor: subType.color,
							disabled: !!transaction._id && subType.id === 'dividend'
						} as OptionProps
					})}
					disabled={transaction.sub_type === 'dividend'} />}

				{type === 'trading' && <>
					{account && (
						<HoldingInput
							label={__('Holding')}
							value={holding_name}
							account={account}
							placeholder={`${__('Example')}: Apple Inc`}
							setValue={holding_name => setEditedTransaction(
								Object.assign({ ...editedTransaction }, { holding_name })
							)}
							disabled={!!transaction._id} />
					)}

					<TextInput
						label={__('Price')}
						value={price}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						onChangeText={price => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { price })
						)} />

					<TextInput
						label={__('Amount')}
						value={amount}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						max={(() => {
							const holding = getHoldingBy('name', holding_name, { accountId: account._id })

							return holding?.amount > 0 && sub_type === 'sell'
								? holding.amount
								: 0
						})()}
						onChangeText={amount => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { amount })
						)} />

					<TextInput
						label={__('Total')}
						value={total}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						onChangeText={total => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { total })
						)} />

					{/*<TextInput
						label={ __( 'Notes' ) }
						value={ notes }
						placeholder={ `${ __( 'Enter notes here' ) }...` }
						onChangeText={ notes => setEditedTransaction(
							Object.assign( { ...editedTransaction }, { notes } )
						) }
						multiline={ true } />*/}

					<IconButton
						icon={'save'}
						size={IconSize.lg}
						style={styles.submitButton}
						disabled={!allSet(holding_name, price, amount, total)}
						onPress={onSubmitHandler} />
				</>}

				{type === 'cash' && <>
					{(sub_type === dividend.id && account) &&
						<HoldingInput
							label={__('Holding')}
							value={holding_name}
							account={account}
							placeholder={`${__('Example')}: Apple Inc`}
							setValue={holding_name => setEditedTransaction(
								Object.assign({ ...editedTransaction }, { holding_name })
							)}
							disabled={!!transaction.holding_name} />
					}

					<TextInput
						label={__('Amount')}
						value={amount}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						max={(() => {
							return account.balance > 0 && sub_type === 'withdrawal'
								? account.balance
								: 0
						})()}
						onChangeText={amount => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { amount })
						)} />

					<TextInput
						label={__('Notes')}
						value={notes}
						placeholder={`${__('Enter notes here')}...`}
						onChangeText={notes => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { notes })
						)}
						multiline={true} />

					<IconButton
						icon={'save'}
						size={IconSize.lg}
						style={styles.submitButton}
						disabled={!allSet(amount, (sub_type !== dividend.id || !!holding_name))}
						onPress={onSubmitHandler} />
				</>}

				{type === 'adjustment' && <>
					{account && (
						<HoldingInput
							label={__('Holding')}
							value={holding_name}
							account={account}
							placeholder={`${__('Example')}: Apple Inc`}
							setValue={holding_name => setEditedTransaction(
								Object.assign({ ...editedTransaction }, { holding_name })
							)}
							disabled={!!transaction._id} />
					)}

					<TextInput
						label={__('Adjusted Price')}
						value={price}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						onChangeText={price => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { price })
						)} />

					<TextInput
						label={__('Adjusted Amount')}
						value={amount}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						onChangeText={amount => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { amount })
						)} />

					<TextInput
						label={__('Notes')}
						value={notes}
						placeholder={`${__('Enter notes here')}...`}
						onChangeText={notes => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { notes })
						)}
						multiline={true} />

					<IconButton
						icon={'save'}
						size={IconSize.lg}
						style={styles.submitButton}
						disabled={!allSet(amount || price)}
						onPress={onSubmitHandler} />
				</>}

				{type === 'loan' && <>
					<TextInput
						label={sub_type === 'repayment'
							? __('Repayment amount')
							: __('Loan amount')
						}
						value={amount}
						placeholder={'0'}
						keyboardType={'numeric'}
						inputMode={'decimal'}
						onChangeText={amount => setEditedTransaction(
							Object.assign({ ...editedTransaction }, { amount })
						)} />

					{sub_type === 'repayment' && (
						<TextInput
							label={__('Total')}
							value={total}
							placeholder={'0'}
							keyboardType={'numeric'}
							inputMode={'decimal'}
							onChangeText={total => setEditedTransaction(
								Object.assign({ ...editedTransaction }, { total })
							)} />
					)}

					<IconButton
						icon={'save'}
						size={IconSize.lg}
						style={styles.submitButton}
						disabled={!allSet(amount || (sub_type !== disbursement.id || !!total))}
						onPress={onSubmitHandler} />
				</>}
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.form,
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
});