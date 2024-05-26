import React, {
	useState,
	createContext,
	useContext,
	useRef,
	useEffect,
	useCallback
} from "react";
import {
	Keyboard,
	Platform,
	StyleSheet
} from "react-native";
import GorhomBottomSheet, {
	BottomSheetBackdrop,
	BottomSheetView
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetContext {
	title: string,
	setTitle: React.Dispatch<React.SetStateAction<string>>
	content: React.ReactNode | null,
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	visible: boolean,
	openBottomSheet: ( title: string, content: React.ReactNode ) => void,
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

	const openBottomSheet = useCallback( ( title: string, content: React.ReactNode ) => {
		setTitle( title );
		setContent( content );
		setVisible( true );
	}, [] );

	const closeBottomSheet = useCallback( () => {
		Keyboard.dismiss();
		setVisible( false );
	}, [] );

  return (
    <BottomSheetContext.Provider value={ {
			title,
			setTitle,
			content,
			setContent,
			visible,
			openBottomSheet,
			closeBottomSheet
		} }>
      { children }
			<BottomSheet />
    </BottomSheetContext.Provider>
  );
}

const BottomSheet = () => {
	const insets = useSafeAreaInsets();
	const { title, setTitle, content, setContent, visible, closeBottomSheet } = useBottomSheet();
	const bottomSheetRef = useRef<BottomSheetMethods>( null );

	const renderBackdrop = useCallback( 
		( props: BottomSheetDefaultBackdropProps ) => (
			<BottomSheetBackdrop
				{ ...props }
				disappearsOnIndex={ -1 }
				appearsOnIndex={ 0 } />
		), []
	);

	const onChange = useCallback( ( index: number ) => {
    if ( index === -1 ) {
			setTitle( null );
			setContent( null );
    }
  }, [] );

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
			keyboardBehavior={ Platform.OS === 'android' ? 'extend' : 'interactive' }
			keyboardBlurBehavior={ 'restore' }
			onChange={ onChange }
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
			<BottomSheetView
				style={ [
					styles.contentContainer,
					{ paddingBottom: insets.bottom }
				] }>
				{ content }
			</BottomSheetView>
		</GorhomBottomSheet>
	)
}

const styles = StyleSheet.create( {
  container: {
		...GlobalStyles.container
  },
	contentContainer: {
		...GlobalStyles.gutter,
		flex: 0,
		minHeight: 350,
	},
	background: {
		borderRadius: BorderRadius.xl
	}
} );