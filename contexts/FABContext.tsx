import React, {
	useState,
	createContext,
	useContext,
	useCallback
} from "react";
import {
	StyleSheet
} from "react-native";
import { FAB as PaperFAB, FABGroupProps, ActivityIndicator } from 'react-native-paper';

import {
	BorderRadius,
	IconSize
} from "../constants";
import { Icon } from "../components/ui/Icon";
import { useData } from "./DataContext";

interface FABContext {
	actions: FABGroupProps["actions"]
	setActions: React.Dispatch<React.SetStateAction<FABContext['actions']>>
}

const FABContext = createContext<FABContext>( {
	actions: [],
	setActions: () => {}
} );

export const useFAB = () => useContext( FABContext );

export const FABProvider = ( { children } ) => {
	const [ actions, setActions ] = useState<FABContext['actions']>( [] );

  return (
    <FABContext.Provider value={ {
			actions,
			setActions,
		} }>
      { children }
			<FAB />
    </FABContext.Provider>
  );
}

const FAB = () => {
	const { isProcessing } = useData();
	const { actions } = useFAB();
	const [ open, setOpen ] = useState( false );

	const onStateChange = useCallback( () => {
		setOpen( ! open );
	}, [ open ] );

	const isVisible = ! isProcessing && !! actions.length;

	return (
		<PaperFAB.Group
			open={ open }
			visible={ isVisible }
			icon={ () => {
				return open
					? <Icon name={ 'close' } size={ IconSize.lg } />
					: <Icon name={ 'add' } size={ IconSize.lg } />
			} }
			actions={ actions }
			variant={ "secondary" }
			onStateChange={ onStateChange }
			fabStyle={ styles.fab } />
	)
}

const styles = StyleSheet.create( {
	fab: {
		borderRadius: BorderRadius.xl,
	}
} );