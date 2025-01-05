import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList, StyleProp, StyleSheet, View, ViewStyle, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { GlobalStyles, Spacing } from "../../constants";
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
import { LinearGradient } from "expo-linear-gradient";

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
	const [contentHeight, setContentHeight] = useState(0);
	const [listHeight, setListHeight] = useState(0);
	const scrollYAnim = useRef(new Animated.Value(0)).current;

	const sortedData = useMemo(() => {
		if (!sorting?.function) {
			return data;
		}

		return data.sort((a, b) => sorting.function(a.item, b.item));
	}, [data, sorting]);

	useEffect(() => {
		get('@filters/sorting').then(filtersSorting => {
			const newFiltersSorting = {};

			if (!!filtersSorting) {
				Object.assign(newFiltersSorting, filtersSorting);
			}

			newFiltersSorting[id] = { id: sorting.id };
			set('@filters/sorting', newFiltersSorting);
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
		});
	}, []);

	return (
		<View style={[styles.container, style]}>
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
					};
				})}
				side="left"
			>
				<Animated.View
					style={[
						styles.gradientContainer,
						{
							top: 0,
							height: Spacing.xl,
							opacity: scrollYAnim.interpolate({
								inputRange: [0, Spacing.xl],
								outputRange: [0, 1],
								extrapolate: "clamp",
							}),
						}
					]}
				>
					<LinearGradient
						colors={[
							`${theme.colors.background}`,
							`${theme.colors.background}CC`,
							`${theme.colors.background}00`,
						]}
						style={styles.gradient}
					/>
				</Animated.View>

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
					onContentSizeChange={(_, h) => setContentHeight(h)}
					onLayout={event => setListHeight(event.nativeEvent.layout.height)}
					onScroll={
						Animated.event(
							[{
								nativeEvent: {
									contentOffset: {
										y: scrollYAnim,
									}
								}
							}],
							{ useNativeDriver: false }
						)
					}
					scrollEventThrottle={0}
				/>

				<Animated.View
					style={[
						styles.gradientContainer,
						{
							bottom: 0,
							height: Spacing.fab,
							opacity: scrollYAnim.interpolate({
								inputRange: [
									contentHeight - listHeight - Spacing.fab,
									contentHeight - listHeight,
									contentHeight - listHeight + Spacing.fab,
								],
								outputRange: [1, 0, 1], // Gradientti tulee näkyviin, kun sisältöä ei voi enää skrollata ylöspäin.
								extrapolate: "clamp",
							}),
						},
					]}
				>
					<LinearGradient
						colors={[
							`${theme.colors.background}00`,
							`${theme.colors.background}CC`,
							theme.colors.background,
						]}
						style={styles.gradient}
					/>
				</Animated.View>
			</FAB>
		</View>
	);
};

interface PlaceholderItemProps {
	value: string;
}

const PlaceholderItem: React.FC<PlaceholderItemProps> = ({ value }) => {
	return (
		<View style={styles.placeholderContainer}>
			<Text style={styles.placeholderText}>{value}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
		marginHorizontal: -Spacing.md
	},
	contentContainer: {},
	gradientContainer: {
		position: "absolute",
		left: 0,
		right: 0,
		pointerEvents: "none",
		zIndex: 1
	},
	gradient: {
		flex: 1,
	},
	placeholderContainer: {
		...GlobalStyles.slice,
		paddingVertical: Spacing.md
	},
	placeholderText: {},
});