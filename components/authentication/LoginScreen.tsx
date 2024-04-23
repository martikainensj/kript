import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import { AuthOperationName, useAuth, useEmailPasswordAuth } from '@realm/react';

import AuthenticationErrorMessage from './AuthenticationErrorMessage';
import { DefaultButton } from '../buttons';
import { TextInput } from '../inputs';
import { GlobalStyles, Color, Spacing, IconSize } from '../../constants';
import { __ } from '../../helpers';
import { Header, Icon } from '../ui';

export const LoginScreen = () => {
	const { result, logInWithEmailPassword } = useAuth();
	const { register } = useEmailPasswordAuth();
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');

	const hasError = !! result?.error?.operation;

	// Automatically log in after registration
	useEffect( () => {
		if ( result.success && result.operation === AuthOperationName.Register ) {
			logInWithEmailPassword( { email, password } );
		}
	}, [result, logInWithEmailPassword, email, password] );

	return (
		<SafeAreaView style={ styles.container }>
			<Header
				title={ __( 'Welcome to Kript' ) } />
			<View style={ styles.inputsContainer }>
				<TextInput
					label={ __( 'Email' ) }
					value={ email }
					onChangeText={ setEmail }
					autoComplete={ 'email' }
					textContentType={ 'emailAddress' }
					autoCapitalize={ 'none' }
					autoCorrect={ false }
					placeholder={ `${ __( 'Example' ) }: johndoe@example.com` } />

				<TextInput
					label={ __( 'Password' ) }
					value={ password }
					onChangeText={ setPassword }
					secureTextEntry
					autoComplete={ 'password' }
					textContentType={ 'password' }
					placeholder={ __( 'Password' ) } />
			</View>

			{ hasError && 
				<AuthenticationErrorMessage operationError={ result?.error?.operation } />
			}

			<View style={styles.buttonsContainer}>
				<DefaultButton
					icon={ ( { color } ) => <Icon name={ 'log-in-outline' } size={ IconSize.lg } color={ color } /> }
					onPress={ () => logInWithEmailPassword( { email, password } ) }
					disabled={ result.pending }
					style={ styles.button }>
					{ __( 'Login' ) }
				</DefaultButton>

				<DefaultButton
					icon={ ( { size, color } ) => <Icon name={ 'person-add' } color={ color } /> }
					onPress={ () => register( { email, password } ) }
					disabled={ result.pending }
					style={ [ styles.button, styles.registerButton ] }>
					{ __( 'Register' ) }
				</DefaultButton>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
		alignItems: 'center',
		justifyContent: 'center',
		gap: Spacing.md
	},

	inputsContainer: {
		alignSelf: 'stretch',
		gap: Spacing.sm
	},
	
	buttonsContainer: {
		flexDirection: 'row',
		gap: Spacing.sm,
		flexGrow: 1,
		alignSelf: 'stretch',
		alignItems: 'flex-end'
	},

	button: {
		flex: 1
	},

	registerButton: {
		backgroundColor: Color.accent,
	},
});
