import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
import { Divider, Text } from "react-native-paper";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Account } from "../../models/Account";
import { Holding } from "../../models/Holding";
import { Transaction } from "../../models/Transaction";
import { useFAB } from "../../contexts/FABContext";
import { Icon } from "./Icon";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useStorage } from "../../features/storage/useStorage";
import { SortingProps } from "../../features/data/types";

interface ItemListProps {
	id: string;
	title?: string;
	noItemsText?: string;
	data: {
		item: Account | Holding | Transaction;
		renderItem: React.JSX.Element;
	}[];
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
	sortingContainerStyle?: StyleProp<ViewStyle>;
	sortingOptions?: SortingProps[];
}

export const ItemList: React.FC<ItemListProps> = ({
	id,
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
	const { set, get } = useStorage();
	const [sorting, setSorting] = useState<SortingProps>(sortingOptions && sortingOptions[0]);

	const sortedData = useMemo(() => {
		if (sorting?.function) {
			return data.sort((a, b) => sorting.function(a.item, b.item));
		}

		return data;
	}, [data, sorting]);

	useEffect(() => {
		setIcon(sorting?.icon);
		setLabel(sorting?.name);

		get('@filters/sorting').then(filtersSorting => {
			const newFiltersSorting = {};

			if (!!filtersSorting) {
				Object.assign(newFiltersSorting, filtersSorting);
			}

			newFiltersSorting[id] = { id: sorting.id };

			set('@filters/sorting', newFiltersSorting)
		});
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

	useLayoutEffect(() => {
		get('@filters/sorting').then(filtersSorting => {
			const sortingId = filtersSorting?.[id]?.id || null;

			if (sortingId) {
				setSorting(sortingOptions.find(option => option.id === sortingId));
			} else if (sortingOptions?.length) {
				setSorting(sortingOptions[0]);
			}
		})
	}, []);

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