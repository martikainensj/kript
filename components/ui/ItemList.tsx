import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Account } from "../../models/Account";
import { Holding } from "../../models/Holding";
import { Transaction } from "../../models/Transaction";
import { useTheme } from "../../features/theme/ThemeContext";
import { useI18n } from "../../features/i18n/I18nContext";
import { useStorage } from "../../features/storage/useStorage";
import { SortingProps } from "../../features/data/types";
import { Text } from "./Text";
import { Divider } from "./Divider";
import { FAB } from "../../features/fab/FAB";

interface ItemListProps {
	id: string;
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
	noItemsText,
	data,
	style,
	contentContainerStyle,
	sortingOptions
}) => {
	const { __ } = useI18n();
	const { theme } = useTheme();
	const { set, get } = useStorage();
	const [sorting, setSorting] = useState<SortingProps>(sortingOptions && sortingOptions[0]);

	const sortedData = useMemo(() => {
		if (sorting?.function) {
			return data.sort((a, b) => sorting.function(a.item, b.item));
		}

		return data;
	}, [data, sorting]);

	useEffect(() => {
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
			<FAB
				icon={sorting.icon}
				label={sorting.name}
				actions={sortingOptions.map(sortingOption => {
					return {
						icon: sortingOption.icon,
						label: sortingOption.name,
						onPress: () => {
							setSorting(sortingOption);
						}
					}
				})}
				side="left"
			>
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
					]}
				/>
			</FAB>
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
	},

	contentContainer: {
	},

	placeholderContainer: {
		...GlobalStyles.slice,
		paddingVertical: Spacing.md
	},

	placeholderText: {
	},

	placeholderDescription: {

	}
});