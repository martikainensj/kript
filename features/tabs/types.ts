import React from "react";
import { Tab } from "./Tab";

export interface TabsScreenProps {
	label: string,
	disabled?: boolean
}

export interface TabsContextProps {
	currentIndex: number;
	setIndex: React.Dispatch<React.SetStateAction<TabsContextProps['currentIndex']>>;
	screens: TabsScreenProps[];
	add: (props: TabsScreenProps) => void;
}

export interface TabsProviderProps {
	children: React.ReactElement<typeof Tab> | React.ReactElement<typeof Tab>[];
	defaultIndex?: number;
}