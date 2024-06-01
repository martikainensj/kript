import {
	StyleSheet,
	View
} from "react-native";
import { TabsProvider, TabScreen, Tabs as PaperTabs } from "react-native-paper-tabs";

import { GlobalStyles } from "../../constants";
import { useTheme } from "react-native-paper";

interface TabsScreenContentProps {
	label: string,
	content: React.ReactNode
}

interface TabsProps {
	defaultIndex?: number
	screens: TabsScreenContentProps[]
}

export const Tabs: React.FC<TabsProps> = ( {
	defaultIndex = 0,
	screens = []
} ) => {
	const theme = useTheme();

  return (
		<TabsProvider	defaultIndex={ defaultIndex }>
			<PaperTabs
				mode="scrollable"
				showLeadingSpace={ false }
				style={ {
					...styles.container,
					borderColor: theme.colors.outlineVariant 
				} }
				tabLabelStyle={ styles.labelContainer }>
				{ screens.map( ( screen, key ) => {
					const {	label, content } = screen;
					return <TabScreen key={ key } label={ label }>
						<View style={ styles.contentContainer }>
							{ content }
						</View>
					</TabScreen>
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