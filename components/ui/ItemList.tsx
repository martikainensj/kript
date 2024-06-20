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
import { IconButton } from "../buttons";

interface ItemListProps {
	title?: string;
	noItemsText?: string;
	data: {
		item: Account | Holding | Transaction;
		renderItem: React.JSX.Element;
	}[];
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
	sortingContainerStyle?: StyleProp<ViewStyle>;
	sortingOptions?: SortingType[];
}

export const ItemList: React.FC<ItemListProps> = ( {
	title,
	noItemsText,
	data,
	style,
	contentContainerStyle,
	sortingContainerStyle,
	sortingOptions
} ) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const [ sorting, setSorting ] = useState<SortingType['name']>( sortingOptions && sortingOptions[0].name );
	const [ showSortingOptions, setShowSortingOptions ] = useState( false );

	const sortedData = useMemo( () => {
		const sortingFunction = sorting && sortingOptions?.find( option => option.name === sorting )?.function;

		if ( sortingFunction ) {
			return data.sort( ( a, b ) => sortingFunction( a.item, b.item ) );
		}

		return data;
	}, [ data, sorting ] );

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
				keyExtractor={ ( { item } ) => item._id.toString() }
				renderItem={ ( { item } ) => item.renderItem }
				contentContainerStyle={ [
					styles.contentContainer,
					contentContainerStyle
				] } />

			{ sortingOptions &&
				<Menu 
					anchor={
						<View style={ [
							styles.sortingContainer,
							sortingContainerStyle
						] }>
							<IconButton
								icon={ 'funnel-outline' }
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
					style={ styles.menuContainer }>
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

	menuContainer: {
		left: 0,
		padding: Spacing.md
	},

	sortingContainer: {
		position: 'relative',
		flexDirection: 'row',
		alignItems: 'center',
		gap: Spacing.sm,
		padding: Spacing.md
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