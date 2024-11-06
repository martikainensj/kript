import React from "react";

export interface TabProps {
	label: string;
}

export interface TabsContextProps {
	index: number;
	setIndex: React.Dispatch<React.SetStateAction<TabsContextProps["index"]>>;
	tabs: TabProps[];
}

export interface TabsProviderProps {
	children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}