import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Color, GlobalStyles, Spacing } from "../../constants";
import { Divider, Text } from "react-native-paper";
import React from "react";

interface ItemListProps {
	title?: string,
	noItemsTitleText?: string,
	noItemsDescriptionText?: string,
	items: ArrayLike<any>,
	style?: StyleProp<ViewStyle>
	contentContainerStyle?: StyleProp<ViewStyle>
}

export const ItemList: React.FC<ItemListProps> = ( {
	title,
	noItemsTitleText,
	noItemsDescriptionText = 'No items',
	items,
	style,
	contentContainerStyle
} ) => {
	return (
		<View style={ [
			styles.container,
			style
		] }>
			{ title &&
				<View style={ styles.titleContainer }>
					<Text style={ styles.title }>{ title }</Text>
					<Divider />
				</View>
			}
			<FlatList
				data={ items }
				ItemSeparatorComponent={ Divider }
				ListEmptyComponent={ <PlaceholderItem title={ noItemsTitleText } description={ noItemsDescriptionText } /> }
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
	title?: string,
	description?: string
}

const PlaceholderItem: React.FC<PlaceholderItemProps> = ( {
	title,
	description
} ) => {
	if ( ! title && ! description ) return;

	return (
		<View style={ styles.placeholderContainer }>
			{ title &&
				<Text style={ styles.placeholderTitle }>
					{ title }
				</Text>
			}
			{ description &&
				<Text style={ styles.placeholderDescription }>
					{ description }
				</Text>
			}
		</View>
	)
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
		marginHorizontal: -Spacing.md,
		marginTop: -Spacing.md
	},

	titleContainer: {
		gap: Spacing.sm,
		paddingTop: Spacing.sm
	},
	
	title: {
		...GlobalStyles.gutter,
		...GlobalStyles.label,
		color: Color.grey
	},
	
	contentContainer: {
	},
	
	placeholderContainer: {
		...GlobalStyles.gutter,
		paddingVertical: Spacing.sm
	},
	
	placeholderTitle: {
		...GlobalStyles.title
	},
	
	placeholderDescription: {

	}
} );