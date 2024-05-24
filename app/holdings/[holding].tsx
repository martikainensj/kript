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
import { TransferForm } from "../../components/transfers/TransferForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";


const HoldingPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ id: string, account_id: string }>();
	const id = parseInt( params.id );
	const account_id = new Realm.BSON.ObjectID( params.account_id );
	const user: Realm.User = useUser();
	const { holding, saveHolding, removeHolding, account, addTransaction, addTransfer }
		= useHolding( { id, account_id } );
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
						<HoldingForm
							holding={ holding }
							onSubmit={ holding => {
								saveHolding( holding ).then( closeBottomSheet ) }
							} />
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
			},
			{
				icon: ( props ) => { return (
					<Icon name={ 'swap-horizontal-outline' } { ...props } />
				) },
				label: __( 'Add Dividend' ),
				onPress: () => {
					openBottomSheet();
					setTitle( __( 'New Dividend' ) );
					setContent(
						<TransferForm
							transfer={ {
								account_id: account._id,
								owner_id: user.id,
								date: Date.now(),
								amount: null,
								holding_name: holding.name
							} }
							account={ account }
							onSubmit={ ( transfer ) => {
								addTransfer( transfer ).then( closeBottomSheet );
							}	} />
					);
				}
			}
		])
	}, [ account ] );

	if ( ! holding.isValid() ) {
		router.back();
		return;
	}

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