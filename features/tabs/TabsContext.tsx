import React, { createContext, useContext, useState } from "react";
import { TabsContextProps, TabsProviderProps, TabsScreenProps } from "./types";
import { TabSelector } from "./TabSelector";
import { TabContent } from "./TabContent";

const TabsContext = createContext<TabsContextProps>({
	currentIndex: 0,
	setIndex: () => { },
	screens: [],
	add: () => { return {} },
});

export const useTabs = () => useContext(TabsContext);

export const TabsProvider: React.FC<TabsProviderProps> = ({ children }) => {
	const [currentIndex, setIndex] = useState(0);
	const [screens, setScreens] = useState<TabsScreenProps[]>([]);
	const [scrollData, setScrollData] = useState({ position: 0, offset: 0 });

	const add = (props: TabsScreenProps) => {
		setScreens([
			props,
			...screens
		])
	};

	return (
		<TabsContext.Provider value={{
			currentIndex,
			setIndex,
			screens,
			add
		}}>
			<TabSelector
				screens={screens}
				currentIndex={currentIndex}
				setIndex={setIndex}
				scrollData={scrollData}
			/>
			<TabContent
				currentIndex={currentIndex}
				setIndex={setIndex}
				setScrollData={setScrollData}
			>
				{children}
			</TabContent>
		</TabsContext.Provider>
	);
}