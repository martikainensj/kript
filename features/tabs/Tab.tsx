import { StyleSheet, View } from "react-native";
import { TabProps, TabsContextProps } from "./types";
import { GlobalStyles } from "../../constants";

interface Props extends TabProps {
	children: React.ReactNode;
}

export const Tab: React.FC<Props> = ({
	label,
	children
}) => {
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