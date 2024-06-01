import React from 'react';
import { Appearance, Platform, StyleSheet, View } from 'react-native';
import Realm from 'realm';
import { useUser } from '@realm/react';

import { GlobalStyles, Spacing } from '../../constants';
import { __ } from '../../localization';
import { Header, Icon } from '../../components/ui';
import { useBottomSheet } from '../../components/contexts';
import { IconButton } from '../../components/buttons';
import { Select } from '../../components/inputs';

const Accounts: React.FC = () => {
	const user: Realm.User = useUser();
	
	const { openBottomSheet, closeBottomSheet, setTitle, setContent } = useBottomSheet();
	const colorSchemeOptions = [
		{ value: 'dark', label: __( 'Dark' ), icon: ( props ) => <Icon name={ 'moon' } { ...props } /> },
		{ value: 'light', label: __( 'Light' ), icon: ( props ) => <Icon name={ 'sunny' } { ...props } /> }
	];

	
	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Settings' ) }
				right={ ( 
					<IconButton
						icon={ 'person-outline' } />
	 			) } />
			<View style={ styles.contentContainer }>
				<Select
					value={ Appearance.getColorScheme() }
					options={ colorSchemeOptions }
					setValue={ Appearance.setColorScheme } />
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
