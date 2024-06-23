
import { AuthOperationName } from '@realm/react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Color, FontSize } from '../../constants';
import { useI18n } from '../../contexts/I18nContext';

interface ErrorMessageProps {
	operationError: AuthOperationName
}

const AuthenticationErrorMessage:React.FC<ErrorMessageProps> = ( props: {
	operationError: AuthOperationName
} ) => {
	const { __ } = useI18n();
	
	let errorMessage = '';

	switch ( props.operationError ) {
		case AuthOperationName.LogInWithEmailPassword:
			errorMessage = __( 'Login failed. Please check your username and password and try again.' )
			break;
		case AuthOperationName.Register:
			errorMessage = __( 'Registration failed. Please check the information you provided and try again.' )
			break;
		default:
			break;
	}

	return (
		<Text style={ [ styles.container ] }>{ errorMessage }</Text>
	)
}

export default AuthenticationErrorMessage;

const styles = StyleSheet.create( {
	container: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Color.error,
  },
} );