import React, { useLayoutEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { Header, Icon } from '../../components/ui';
import { IconButton } from '../../components/buttons';
import { Select } from '../../components/inputs';
import { useI18n, Languages } from '../../components/contexts/I18nContext';
import { useTheme } from '../../components/contexts/ThemeContext';
import { useBottomSheet } from '../../components/contexts/BottomSheetContext';
import { UserInfo } from '../../components/user/UserInfo';
import { useUser } from '../../hooks/useUser';

const Accounts: React.FC = () => {
	const { setColorScheme, setSourceColor, colorScheme, sourceColor, defaultSourceColor } = useTheme();
	const { openBottomSheet } = useBottomSheet();
	const { __, currentLang, languages, setLang } = useI18n();
	const { refreshData: refreshUserData } = useUser();

	const onSetLanguage = ( value: keyof Languages ) => {
		setLang( value );
	}

	useLayoutEffect( () => {
		refreshUserData();
	}, [] );

	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Settings' ) }
				right={ ( 
					<IconButton
						icon={ 'person-outline' }
						onPress={ () => {
							openBottomSheet(
								__( 'User' ),
								<UserInfo />
							)
						}} />
	 			) } />
			<View style={ styles.contentContainer }>
				<Select
					label={ __( 'Color Scheme' ) }
					value={ colorScheme }
					options={ [
						{ value: 'dark', label: __( 'Dark' ), icon: ( props ) => <Icon name={ 'moon' } { ...props } /> },
						{ value: 'light', label: __( 'Light' ), icon: ( props ) => <Icon name={ 'sunny' } { ...props } /> }
					] }
					setValue={ setColorScheme } />

				{ Platform.OS === 'android' && (
					<Select
						label={ __( 'Color' ) }
						value={ sourceColor }
						options={ [
							{ value: defaultSourceColor, label: __( 'Default' ) },
							{ value: '', label: __( 'System' ) },
						] }
						setValue={ setSourceColor } />
				) }
					
				<Select
					label={ __( 'Language' ) }
					value={ currentLang }
					options={ languages.map( language => {
						return { label: language.name, value: language.id }
					} ) }
					setValue={ onSetLanguage } />
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
		gap: Spacing.md,
		paddingTop: Spacing.md
	}
} );
