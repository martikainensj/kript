import React, {
	useState,
	createContext,
	useContext,
	useCallback
} from "react";
import {
	StyleSheet
} from "react-native";
import { FAB as PaperFAB, FABGroupProps } from 'react-native-paper';

import {
	BorderRadius,
	IconSize
} from "../../constants";
import { Icon } from "../ui";

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
	const { actions } = useFAB();
	const [ open, setOpen ] = useState( false );

	const onStateChange = useCallback( () => {
		setOpen( ! open );
	}, [ open ] );

	return (
		<PaperFAB.Group
			open={ open }
			visible={ !! actions.length }
			icon={ () => {
				return open
				? <Icon name={ 'close' } size={ IconSize.lg } />
				: <Icon name={ 'add' } size={ IconSize.lg } />
			} }
			actions={ actions }
			onStateChange={ onStateChange }
			fabStyle={ styles.fab } />
	)
}

const styles = StyleSheet.create( {
	fab: {
		borderRadius: BorderRadius.xl
	}
} );