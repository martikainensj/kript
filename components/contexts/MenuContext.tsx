import React, { useState, createContext, useContext, useCallback } from "react";
import { Divider, MenuItemProps, Menu as PaperMenu } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { Theme } from "../../constants";

export interface MenuItem extends MenuItemProps {
	startsSection?: boolean
}

interface MenuContext {
	visible: boolean
	anchor: React.ReactNode | { x: number, y: number; }
	menuItems: MenuItem[]
	openMenu: ( anchor: MenuContext["anchor"], menuItems: MenuItem[] ) => void
	closeMenu: () => void
}

const MenuContext = createContext<MenuContext>( null );

export const useMenu = () => useContext( MenuContext );

export const MenuProvider = ( { children } ) => {
	const [ visible, setVisible ] = useState( false );
	const [ anchor, setAnchor ] = useState( null );
  const [ menuItems, setMenuItems ] = useState( [] );

	const openMenu = ( anchor: MenuContext["anchor"], menuItems: MenuContext["menuItems"] ) => {
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
			{ menuItems?.map( ( menuItem, key ) =>
				<View key={ key }>
					{ menuItem.startsSection && <Divider /> }
					<PaperMenu.Item
						title={ menuItem.title }
						leadingIcon={ menuItem.leadingIcon }
						onPress={ onPressMenuItem.bind( this, menuItem.onPress ) } />
				</View>
 			) }
		</PaperMenu>
	)
}

const styles = StyleSheet.create( {
	contentContainer: {
		paddingVertical: 0
	}
} )