import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
import { Divider, Text } from "react-native-paper";
import React, { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../contexts/I18nContext";
import { useTheme } from "../../contexts/ThemeContext";
import { SortingType } from "../../hooks/useTypes";
import { Account } from "../../models/Account";
import { Holding } from "../../models/Holding";
import { Transaction } from "../../models/Transaction";
import { useFAB } from "../../contexts/FABContext";
import { Icon } from "./Icon";

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

export const ItemList: React.FC<ItemListProps> = ({
	title,
	noItemsText,
	data,
	style,
	contentContainerStyle,
	sortingOptions
}) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const { setActions, setIcon, setLabel } = useFAB();
	const [sorting, setSorting] = useState<SortingType>(sortingOptions && sortingOptions[0]);

	const sortedData = useMemo(() => {

		if (sorting?.function) {
			return data.sort((a, b) => sorting.function(a.item, b.item));
		}

		return data;
	}, [data, sorting]);

	useEffect(() => {
		setIcon(sorting?.icon);
		setLabel(sorting?.name);
	}, [sorting]);

	useEffect(() => {
		const currentSorting = sortingOptions.find(sortingOption => sorting.id === sortingOption.id);
		setSorting(currentSorting);

		setActions(sortingOptions.map(sortingOption => {
			return {
				icon: ({ size }) => <Icon name={sortingOption.icon} size={size} />,
				label: sortingOption.name,
				onPress: () => {
					setSorting(sortingOption);
				}
			}
		}));
	}, [sortingOptions]);

	return (
		<View style={[
			styles.container,
			style
		]}>
			{title &&
				<View style={styles.titleContainer}>
					<Text style={[styles.title, { color: theme.colors.secondary }]}>
						{title}
					</Text>
					<Divider />
				</View>
			}

			<FlatList
				data={sortedData}
				ItemSeparatorComponent={Divider}
				ListEmptyComponent={<PlaceholderItem value={noItemsText ?? __('No items')} />}
				keyExtractor={({ item }) => item._id.toString()}
				renderItem={({ item }) => item.renderItem}
				contentContainerStyle={[
					styles.contentContainer,
					sortingOptions?.length && { paddingBottom: Spacing.fab },
					contentContainerStyle
				]} />
		</View>
	)
}

interface PlaceholderItemProps {
	value: string,
}

const PlaceholderItem: React.FC<PlaceholderItemProps> = ({
	value
}) => {
	return (
		<View style={styles.placeholderContainer}>
			<Text style={styles.placeholderText}>
				{value}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
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
});