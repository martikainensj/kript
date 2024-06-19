import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
import { Divider, Menu, Text } from "react-native-paper";
import React, { useMemo, useState } from "react";
import { useI18n } from "../contexts/I18nContext";
import { useTheme } from "../contexts/ThemeContext";
import { SortingType } from "../../hooks/useTypes";
import { Account } from "../../models/Account";
import { Holding } from "../../models/Holding";
import { Transaction } from "../../models/Transaction";
import { AccountItem } from "../accounts";
import TransactionItem from "../transactions/TransactionItem";
import HoldingItem from "../holdings/HoldingItem";
import { IconButton } from "../buttons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
	const [ sorting, setSorting ] = useState<SortingType['name']>( sortingOptions && sortingOptions[0].name );
	const [ showSortingOptions, setShowSortingOptions ] = useState( false );
	const insets = useSafeAreaInsets();

	/**
	 * TODO: 
	 * - Mieti miten käytät returnValue ja value sortingissa, koska noi arvot tulee custom hookin kautta
	 * - Tallenna tieto jotenkin local storageen
	 */
	const sortedData = useMemo( () => {
		const sortingFunction = sorting && sortingOptions?.find( option => option.name === sorting ).function;

		if ( sortingFunction ) {
			return data.sort( sortingFunction );
		}

		return data;
	}, [ data, sorting ] );

	interface renderItemProps {
		item: Account | Holding | Transaction
	}

	const RenderItem: React.FC<renderItemProps> = ( { item } ) => {
		if ( ! item.account_id ) {
			return <AccountItem id={ item._id } />
		} else if ( item.account_id && item.name ) {
			return <HoldingItem { ...item as Holding } />
		} else {
			return <TransactionItem { ...item as Transaction } showHolding={ showHolding } />
		}
	}

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

			<FlatList
				data={ sortedData }
				ItemSeparatorComponent={ Divider }
				ListEmptyComponent={ <PlaceholderItem value={ noItemsText ?? __( 'No items' ) } /> }
				keyExtractor={ ( item ) => item._id.toString() }
				renderItem={ ( { item } ) => <RenderItem item={ item } /> }
				contentContainerStyle={ [
					styles.contentContainer,
					contentContainerStyle
				] } />

			{ sortingOptions &&
				<Menu 
					anchor={
						<View style={ [
							styles.sortingContainer,
							{ bottom: insets.bottom }
						] }>
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
					onDismiss={ () => setShowSortingOptions( false ) }
					style={ { padding: Spacing.sm } }>
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
		left: Spacing.md,
		marginBottom: Spacing.md,
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