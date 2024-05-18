import React from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import { Spacing } from '../../constants';

interface GridProps {
  columns: number;
  items: React.ReactNode[];
}

const gap = Spacing.sm;

export const Grid: React.FC<GridProps> = ( {
	columns = 1,
	items
} ) => {
  const itemWidth: DimensionValue | undefined = `${ 100 / columns }%`;
	

  return (
    <View style={ styles.container }>
      { items?.map( ( item, key ) =>
        <View
					key={ key }
					style={ [
						styles.item,
						{ width: itemWidth },
						key > columns - 1 && { paddingTop: gap }
					] }>
          { item }
        </View>
      ) }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
		marginHorizontal: -gap
  },
  item: {
		paddingHorizontal: gap
  },
});
