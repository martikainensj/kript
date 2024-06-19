import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
import { Divider, Menu, Text } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useI18n } from "../contexts/I18nContext";
import { useTheme } from "../contexts/ThemeContext";
import { SortingType } from "../../hooks/useTypes";
import { Account } from "../../models/Account";
import { Holding } from "../../models/Holding";
import { Transaction } from "../../models/Transaction";
import { AccountItem } from "../accounts";
import TransactionItem from "../transactions/TransactionItem";
import HoldingItem from "../holdings/HoldingItem";
import { Select } from "../inputs/Select";
import { IconButton } from "../buttons";

interface ItemListProps {
	title?: string;
	noItemsText?: string;
	data: (Account | Holding | Transaction)[];
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
	sortingOptions?: SortingType[];
	showHolding?: boolean;
}

export const ItemList: React.FC<ItemListProps> = ( {
	title,
	noItemsText,
	data,
	style,
	contentContainerStyle,
	sortingOptions,
	showHolding
} ) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const [ sorting, setSorting ] = useState<SortingType['name']>();
	const [ sortedData, setSortedData ] = useState( data );
	const [ showSortingOptions, setShowSortingOptions ] = useState( false );

	useEffect( () => {
		const sortingFunction = sorting && sortingOptions?.find( option => option.name === sorting ).function;
		
		if ( sortingFunction ) {
			const sortedData = data.sort( sortingFunction );
			console.log( sorting );
			setSortedData( sortedData );
		}
	}, [ sorting ] );

	return (
		<View style={ [
			styles.container,
			style
		] }>
			{ title &&
				<View style={ styles.titleContainer }>
					<Text style={ [ styles.title, { color: theme.colors.secondary } ] }>
						{ title }
					</Text>
					<Divider />
				</View>
			}

			{ sortingOptions &&
				<Menu 
					anchor={
						<View style={ styles.sortingContainer }>
							<IconButton
								icon={ 'funnel' }
								onPress={ () => setShowSortingOptions( true ) } />
							{ sorting &&
								<Text style={ styles.sortingText }>
									{ sorting }
								</Text>
							}
						</View>
					}
					visible={ showSortingOptions }
					onDismiss={ () => setShowSortingOptions( false ) }>
					{ sortingOptions.map( ( option, key ) => {
						return (
							<Menu.Item
								key={ key }
								title={ option.name }
								onPress={ () => {
									setShowSortingOptions( false );
									setSorting( option.name );
								} } />
						)
					} ) }
				</Menu>
			}

			<FlatList
				data={ sortedData }
				ItemSeparatorComponent={ Divider }
				ListEmptyComponent={ <PlaceholderItem value={ noItemsText ?? __( 'No items' ) } /> }
				keyExtractor={ ( item ) => item._id.toString() }
				renderItem={ ( { item } ) => { return ( <>
					{ ! item.account_id && <AccountItem id={ item._id } /> }
					{ ( item.account_id && item.name ) && <HoldingItem { ...item as Holding } /> }
					{ ( item.account_id && item.holding_id ) && <TransactionItem { ...item as Transaction } showHolding={ showHolding } /> }
				</> ) } }
				contentContainerStyle={ [
					styles.contentContainer,
					contentContainerStyle
				] } />
		</View>
	)
}

interface PlaceholderItemProps {
	value: string,
}

const PlaceholderItem: React.FC<PlaceholderItemProps> = ( {
	value
} ) => {
	return (
		<View style={ styles.placeholderContainer }>
				<Text style={ styles.placeholderText }>
					{ value }
				</Text>
		</View>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
		marginHorizontal: -Spacing.md
	},

	titleContainer: {
		gap: Spacing.sm,
		paddingTop: Spacing.sm
	},
	
	title: {
		...GlobalStyles.gutter,
		...GlobalStyles.label
	},

	sortingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm
	},

	sortingText: {
		...GlobalStyles.label
	},
	
	contentContainer: {
	},
	
	placeholderContainer: {
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md
	},
	
	placeholderText: {
		...GlobalStyles.label
	},
	
	placeholderDescription: {

	}
} );