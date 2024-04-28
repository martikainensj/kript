import {
	useState,
	createContext,
	useContext,
	useRef,
	useEffect,
	useCallback
} from "react";
import {
	LayoutChangeEvent,
	StyleSheet
} from "react-native";
import GorhomBottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView
} from "@gorhom/bottom-sheet";
import {
	BottomSheetMethods
} from "@gorhom/bottom-sheet/lib/typescript/types";
import {
	BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import {
	GlobalStyles
} from "../../constants";

interface BottomSheetContext {
	content: React.ReactNode,
	setContent: React.Dispatch<React.ReactNode>
	visible: boolean,
	openBottomSheet: () => void,
	closeBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetContext>( null );

export const useBottomSheet = () => useContext( BottomSheetContext );

export const BottomSheetProvider = ( { children } ) => {
	const [ visible, setVisible ] = useState( false );
	const [ content, setContent ] = useState( null );

	const openBottomSheet = useCallback( () => {
		setVisible( true );
	}, [] );

	const closeBottomSheet = useCallback( () => {
		setVisible( false );
	}, [] );

  return (
    <BottomSheetContext.Provider value={ {
			content,
			visible,
			setContent,
			openBottomSheet,
			closeBottomSheet
		} }>
      { children }
			<BottomSheet />
    </BottomSheetContext.Provider>
  );
}

const BottomSheet = () => {
	const { content, visible, closeBottomSheet } = useBottomSheet();
	const bottomSheetRef = useRef<BottomSheetMethods>( null );
	const [ contentHeight, setContentHeight ] = useState( 50 );

	const renderBackdrop = useCallback( 
		( props: BottomSheetDefaultBackdropProps ) => (
			<BottomSheetBackdrop
				{ ...props }
				disappearsOnIndex={ -1 }
				appearsOnIndex={ 0 } />
		), []
	);

	useEffect( () => {
		visible
			? bottomSheetRef.current?.expand()
			: bottomSheetRef.current?.close();
	}, [ visible ] );

	return (
		<GorhomBottomSheet
			ref={ bottomSheetRef }
			index={ -1 }
			backdropComponent={ renderBackdrop }
			onClose={ closeBottomSheet }
			enablePanDownToClose={ true }
			style={ styles.bottomSheet }
			containerStyle={ styles.container }
			enableDynamicSizing={ true }
			backgroundStyle={ styles.background }>
			<BottomSheetScrollView
				keyboardShouldPersistTaps='handled'>
				{ content }
			</BottomSheetScrollView>
		</GorhomBottomSheet>
	)
}

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