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
	StyleSheet,
	useWindowDimensions
} from "react-native";
import GorhomBottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
	BottomSheetMethods
} from "@gorhom/bottom-sheet/lib/typescript/types";
import {
	BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import { GlobalStyles, Spacing } from "../constants";
import { IconButton } from "../components/buttons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";
import { Header } from "../components/ui/Header";

interface BottomSheetContext {
	title: string,
	setTitle: React.Dispatch<React.SetStateAction<string>>
	content: React.ReactNode | null,
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	openBottomSheet: ( title: string, content: React.ReactNode ) => void,
	closeBottomSheet: () => void
}

const BottomSheetContext = createContext<BottomSheetContext>( {
	title: '',
	setTitle: () => {},
	content: null,
	setContent: () => {},
	openBottomSheet: () => {},
	closeBottomSheet: () => {}
} );

export const useBottomSheet = () => useContext( BottomSheetContext );

export const BottomSheetProvider = ( { children } ) => {
	const bottomSheetRef = useRef<BottomSheetMethods>( null );
	const { theme } = useTheme();
	const [ title, setTitle ] = useState( '' );
	const [ content, setContent ] = useState<React.ReactNode>( null );
	const [ shouldOpen, setShouldOpen ] = useState( false );

	const insets = useSafeAreaInsets();
	const dimensions = useWindowDimensions();
	const snapPoints = [
		dimensions.height - insets.top
	];

	const renderBackdrop = useCallback( 
		( props: BottomSheetDefaultBackdropProps ) => (
			<BottomSheetBackdrop
				{ ...props }
				disappearsOnIndex={ -1 }
				appearsOnIndex={ 0 } />
		), []
	);

	const openBottomSheet = useCallback( ( title: string, content: React.ReactNode ) => {
		setTitle( title );
		setContent( content );
		setShouldOpen( true );
	}, [ title, content ] );

	const closeBottomSheet = useCallback( () => {
		setShouldOpen( false );
		bottomSheetRef.current.close();
		Keyboard.dismiss();
	}, [] );

	const onClose = useCallback( () => {
		setShouldOpen( false );
	}, [] );

	useEffect( () => {
		if ( shouldOpen ) {
			bottomSheetRef.current.snapToIndex( 0 );
			setShouldOpen( false );
		}
	}, [ shouldOpen ] );

	return (
		<BottomSheetContext.Provider value={ {
			title,
			setTitle,
			content,
			setContent,
			openBottomSheet,
			closeBottomSheet
		} }>
			{ children }
			<GorhomBottomSheet
				ref={ bottomSheetRef }
				index={ -1 }
				backdropComponent={ renderBackdrop }
				enablePanDownToClose={ true }
				style={ styles.container }
				onClose={ onClose }
				snapPoints={ snapPoints }
				enableDynamicSizing={ true }
				backgroundStyle={ { backgroundColor: theme.colors.background } }
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
					keyboardShouldPersistTaps={ "handled" }
					keyboardDismissMode={ "interactive" }
					contentContainerStyle={ styles.contentContainer }>
					{ content }
				</BottomSheetScrollView>
			</GorhomBottomSheet>
		</BottomSheetContext.Provider>
	);
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	contentContainer: {
		...GlobalStyles.gutter,
		paddingBottom: Spacing.md
	}
} );