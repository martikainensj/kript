import React, { useState, createContext, useContext, useCallback } from "react";
import { Divider, MenuItemProps, Menu as PaperMenu } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Theme } from "../../constants";

export interface MenuItem extends MenuItemProps {
	startsSection?: boolean
}

interface MenuContextProps {
	visible: boolean
	anchor: React.ReactNode | { x: number, y: number; }
	menuItems: MenuItem[]
	openMenu: ( anchor: MenuContextProps["anchor"], menuItems: MenuContextProps['menuItems'] ) => void
	closeMenu: () => void
}

const MenuContext = createContext<MenuContextProps>( {
	visible: false,
	anchor: { x: 0, y: 0 },
	menuItems: [],
	openMenu() {},
	closeMenu() {}
} );

export const useMenu = () => useContext( MenuContext );

export const MenuProvider = ( { children } ) => {
	const [ visible, setVisible ] = useState( false );
	const [ anchor, setAnchor ] = useState<React.ReactNode | { x: number, y: number; }>();
	const [ menuItems, setMenuItems ] = useState<MenuContextProps['menuItems']>( [] );

	const openMenu = ( anchor: MenuContextProps["anchor"], menuItems: MenuContextProps["menuItems"] ) => {
		setAnchor( anchor );
		setMenuItems( menuItems );
		setVisible( true );
	};

	const closeMenu = () => {
		setVisible( false );
	}

  return (
    <MenuContext.Provider value={ {
			menuItems,
			visible,
			anchor,
			openMenu,
			closeMenu
		} }>
      { children }
		<Menu />
    </MenuContext.Provider>
  );
}

const Menu = () => {
	const { menuItems, visible, anchor, closeMenu } = useMenu();

	const onPressMenuItem = useCallback( ( callback: () => void ) => {
		closeMenu();
		callback();
	}, [] );

	const onDismiss = useCallback( () => closeMenu(), [] );

	return (
		<PaperMenu
			visible={ visible }
			anchor={ anchor }
			onDismiss={ onDismiss }
			contentStyle={ styles.contentContainer }
			theme={ Theme }>
			{ menuItems?.map( ( menuItem, key ) => {
				const { startsSection, title, leadingIcon, onPress } = menuItem;

				return <View key={ key }>
					{ startsSection && <Divider /> }
					<PaperMenu.Item
						title={ title }
						leadingIcon={ leadingIcon }
						onPress={ onPressMenuItem.bind( this, onPress ) } />
				</View>
		} ) }
		</PaperMenu>
	)
}

const styles = StyleSheet.create( {
	contentContainer: {
		paddingVertical: 0
	}
} )