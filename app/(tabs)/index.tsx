import React from 'react';
import { useAuth } from '@realm/react';
import { StyleSheet, View } from 'react-native';

import { GlobalStyles } from '../../constants';
import { IconButton } from '../../components/buttons';
import { confirmation } from '../../helpers';
import { Header } from '../../components/ui';
import { useI18n } from '../../components/contexts/I18nContext';

const Home: React.FC = () => {
	const { logOut } = useAuth();
	const { __ } = useI18n();

	const logOutHandler = () => {
		confirmation( {
			title: __( 'Logout' ),
			message: __( 'Are you sure you want to log out?' ),
			onAccept: logOut
		} );
	}
	
	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Home' ) }
				right={ (
					<IconButton
						onPress={ logOutHandler }
						icon={ 'log-out-outline' } />
	 			) } />
			<View style={ styles.contentContainer }>
			</View>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container
	},

	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	}
} );
