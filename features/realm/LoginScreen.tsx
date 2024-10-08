import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthOperationName, useAuth, useEmailPasswordAuth } from '@realm/react';

import { GlobalStyles, Spacing, IconSize } from '../../constants';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../../features/theme/ThemeContext';
import { useI18n } from '../../features/i18n/I18nContext';
import { useAlert } from '../../features/alerts/AlertContext';
import { Header } from '../../components/ui/Header';
import { TextInput } from '../../components/inputs';
import { DefaultButton } from '../../components/buttons';
import { Icon } from '../../components/ui/Icon';

export const LoginScreen = () => {
	const { theme } = useTheme();
	const { __ } = useI18n();
	const { result, logInWithEmailPassword } = useAuth();
	const { register } = useEmailPasswordAuth();
	const { show } = useAlert();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const insets = useSafeAreaInsets();
	const hasError = !!result?.error?.operation;

	const handleDismissKeyboard = () => {
		Keyboard.dismiss();
	};

	// Automatically log in after registration
	useEffect(() => {
		if (result.success && result.operation === AuthOperationName.Register) {
			logInWithEmailPassword({ email, password });
		}
	}, [result, logInWithEmailPassword, email, password]);

	useEffect(() => {
		if (!hasError) {
			return;
		}

		const { title, message } = (() => {
			switch (result?.error?.operation) {
				case AuthOperationName.LogInWithEmailPassword:
					return {
						title: __('Login failed'),
						message: __('Please check your username and password and try again.')
					}
				case AuthOperationName.Register:
					return {
						title: __('Registration failed'),
						message: __('Please check the information you provided and try again.')
					}
				default:
					break;
			}
		})();

		show({
			title,
			message,
			type: 'dismiss',
			params: {
				onDismiss: () => { }
			}
		})
	}, [hasError]);

	return (
		<TouchableWithoutFeedback onPress={handleDismissKeyboard}>
			<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
				<Header title={__('Welcome to')} >
					<Image style={styles.logo} source={require('../../assets/KriptLogo.png')} />
				</Header>
				<View style={styles.contentContainer}>
					<View style={styles.inputsContainer}>
						<TextInput
							label={__('Email')}
							value={email}
							onChangeText={(value) => setEmail(value.toString())}
							autoComplete={'email'}
							textContentType={'emailAddress'}
							autoCapitalize={'none'}
							autoCorrect={false}
							placeholder={`${__('Example')}: johndoe@example.com`} />

						<TextInput
							label={__('Password')}
							value={password}
							onChangeText={(value) => setPassword(value.toString())}
							secureTextEntry
							autoComplete={'password'}
							textContentType={'password'}
							placeholder={__('Password')} />
					</View>

					<View style={[
						styles.buttonsContainer,
						{
							paddingBottom: insets.bottom,
							backgroundColor: theme.colors.background,
							borderTopWidth: StyleSheet.hairlineWidth,
							borderColor: theme.colors.outlineVariant
						}
					]}>
						{result.pending && <ActivityIndicator />}
						
						{!result.pending && (
							<DefaultButton
								icon={({ color }) => <Icon name={'log-in-outline'} size={IconSize.lg} color={color} />}
								onPress={() => logInWithEmailPassword({ email, password })}
								disabled={result.pending}
								style={styles.button}>
								{__('Login')}
							</DefaultButton>
						)}

						{!result.pending && (
							<DefaultButton
								icon={({ size, color }) => <Icon name={'person-add'} color={color} />}
								onPress={() => register({ email, password })}
								disabled={result.pending}
								style={styles.button}
								mode={'contained-tonal'}>
								{__('Sign up')}
							</DefaultButton>
						)}
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
	},

	logo: {
		height: 32,
		objectFit: 'contain',
		aspectRatio: 251 / 51,
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
		...GlobalStyles.gutter,
		flexDirection: 'row',
		gap: Spacing.md,
		paddingVertical: Spacing.md,
		justifyContent: 'center',
		alignSelf: 'stretch',
		alignItems: 'flex-end'
	},

	button: {
		flex: 1
	}
});
