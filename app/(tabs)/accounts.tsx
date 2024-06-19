import React from 'react';
import { StyleSheet, View } from 'react-native';
import Realm from 'realm';

import { GlobalStyles } from '../../constants';
import { AccountItem, AccountForm  } from '../../components/accounts';
import { IconButton} from '../../components/buttons';
import { useAccounts } from '../../hooks';
import { useBottomSheet } from '../../components/contexts/BottomSheetContext';
import { useI18n } from '../../components/contexts/I18nContext';
import { useUser } from '../../hooks/useUser';
import { Header } from '../../components/ui/Header';
import { ItemList } from '../../components/ui/ItemList';

const Accounts: React.FC = () => {
	const { user } = useUser();
	const { __ } = useI18n();
	
	const { accounts, addAccount } = useAccounts();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();

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
					data={ [ ...accounts ] } />
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
