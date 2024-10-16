import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { TabsContextProps, TabsProviderProps, TabsScreenProps } from "./types";
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../../components/ui/Text";
import PagerView from "react-native-pager-view";
import { GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";

const TabsContext = createContext<TabsContextProps>({
	currentIndex: 0,
	setIndex: () => { },
	screens: [],
	add: () => { return {} },
});

export const useTabs = () => useContext(TabsContext);

export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
	const pagerViewRef = useRef<PagerView | null>(null);
	const { theme } = useTheme();
	const [currentIndex, setIndex] = useState(0);
	const [screens, setScreens] = useState<TabsScreenProps[]>([]);
	const [tabWidths, setTabWidths] = useState<number[]>([]);

	const add = (props: TabsScreenProps) => {
		setScreens([
			props,
			...screens
		])
	};

	useEffect(() => {
		pagerViewRef.current?.setPage(currentIndex);
	}, [currentIndex, pagerViewRef]);

	const underlinePosition = useRef(new Animated.Value(0)).current;
	const underlineWidth = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (tabWidths[currentIndex]) {
			Animated.parallel([
				Animated.spring(underlinePosition, {
					toValue: tabWidths.slice(0, currentIndex).reduce((acc, width) => acc + width, 0),
					useNativeDriver: false,  // Position animation
				}),
				Animated.spring(underlineWidth, {
					toValue: tabWidths[currentIndex],
					useNativeDriver: false,  // Width animation
				}),
			]).start();
		}
	}, [currentIndex, tabWidths]);

	const selector = useMemo(() => {

		const handleTabLayout = (event, index) => {
			const { width } = event.nativeEvent.layout;
			setTabWidths((prevWidths) => {
				const newWidths = [...prevWidths];
				newWidths[index] = width;
				return newWidths;
			});
		};
		
		return (
				<ScrollView
					horizontal
					style={[
						styles.selectorContainer,
						{ borderBottomColor: theme.colors.outlineVariant }
					]}
					contentContainerStyle={styles.selectorContentContainer}
				>
					{screens.map((screen, index) => {
						const isActive = index === currentIndex;
						return (
							<TouchableOpacity
								key={index}
								onPress={() => setIndex(index)}
								disabled={screen.disabled || isActive}
								style={styles.selectorItemContainer}
								onLayout={(event) => handleTabLayout(event, index)}  // Measure the width of each tab
							>
								<Text
									style={[
										isActive && { color: theme.colors.primary }
									]}
								>
									{screen.label}
								</Text>
							</TouchableOpacity>
						);
					})}
					<Animated.View
						style={[
							styles.underline,
							{
								width: underlineWidth, 
								backgroundColor: theme.colors.outlineVariant,
								transform: [{ translateX: underlinePosition }] 
							}
						]}
					/>
				</ScrollView>
		);
	}, [screens, currentIndex]);

	const tabs = useMemo(() => {
		return (
			<PagerView
				ref={pagerViewRef}
				initialPage={0}
				orientation="horizontal"
				style={styles.tabsContainer}
				onPageSelected={(e) => {
					const pageIndex = e.nativeEvent.position;
					setIndex(pageIndex);
				}}
			>
				{children}
			</PagerView>
		)
	}, [children, pagerViewRef]);

	return (
		<TabsContext.Provider value={{
			currentIndex,
			setIndex,
			screens,
			add
		}}>
			{selector}
			{tabs}
		</TabsContext.Provider>
	);
}

const styles = StyleSheet.create({
	selectorContainer: {
		flexGrow: 0,
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	selectorContentContainer: {
		//paddingHorizontal: Spacing.md,
	},
	selectorItemContainer: {
		paddingVertical: Spacing.sm,
		paddingHorizontal: Spacing.md,
	},
	underline: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		height: 2,
		width: 100
	},
	tabsContainer: {
		...GlobalStyles.container
	}
})