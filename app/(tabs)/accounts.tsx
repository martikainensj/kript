import React from 'react';
import { StyleSheet, View } from 'react-native';
import Realm from 'realm';

import { GlobalStyles } from '../../constants';
import { AccountItem, AccountForm  } from '../../components/accounts';
import { IconButton} from '../../components/buttons';
import { useAccounts } from '../../hooks';
import { useBottomSheet } from '../../contexts/BottomSheetContext';
import { useI18n } from '../../contexts/I18nContext';
import { useUser } from '../../hooks/useUser';
import { Header } from '../../components/ui/Header';
import { ItemList } from '../../components/ui/ItemList';
import { useTypes } from '../../hooks/useTypes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Accounts: React.FC = () => {
	const { user } = useUser();
	const { __ } = useI18n();
	
	const { accounts, addAccount } = useAccounts();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { SortingTypes } = useTypes();

	const onPressAdd = () => {
		openBottomSheet(
			__( 'New Account' ),
			<AccountForm
				account={ {
					_id: new Realm.BSON.UUID(),
					owner_id: user.id,
					name: '',
				}	}
				onSubmit={ ( account ) => {
					addAccount( account ).then( closeBottomSheet );
				}	} />
		);
	}

	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Accounts' ) }
				right={ ( 
					<IconButton
						onPress={ onPressAdd }
						icon={ 'add' } />
	 			) } />
			<View style={ styles.contentContainer }>
				<ItemList
					title={ __( 'Accounts' ) }
					noItemsText={ __( 'No accounts' ) }
					data={ accounts.map( account => {
						if ( ! account.isValid() ) return;

						return {
							item: account,
							renderItem: <AccountItem account={ account } />
						}
					}) }
					sortingOptions={ [
						SortingTypes.name,
						SortingTypes.highestReturn,
						SortingTypes.lowestReturn,
						SortingTypes.highestValue
					] } />
			</View>
		</View>
	);
};

export default Accounts;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container
	},

	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	}
} );
