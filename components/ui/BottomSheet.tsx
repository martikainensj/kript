import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import GorhomBottomSheet, { BottomSheetProps, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GlobalStyles, Theme } from '../../constants';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

export const BottomSheet: React.FC<BottomSheetProps> = ( { children, ...rest } ) => {
  // ref
  const bottomSheetRef = useRef<GorhomBottomSheet>( null );
  const initialSnapPoints = useMemo( () => ['25%'], [] );
	
	// renders
	const renderBackdrop = useCallback(
		( props: BottomSheetDefaultBackdropProps ) => (
			<BottomSheetBackdrop
				{ ...props }
				disappearsOnIndex={ -1 }
				appearsOnIndex={ 0 } />
		), []
	);

  // renders
  return (
		<GorhomBottomSheet
			ref={ bottomSheetRef }
			snapPoints={ initialSnapPoints }
			style={ styles.bottomSheet }
			backdropComponent={ renderBackdrop }
			containerStyle={ styles.container }
			backgroundStyle={ styles.background }
			enablePanDownToClose={ true }>
			{ children }
		</GorhomBottomSheet>
  );
};

const styles = StyleSheet.create( {
	bottomSheet: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	},
  container: {
  },
	background: {
		...GlobalStyles.shadow
	}
} );