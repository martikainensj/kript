import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import Realm from "realm";
import { useUser } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../localization";
import { useHolding } from "../../hooks";
import { Header, Icon } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { FABProvider, useFAB } from "../../components/contexts";
import { TransactionForm } from "../../components/transactions/TransactionForm";


const HoldingPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ name: string, account_id: string }>();
	const name = params.name;
	const account_id = new Realm.BSON.ObjectID( params.account_id );
	const user: Realm.User = useUser();

	const { holding, removeHolding, account, addTransaction } = useHolding( {
		holding: {
			name,
			account_id,
			owner_id: user.id
		}
	} );

	const { openMenu } = useMenu();
	const { setActions } = useFAB();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();

	const onPressOptions = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					openBottomSheet();
					setTitle( __( 'Edit Holding' ) );
					setContent(
						<Text>Todo</Text>
					);
				}
			},
			{
				title: __( 'Remove' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'trash' } color={ color } />,
				onPress: () => {
					removeHolding().then( router.back	)
				}
			}
		];

		openMenu( anchor, menuItems );
	}, [ holding, account ] );

	useEffect( () => {
		setActions( [
			{
				icon: ( { color, size } ) => { return (
					<Icon name={ 'pricetag' } size={ size } color={ color } />
				) },
				label: __( 'Add Transaction' ),
				onPress: () => {
					openBottomSheet();
					setTitle( __( 'New Transaction' ) );
					setContent(
						<TransactionForm
							transaction={ {
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: holding.name
							} }
							account={ account }
							onSubmit={ ( transaction ) => {
								addTransaction( transaction ).then( closeBottomSheet );
							}	} />
					);
				}
			}
		])
	}, [ account ] );
	
	return (
		<View style={ styles.container }>
			<FABProvider>
				<Header
					title={ holding?.name }
					left={ <BackButton /> }
					right={ <IconButton
						icon={ 'ellipsis-vertical' }
						onPress={ onPressOptions } />
					} />
					<View style={ styles.contentContainer }>
						<Text>{ JSON.stringify( holding ) }</Text>
					</View>
			</FABProvider>
		</View>
	)
}

export default HoldingPage;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md
	}
} );