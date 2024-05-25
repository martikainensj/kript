import React from 'react';
import { StyleSheet, View } from 'react-native';
import Realm from 'realm';
import { useUser } from '@realm/react';

import { GlobalStyles, Spacing } from '../../constants';
import { __ } from '../../localization';
import { Header } from '../../components/ui';
import { useBottomSheet } from '../../components/contexts';
import { IconButton } from '../../components/buttons';

const Accounts: React.FC = () => {
	const user: Realm.User = useUser();
	
	const { openBottomSheet, closeBottomSheet, setTitle, setContent } = useBottomSheet();

	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Settings' ) }
				right={ ( 
					<IconButton
						icon={ 'person-outline' } />
	 			) } />
			<View style={ styles.contentContainer }>
				
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
