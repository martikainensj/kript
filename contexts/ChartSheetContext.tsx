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
	BottomSheetView,
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

interface ChartSheetContext {
	title: string,
	setTitle: React.Dispatch<React.SetStateAction<string>>
	content: React.ReactNode | null,
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	openChartSheet: ( title: string, content: React.ReactNode ) => void,
	closeChartSheet: () => void
}

const ChartSheetContext = createContext<ChartSheetContext>( {
	title: '',
	setTitle: () => {},
	content: null,
	setContent: () => {},
	openChartSheet: () => {},
	closeChartSheet: () => {}
} );

export const useChartSheet = () => useContext( ChartSheetContext );

export const ChartSheetProvider = ( { children } ) => {
	const chartSheetRef = useRef<BottomSheetMethods>( null );
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

	const openChartSheet = ( title: string, content: React.ReactNode ) => {
		setTitle( title );
		setContent( content );
		setShouldOpen( true );
	};

	const closeChartSheet = useCallback( () => {
		setShouldOpen( false );
		chartSheetRef.current.close();
		Keyboard.dismiss();
	}, [] );

	const onClose = useCallback( () => {
		setShouldOpen( false );
		setTitle( '' );
		setContent( null );
	}, [] );

	useEffect( () => {
		if ( shouldOpen ) {
			chartSheetRef.current.snapToIndex( 0 );
			setShouldOpen( false );
		}
	}, [ shouldOpen ] );

	return (
		<ChartSheetContext.Provider value={ {
			title,
			setTitle,
			content,
			setContent,
			openChartSheet,
			closeChartSheet
		} }>
			{ children }
			<GorhomBottomSheet
				ref={ chartSheetRef }
				index={ -1 }
				backdropComponent={ renderBackdrop }
				enablePanDownToClose={ true }
				enableContentPanningGesture={false}
				style={ styles.container }
				onClose={ onClose }
				snapPoints={ snapPoints }
				enableDynamicSizing={ true }
				backgroundStyle={ { backgroundColor: theme.colors.background } }>
				<BottomSheetView>
					{ content }
				</BottomSheetView>
			</GorhomBottomSheet>
		</ChartSheetContext.Provider>
	);
}

const styles = StyleSheet.create( {
	container: {
		...GlobalStyles.container,
	},
	handle: {
	},
	handleIndicator: {
	}
} );