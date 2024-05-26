import React, { useCallback, useEffect } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper";
import Realm from "realm";
import { useUser } from "@realm/react";
import { router, useLocalSearchParams } from "expo-router";

import { GlobalStyles, Spacing } from "../../constants";
import { __ } from "../../localization";
import { useHolding } from "../../hooks";
import { Header, Icon, ItemList } from "../../components/ui";
import { BackButton, IconButton } from "../../components/buttons";
import { MenuItem, useMenu } from "../../components/contexts/MenuContext";
import { useBottomSheet } from "../../components/contexts";
import { FABProvider, useFAB } from "../../components/contexts";
import { TransactionForm } from "../../components/transactions/TransactionForm";
import { TransferForm } from "../../components/transfers/TransferForm";
import { HoldingForm } from "../../components/holdings/HoldingForm";
import TransactionItem from "../../components/transactions/TransactionItem";

const HoldingPage: React.FC = ( {} ) => {
  const params = useLocalSearchParams<{ _id: string, account_id: string }>();
	const _id = new Realm.BSON.UUID( params._id );
	const account_id = new Realm.BSON.UUID( params.account_id );
	const user: Realm.User = useUser();
	const { holding, saveHolding, removeHolding, account, addTransaction, addTransfer }
		= useHolding( { _id, account_id } );
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
					openBottomSheet(
						__( 'Edit Holding' ),
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
					openBottomSheet(
						__( 'New Transaction' ),
						<TransactionForm
							transaction={ {
								_id: new Realm.BSON.UUID(),
								owner_id: user.id,
								date: Date.now(),
								price: null,
								amount: null,
								total: null,
								holding_name: holding.name,
								account_id: account._id
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
					openBottomSheet(
						__( 'New Dividend' ),
						<TransferForm
							transfer={ {
								_id: new Realm.BSON.UUID(),
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
						<ItemList
							title={ __( 'Transactions' ) }
							noItemsTitleText={ __( 'No transactions' ) }
							noItemsDescriptionText={ __( 'Create a new transaction by clicking the "+" button in the bottom right corner.' ) }
							items={ holding.transactions.map( ( transaction ) => {
								return <TransactionItem { ...transaction } />
							} ) } />
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
	}
} );