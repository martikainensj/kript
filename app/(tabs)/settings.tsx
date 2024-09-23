import React, { useLayoutEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { IconButton } from '../../components/buttons';
import { Select } from '../../components/inputs/Select';
import { useI18n, Languages } from '../../contexts/I18nContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useBottomSheet } from '../../contexts/BottomSheetContext';
import { UserInfo } from '../../components/user/UserInfo';
import { useUser } from '../../hooks/useUser';
import { Toggle } from '../../components/inputs/Toggle';
import { Header } from '../../components/ui/Header';
import themes from '../../themes';

const Accounts: React.FC = () => {
	const { setColorScheme, setSelectedTheme, colorScheme, selectedTheme } = useTheme();
	const { openBottomSheet } = useBottomSheet();
	const { __, currentLang, languages, setLang } = useI18n();
	const { refreshData: refreshUserData } = useUser();

	const onSetLanguage = ( value: keyof Languages ) => {
		setLang( value );
	}
	
	const colorSchemeHanlder = ( isDarkMode: boolean ) => {
		setColorScheme( isDarkMode ? 'dark' : 'light' );
	}

	useLayoutEffect( () => {
		refreshUserData();
	}, [] );

	return (
		<View style={ styles.container }>
			<Header
				title={ __( 'Settings' ) }
				right={ (
					<View style={ styles.rightContainer }>
						<Toggle
							value={ colorScheme === 'dark' ?? false }
							activeIcon={ 'moon' }
							inactiveIcon={ 'sunny' }
							setValue={ colorSchemeHanlder} />
						<IconButton
							icon={ 'person-outline' }
							onPress={ () => {
								openBottomSheet(
									__( 'User' ),
									<UserInfo />
								)
							}} />
					</View>
				) } />
				
			<View style={ styles.contentContainer }>
				{
					<Select
						label={ __( 'Color' ) }
						value={ selectedTheme }
						options={ Object.keys(themes).map( theme => {
							return {
								value: theme,
								label: __( theme )
							}
						}) }
						setValue={ setSelectedTheme } />
				}
					
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
	rightContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: Spacing.sm
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
		gap: Spacing.md,
		paddingTop: Spacing.md
	}
} );
