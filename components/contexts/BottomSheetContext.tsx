import React, {
	useState,
	createContext,
	useContext,
	useRef,
	useEffect,
	useCallback
} from "react";
import {
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
	BorderRadius,
	GlobalStyles
} from "../../constants";
import { IconButton } from "../buttons";
import { Header } from "../ui";

interface BottomSheetContext {
	title: string,
	setTitle: React.Dispatch<React.SetStateAction<string>>
	content: React.ReactNode | null,
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	visible: boolean,
	openBottomSheet: () => void,
	closeBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetContext>( {
	title: '',
	setTitle: () => {},
	content: null,
	setContent: () => {},
	visible: false,
	openBottomSheet: () => {},
	closeBottomSheet: () => {}
} );

export const useBottomSheet = () => useContext( BottomSheetContext );

export const BottomSheetProvider = ( { children } ) => {
	const [ visible, setVisible ] = useState( false );
	const [ title, setTitle ] = useState( '' );
	const [ content, setContent ] = useState<React.ReactNode>( null );

	const openBottomSheet = useCallback( () => {
		setVisible( true );
	}, [] );

	const closeBottomSheet = useCallback( () => {
		setVisible( false );
	}, [] );

  return (
    <BottomSheetContext.Provider value={ {
			title,
			content,
			visible,
			setTitle,
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
	const { title, content, visible, closeBottomSheet } = useBottomSheet();
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
			style={ styles.container }
			containerStyle={ styles.container }
			enableDynamicSizing={ true }
			backgroundStyle={ styles.background }
			handleComponent={ () => 
				<Header
					title={ title }
					isScreenHeader={ false }
					right={
						<IconButton
							icon={ 'close' }
							onPress={ closeBottomSheet } /> 
					} />
			}>
			<BottomSheetScrollView
				contentContainerStyle={ styles.contentContainer }
				keyboardShouldPersistTaps='handled'>
				{ content }
			</BottomSheetScrollView>
		</GorhomBottomSheet>
	)
}

const styles = StyleSheet.create( {
  container: {
		...GlobalStyles.container
  },
	contentContainer: {
		...GlobalStyles.gutter,
	},
	background: {
		borderRadius: BorderRadius.xl
	}
} );