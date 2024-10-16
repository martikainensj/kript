import React, { useEffect, useMemo, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import { StyleSheet } from 'react-native';

interface TabContentProps {
	children: React.ReactNode;
	currentIndex: number;
	setIndex: (index: number) => void;
	setScrollData: (data: { position: number; offset: number }) => void;
}

export const TabContent: React.FC<TabContentProps> = ({ children, currentIndex, setIndex, setScrollData }) => {
	const pagerViewRef = useRef<PagerView | null>(null);

	useEffect(() => {
		pagerViewRef.current?.setPage(currentIndex);
	}, [currentIndex, pagerViewRef]);

	return useMemo(() => (
		<PagerView
			ref={pagerViewRef}
			initialPage={0}
			orientation="horizontal"
			style={styles.tabsContainer}
			onPageSelected={(e) => {
				const pageIndex = e.nativeEvent.position;
				setIndex(pageIndex);
			}}
			onPageScroll={(e) => {
				const { position, offset } = e.nativeEvent;
				setScrollData({ position, offset });
			}}
		>
			{children}
		</PagerView>
	), [children, pagerViewRef]);
};

const styles = StyleSheet.create({
	tabsContainer: {
		flex: 1,
	},
});