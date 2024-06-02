import React from 'react';
import { Appearance, ColorSchemeName, StyleSheet, View } from 'react-native';
import Realm from 'realm';
import { useUser } from '@realm/react';

import { GlobalStyles, Spacing } from '../../constants';
import { Header, Icon } from '../../components/ui';
import { IconButton } from '../../components/buttons';
import { Select } from '../../components/inputs';
import { useStorage } from '../../hooks/useStorage';
import { useI18n, Languages } from '../../components/contexts/I18nContext';

const Accounts: React.FC = () => {
	const { setData } = useStorage();
	const { __, currentLang, languages, setLang } = useI18n();
	const user: Realm.User = useUser();
	
	const onSetColorMode = ( value: ColorSchemeName ) => {
		Appearance.setColorScheme( value );
		setData( '@settings/colorMode', value );
	}

	const onSetLanguage = ( value: keyof Languages ) => {
		setLang( value );
	}

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
					label={ __( 'Color Mode' ) }
					value={ Appearance.getColorScheme() }
					options={ [
						{ value: 'dark', label: __( 'Dark' ), icon: ( props ) => <Icon name={ 'moon' } { ...props } /> },
						{ value: 'light', label: __( 'Light' ), icon: ( props ) => <Icon name={ 'sunny' } { ...props } /> }
					] }
					setValue={ onSetColorMode } />
					
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
