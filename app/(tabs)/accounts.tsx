import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Realm from 'realm';

import { GlobalStyles } from '../../constants';
import { AccountItem, AccountForm } from '../../components/accounts';
import { IconButton } from '../../components/buttons';
import { Header } from '../../components/ui/Header';
import { ItemList } from '../../components/ui/ItemList';
import { router, useFocusEffect } from 'expo-router';
import { useI18n } from '../../features/i18n/I18nContext';
import { useUser } from '../../features/realm/useUser';
import { useData } from '../../features/data/DataContext';
import { useSorting } from '../../features/data/useSorting';
import { animateIn, animateOut } from '../../features/animations/animate';
import { useBottomSheet } from '../../features/bottomSheet/BottomSheetContext';

const Accounts: React.FC = () => {
	const { getAccounts, addAccount } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const focusAnim = useRef(new Animated.Value(0)).current;

	const accounts = getAccounts();
	const { show, dismiss } = useBottomSheet();
	const { SortingTypes } = useSorting();

	const onPressAdd = () => {
		show({
			children: (
				<AccountForm
					label={__("New account")}
					account={{
						_id: new Realm.BSON.UUID(),
						owner_id: user.id,
						name: '',
					}}
					onSubmit={(account) => {
						addAccount(account).then(() => {
							router.navigate({
								pathname: 'accounts/[account]',
								params: {
									accountId: account._id.toString(),
									name: account.name
								}
							});

							dismiss();
						});
					}}
				/>
			)
		});
	}

	useFocusEffect(
		React.useCallback(() => {
			animateIn({
				animation: focusAnim
			}); // Start fade-in animation when the screen is focused

			// Return a cleanup function to reset opacity when screen loses focus
			return () => animateOut({
				animation: focusAnim
			});
		}, []) // Empty dependency array to ensure this only runs on focus/blur
	);

	return (
		<Animated.View style={[
			styles.container,
			{
				opacity: focusAnim,
				transform: [
					{translateY: focusAnim.interpolate({
						inputRange: [0, 1],
						outputRange: [4, 0]
					})},
					{scale: focusAnim.interpolate({
						inputRange: [0, 1],
						outputRange: [0.99, 1]
					})}
				]
			}
		]}>
			<Header
				title={__('Accounts')}
				right={(
					<IconButton
						onPress={onPressAdd}
						icon={'add'}
					/>
				)}
			/>
			<View style={styles.content}>
				<ItemList
					id='list-accounts'
					noItemsText={__('No accounts')}
					data={accounts.map(account => {
						if (!account.isValid()) return;

						return {
							item: account,
							renderItem: <AccountItem account={account} />
						}
					})}
					sortingOptions={[
						SortingTypes.name,
						SortingTypes.highestReturn,
						SortingTypes.lowestReturn,
						SortingTypes.highestValue
					]}
				/>
			</View>
		</Animated.View>
	);
};

export default Accounts;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},
	content: {
		...GlobalStyles.container,
		...GlobalStyles.slice
	},
});
