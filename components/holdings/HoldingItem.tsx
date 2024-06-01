import React, { useCallback } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import { router } from "expo-router";

import { Grid, Icon, Row, Value } from "../ui";
import { FontWeight, GlobalStyles, Spacing } from "../../constants";
import { useHolding } from "../../hooks";
import { __ } from "../../localization";
import { MenuItem, useBottomSheet, useMenu } from "../contexts";
import { HoldingForm } from "./HoldingForm";
import { Holding } from "../../models/Holding";
import { prettifyNumber } from "../../helpers";

interface HoldingItemProps extends Holding {}

export const HoldingItem: React.FC<HoldingItemProps> = ( { _id, account_id } ) => {
	const theme = useTheme();
	const { openMenu } = useMenu();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const {
		holding, saveHolding, removeHolding,
		transactions,
		dividends,
		value, amount, returnValue, returnPercentage
	} = useHolding( { _id, account_id } );

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
				leadingIcon: ( props ) => 
					<Icon name={ 'create' } { ...props } />,
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
				leadingIcon: ( props ) => 
					<Icon name={ 'trash' } { ...props } />,
				onPress: removeHolding
			}
		];

		openMenu( anchor, menuItems );
	}, [ holding ] );

	const values = [
		<Value label={ __( 'Amount' ) } value={ prettifyNumber( amount ) } isVertical={ true } />,
		<Value label={ __( 'Value' ) } value={ prettifyNumber( value ) } unit={ '€' } isVertical={ true } />,
		<Value label={ __( 'Return' ) } value={ prettifyNumber( returnValue ) } unit={ '€' } isVertical={ true } />,
		<Value label={ __( 'Return' ) } value={ prettifyNumber( returnPercentage ) } unit={ '%' } isVertical={ true } />,
	];

	if ( ! holding?.isValid() ) return;

	const meta = [
		<Text style={ [ styles.name, { color: theme.colors.primary } ] }>{ holding?.name }</Text>
	]
	
	return (
		<TouchableRipple
			onPress={ onPress }
			onLongPress={ onLongPress }>
			<View style={ styles.container }>
				<View style={ styles.contentContainer }>
					<Grid
						columns={ 2 }
						items={ meta } />
					
					<Grid
						columns={ 4 }
						items= { values } />
				</View>

				<View style={ styles.iconContainer }>
					<Icon name={ 'chevron-forward' } />
				</View>
			</View>
		</TouchableRipple>
	)
}

export default HoldingItem;

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.gutter,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: Spacing.md,
		gap: Spacing.sm
	},
	contentContainer: {
		gap: Spacing.sm,
		flexGrow: 1,
		flexShrink: 1
	},
	name: {
		fontWeight: FontWeight.bold,
	},
	iconContainer: {
	}
} );