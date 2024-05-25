import React from 'react';
import { StyleSheet, View } from 'react-native';
import Realm from 'realm';
import { useUser } from '@realm/react';

import { GlobalStyles, Spacing } from '../../constants';
import { __ } from '../../localization';
import { AccountItem, AccountForm  } from '../../components/accounts';
import { IconButton} from '../../components/buttons';
import { Header, ItemList } from '../../components/ui';
import { useAccounts } from '../../hooks';
import { useBottomSheet } from '../../components/contexts';

const Accounts: React.FC = () => {
	const user: Realm.User = useUser();
	
	const { accounts, addAccount } = useAccounts();
	const { openBottomSheet, closeBottomSheet, setTitle, setContent } = useBottomSheet();

	const onPressAdd = () => {
		openBottomSheet();
		setTitle( __( 'New Account' ) );
		setContent(
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
					noItemsTitleText={ __( 'No accounts' ) }
					noItemsDescriptionText={ __( 'Create a new account by clicking the "+" button in the top right corner.' ) }
					items={ accounts.map( account => {
						return <AccountItem id={ account._id }/>
					} ) } />
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
