import React, { createContext, useContext, useEffect, useState } from "react";
import { TabProps, TabsContextProps, TabsProviderProps } from "./types";
import { Selector } from "./Selector";
import { Tabs } from "./Tabs";

const TabsContext = createContext<TabsContextProps>({
	index: 0,
	setIndex: () => { },
	tabs: [],
});

export const useTabs = () => useContext(TabsContext);

export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
	const [index, setIndex] = useState(0);
	const [tabs, setTabs] = useState<TabProps[]>([]);

	useEffect(() => {
		const tabs = React.Children.map(children, child => {
			if (React.isValidElement(child)) {
				const {label} = child.props;
				return {label};
			}
		}).filter(Boolean);

		setTabs(tabs);
	}, [children]);

	return (
		<TabsContext.Provider value={{
			index,
			setIndex,
			tabs,
		}}>
			<Selector
				tabs={tabs}
				index={index}
				setIndex={setIndex}
			/>
			<Tabs
				index={index}
				setIndex={setIndex}
				children={children}
			/>
		</TabsContext.Provider>
	);
}