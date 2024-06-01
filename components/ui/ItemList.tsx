import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
import { Divider, Text, useTheme } from "react-native-paper";
import React from "react";
import { useI18n } from "../contexts/I18nContext";

interface ItemListProps {
	title?: string,
	noItemsText?: string,
	items: ArrayLike<any>,
	style?: StyleProp<ViewStyle>
	contentContainerStyle?: StyleProp<ViewStyle>
}

export const ItemList: React.FC<ItemListProps> = ( {
	title,
	noItemsText,
	items,
	style,
	contentContainerStyle,
} ) => {
	const { __ } = useI18n();
	const theme = useTheme();

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
				data={ items }
				ItemSeparatorComponent={ Divider }
				ListEmptyComponent={ <PlaceholderItem value={ noItemsText ?? __( 'No items' ) } /> }
				keyExtractor={ ( _, index ) => index.toString() }
				renderItem={ ( { item } ) => item }
				contentContainerStyle={ [
					styles.contentContainer,
					contentContainerStyle
				] }/>
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