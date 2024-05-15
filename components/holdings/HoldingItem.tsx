import React, { useCallback, useMemo } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";

import { Icon, Row } from "../ui";
import { FontWeight, GlobalStyles, Spacing, Theme } from "../../constants";
import { useHolding } from "../../hooks";
import { __ } from "../../helpers";
import { Holding } from "../../models/Holding";
import { MenuItem, useBottomSheet, useMenu } from "../contexts";
import { router } from "expo-router";

interface HoldingItemProps {
	holding: Holding,
}

export const HoldingItem: React.FC<HoldingItemProps> = ( { holding } ) => {
	const { openMenu } = useMenu();
	const { setTitle, setContent, openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { removeHolding } = useHolding( { holding } );

	const {
		name,
		notes,
		transactions,
		owner_id,
		account_id
	} = useMemo( () => {
		return holding
	}, [ holding ] );

	const onPress = () => {
		router.navigate( {
			pathname: 'holdings/[holding]',
			params: { ...holding }
		} );
	};

	const onLongPress = useCallback( ( { nativeEvent }: GestureResponderEvent ) => {
		const anchor = { x: nativeEvent.pageX, y: nativeEvent.pageY };
		const menuItems: MenuItem[] = [
			{
				title: __( 'Edit' ),
				leadingIcon: ( { color } ) => 
					<Icon name={ 'create' } color={ color } />,
				onPress: () => {
					setTitle( __( 'Edit Holding' ) );
					setContent(
						<Text>Todo</Text>
					)

					openBottomSheet();
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

	return (
		<TouchableRipple
			onPress={ onPress }
			onLongPress={ onLongPress }
			theme={ Theme }>
			<View style={ styles.container}>
				<Row>
					<Text style={ styles.name }>{ holding.name }</Text>
					<Text>{ holding.transactions.length }</Text>
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