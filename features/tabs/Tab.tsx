import { StyleSheet, View } from "react-native";
import { TabsContextProps } from "./types";
import { Text } from "../../components/ui/Text";
import { GlobalStyles } from "../../constants";
import { useTabs } from "./TabsContext";
import { useEffect, useLayoutEffect } from "react";


interface TabProps {
	label: string;
	children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({
	label,
	children
}) => {
	const { add, screens } = useTabs();
	const hasScreen = screens.find( screen => {
		return screen.label === label;
	});

	useEffect(() => {
		if (hasScreen) {
			return;
		}

		console.log(label, 'teste');
		add({label});
	});

	return (
		<View style={styles.container}>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
	}
})