import React from 'react';
import { View, StyleSheet, DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { Spacing } from '../../constants';

interface GridProps {
	columns: number;
	items: React.ReactNode[];
	style?: StyleProp<ViewStyle>
}

export const Grid: React.FC<GridProps> = ({
	columns = 1,
	items,
	style
}) => {
	const itemWidth: DimensionValue | undefined = `${100 / columns}%`;

	return (
		<View
			style={[
				styles.container,
				style
			]}
		>
			{items?.map((item, key) =>
				<View
					key={key}
					style={[
						styles.item,
						{ width: itemWidth },
						key > columns - 1 && { paddingTop: Spacing.sm }
					]}
					children={item}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		margin: -Spacing.sm
	},
	item: {
		padding: Spacing.sm
	},
});
