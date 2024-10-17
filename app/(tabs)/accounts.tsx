import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Realm from 'realm';

import { GlobalStyles } from '../../constants';
import { AccountItem, AccountForm } from '../../components/accounts';
import { IconButton } from '../../components/buttons';
import { useBottomSheet } from '../../contexts/BottomSheetContext';
import { Header } from '../../components/ui/Header';
import { ItemList } from '../../components/ui/ItemList';
import { router, useFocusEffect } from 'expo-router';
import { FABProvider } from '../../contexts/FABContext';
import { useI18n } from '../../features/i18n/I18nContext';
import { useUser } from '../../features/realm/useUser';
import { useData } from '../../features/data/DataContext';
import { useSorting } from '../../features/data/useSorting';
import { animateIn, animateOut } from '../../features/animations/animate';

const Accounts: React.FC = () => {
	const { getAccounts, addAccount } = useData();
	const { user } = useUser();
	const { __ } = useI18n();
	const focusAnim = useRef(new Animated.Value(0)).current;

	const accounts = getAccounts();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { SortingTypes } = useSorting();

	const onPressAdd = () => {
		openBottomSheet(
			__('New Account'),
			<AccountForm
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

						closeBottomSheet();
					});
				}} />
		);
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
				opacity: focusAnim
			}
		]}>
			<Header
				title={__('Accounts')}
				right={(
					<IconButton
						onPress={onPressAdd}
						icon={'add'} />
				)} />
			<View style={styles.contentContainer}>
				<FABProvider side='left'>
					<ItemList
						id='list-accounts'
						title={__('Accounts')}
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
						]} />
				</FABProvider>
			</View>
		</Animated.View>
	);
};

export default Accounts;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},

	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	}
});
