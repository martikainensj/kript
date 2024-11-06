import React, { useEffect, useMemo, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import { StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants';

interface Props {
	children: React.ReactNode;
	index: number;
	setIndex: (index: number) => void;
}

export const Tabs: React.FC<Props> = ({ children, index, setIndex }) => {
	const pagerViewRef = useRef<PagerView | null>(null);

	useEffect(() => {
		pagerViewRef.current?.setPage(index);
	}, [index, pagerViewRef]);

	return (
		<PagerView
			ref={pagerViewRef}
			initialPage={0}
			orientation="horizontal"
			style={styles.container}
			onPageSelected={(e) => {
				const pageIndex = e.nativeEvent.position;
				setIndex(pageIndex);
			}}
		>
			{children}
		</PagerView>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},
});