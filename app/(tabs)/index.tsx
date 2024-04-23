import React from 'react';
import { useAuth } from '@realm/react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { IconButton } from '../../components/buttons';
import { __ } from '../../helpers';
import { Header, Icon } from '../../components/ui';


const Home: React.FC = () => {
	const { logOut } = useAuth();
	
	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Home' ) }
				right={ (
					<IconButton
						onPress={ logOut }
						icon={ ( { color } ) => 
							<Icon name={ 'log-out-outline' } color={ color } />
						} />
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
		paddingTop: Spacing.md
	}
} );
