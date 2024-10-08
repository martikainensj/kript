import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { IconButton } from '../../components/buttons';
import { Select } from '../../components/inputs/Select';
import { useBottomSheet } from '../../contexts/BottomSheetContext';
import { UserInfo } from '../../components/user/UserInfo';
import { Toggle } from '../../components/inputs/Toggle';
import { Header } from '../../components/ui/Header';
import { useTheme } from '../../features/theme/ThemeContext';
import { useI18n } from '../../features/i18n/I18nContext';
import { useUser } from '../../features/realm/useUser';

const Accounts: React.FC = () => {
	const { setDark, dark } = useTheme();
	const { openBottomSheet } = useBottomSheet();
	const { __, language, languages, setLanguage } = useI18n();
	const { refresh: refreshUserData } = useUser();

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
							value={ dark }
							activeIcon={ 'moon' }
							inactiveIcon={ 'sunny' }
							setValue={ setDark } />
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
				<Select
					label={ __( 'Language' ) }
					value={ language }
					options={ languages.map( language => {
						return { label: language.name, value: language.id }
					} ) }
					setValue={ setLanguage } />
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
