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
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import {
	BottomSheetMethods
} from "@gorhom/bottom-sheet/lib/typescript/types";
import {
	BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

import { GlobalStyles } from "../../constants";
import { IconButton } from "../buttons";
import { Header } from "../ui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";

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
	const insets = useSafeAreaInsets();
	const [ title, setTitle ] = useState( '' );
	const [ content, setContent ] = useState<React.ReactNode>( null );

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
		bottomSheetRef.current.expand();
	}, [] );

	const closeBottomSheet = useCallback( () => {
		console.log('käsketty sulkeminen');
		bottomSheetRef.current.close();
	}, [] );

	const onChange = useCallback( ( index: number ) => {
		console.log( 'muuttu ->' , index );
	}, [] );

	const onClose = useCallback( () => {
		console.log('sulkee');
		setTitle( null );
		setContent( null );
	}, [] );

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
				enableDynamicSizing={ true }
				backgroundStyle={ { backgroundColor: theme.colors.background } }
				onClose={ onClose }
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
				<BottomSheetScrollView
					keyboardShouldPersistTaps={ "handled" }
					keyboardDismissMode={ "on-drag" }
					contentContainerStyle={ [
						styles.contentContainer,
						{ paddingBottom: insets.bottom }
					] }>
					{ content }
				</BottomSheetScrollView>
			</GorhomBottomSheet>
		</BottomSheetContext.Provider>
	);
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
		minHeight: 10
	},
	contentContainer: {
		...GlobalStyles.gutter,
	}
} );