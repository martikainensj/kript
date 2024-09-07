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
import { Ionicons } from '@expo/vector-icons';

import {
	BorderRadius,
	IconSize,
	Spacing
} from "../constants";
import { Icon } from "../components/ui/Icon";
import { useData } from "./DataContext";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";

interface FABContext {
	actions: FABGroupProps["actions"];
	setActions: React.Dispatch<React.SetStateAction<FABContext['actions']>>;
}

const FABContext = createContext<FABContext>( {
	actions: [],
	setActions: () => {},
} );

export const useFAB = () => useContext( FABContext );

interface ProviderProps {
	side?: 'left' | 'right';
	insets?: EdgeInsets;
	iconName?: React.ComponentProps<typeof Ionicons>['name'],
	children: React.ReactNode;
}

export const FABProvider: React.FC<ProviderProps> = ( { side = 'right', insets, iconName, children } ) => {
	const [ actions, setActions ] = useState<FABContext['actions']>( [] );

  return (
    <FABContext.Provider value={ {
			actions,
			setActions,
		} }>
      { children }
			<FAB side={side} insets={insets} iconName={iconName} />
    </FABContext.Provider>
  );
}

interface FABProps {
	side: ProviderProps['side'];
	insets: ProviderProps['insets'];
	iconName: ProviderProps['iconName'];
}

const FAB: React.FC<FABProps> = ({ side, insets, iconName }) => {
	const { isProcessing } = useData();
	const { actions } = useFAB();
	const [ open, setOpen ] = useState( false );

	const onStateChange = useCallback( () => {
		setOpen( ! open );
	}, [ open ] );

	const isVisible = ! isProcessing && !! actions.length;

	const getIcon = ({ size }) => {
		if ( open ) {
			return <Icon name={ 'close' } size={ size } />
		}

		if ( iconName ) {
			return <Icon name={ iconName } size={ size } />
		}

		return <Icon name={ 'ellipsis-vertical' } size={ size } />
	}
	
	return (
		<PaperFAB.Group
			open={ open }
			visible={ isVisible }
			icon={ getIcon }
			actions={ actions }
			variant={ "secondary" }
			onStateChange={ onStateChange }
			style={{
				paddingBottom: insets?.bottom,
			}}
			
			fabStyle={[
				styles.fab,
				side === 'left' && styles.left,
				side === 'right' && styles.right,
			]} />
	)
}

const styles = StyleSheet.create( {
	fab: {
		borderRadius: BorderRadius.xl,
	},
	left: {
		marginLeft: Spacing.md,
		marginRight: 'auto'
	},
	right: {
		marginLeft: 'auto',
		marginRight: Spacing.md
	}
} );