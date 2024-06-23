import {
	StyleSheet,
	View
} from "react-native";
import { TabsProvider, TabScreen, Tabs as PaperTabs } from "react-native-paper-tabs";

import { GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../../contexts/ThemeContext";
import { Mode } from "react-native-paper-tabs/lib/typescript/utils";

interface TabsScreenContentProps {
	label: string,
	content: React.ReactNode,
	disabled?: boolean
}

interface TabsProps {
	screens: TabsScreenContentProps[];
	defaultIndex?: number;
	mode?: Mode;
}

export const Tabs: React.FC<TabsProps> = ( {
	defaultIndex = 0,
	mode = 'fixed',
	screens = []
} ) => {
	const { theme } = useTheme();

	return (
		<TabsProvider defaultIndex={ defaultIndex }>
			<PaperTabs
				mode={ mode }
				showLeadingSpace={ true }
				style={ {
					...styles.container,
					borderColor: theme.colors.outlineVariant 
				} }
				tabLabelStyle={ styles.labelContainer }>
				{ screens.map( ( screen, key ) => {
					const {	label, content, disabled } = screen;

					return (
						<TabScreen key={ key } label={ label } disabled={ disabled }>
							{ content }
						</TabScreen>
					)
				} ) }
			</PaperTabs>
		</TabsProvider>
	);
}

const styles = StyleSheet.create( {
	container: {
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	labelContainer: {
		...GlobalStyles.label,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	}
} );