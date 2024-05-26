import React, { useCallback } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import Realm from "realm";

import { Icon, Row } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { useHolding } from "../../hooks";
import { __ } from "../../localization";
import { MenuItem, useBottomSheet, useMenu } from "../contexts";
import { router } from "expo-router";
import { HoldingForm } from "./HoldingForm";
import { Holding } from "../../models/Holding";

interface HoldingItemProps extends Holding {}

export const HoldingItem: React.FC<HoldingItemProps> = ( { _id, account_id } ) => {
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { holding, saveHolding, removeHolding } = useHolding( { _id, account_id } );

	const onPress = useCallback( () => {
		router.navigate( {
			pathname: 'holdings/[holding]',
			params: { ...holding }
		} );
	}, [ holding ] );

	const onLongPress = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
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
				onPress: removeHolding
			}
		];

		openMenu( anchor, menuItems );
	}, [ holding ] );

	if ( ! holding.isValid() ) return;
	
	return (
		<TouchableRipple
			onPress={ onPress }
			onLongPress={ onLongPress }
			theme={ Theme }>
			<View style={ styles.container}>
				<Row>
					<Text style={ styles.name }>{ holding?.name }</Text>
					<Text>{ holding?.transactions.length }</Text>
				</Row>
			</View>
		</TouchableRipple>
	)
}

export default HoldingItem;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	name: {
		fontWeight: FontWeight.bold
	},
	value: {
		fontWeight: FontWeight.bold
	},
	valueValueStyle: {
		
	}
} );