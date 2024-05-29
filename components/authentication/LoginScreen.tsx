import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthOperationName, useAuth, useEmailPasswordAuth } from '@realm/react';

import AuthenticationErrorMessage from './AuthenticationErrorMessage';
import { DefaultButton } from '../buttons';
import { TextInput } from '../inputs';
import { GlobalStyles, Spacing, IconSize, Theme } from '../../constants';
import { __ } from '../../localization';
import { Header, Icon } from '../ui';

export const LoginScreen = () => {
	const { result, logInWithEmailPassword } = useAuth();
	const { register } = useEmailPasswordAuth();
	const [ email, setEmail ] = useState( '' );
	const [ password, setPassword ] = useState( '' );

	const insets = useSafeAreaInsets();
	const hasError = !! result?.error?.operation;

	const handleDismissKeyboard = ( ) => {
    Keyboard.dismiss();
  };

	// Automatically log in after registration
	useEffect( () => {
		if ( result.success && result.operation === AuthOperationName.Register ) {
			logInWithEmailPassword( { email, password } );
		}
	}, [result, logInWithEmailPassword, email, password] );

	return (
    <TouchableWithoutFeedback onPress={ handleDismissKeyboard }>
			<View style={ styles.container }>
				<Header title={ __( 'Welcome to' ) } >
					<Image style={ styles.logo } source={require('../../assets/KriptLogo.png')} />
				</Header>
				<View style={ styles.contentContainer }>
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

						{ hasError && 
							<AuthenticationErrorMessage operationError={ result?.error?.operation } />
						}
					</View>

					<View style={ [
						styles.buttonsContainer,
						{ paddingBottom: insets.bottom }
					] }>
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
							style={ styles.button	}
							mode={ 'contained-tonal' }>
							{ __( 'Sign up' ) }
						</DefaultButton>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
		backgroundColor: Theme.colors.background
	},

	logo: {
		height: 32,
		objectFit: 'contain',
		aspectRatio: 251/51,
		alignSelf: 'flex-start'
	},

	contentContainer: {
		...GlobalStyles.container,
		paddingVertical: Spacing.md,
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: Spacing.md
	},

	inputsContainer: {
		...GlobalStyles.gutter,
		gap: Spacing.sm,
		alignSelf: 'stretch'
	},
	
	buttonsContainer: {
		...GlobalStyles.footer,
		...GlobalStyles.gutter,
		flexDirection: 'row',
		gap: Spacing.md,
		paddingVertical: Spacing.md,
		alignSelf: 'stretch',
		alignItems: 'flex-end'
	},

	button: {
		flex: 1
	}
});
