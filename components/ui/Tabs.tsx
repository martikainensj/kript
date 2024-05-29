import {
	StyleSheet,
	View
} from "react-native";
import { TabsProvider, TabScreen, Tabs as PaperTabs } from "react-native-paper-tabs";

import {
	GlobalStyles,
	Theme,
} from "../../constants";

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
  return (
		<TabsProvider	defaultIndex={ defaultIndex }>
			<PaperTabs
				mode="scrollable"
				showLeadingSpace={ false }
				style={ styles.container }
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
		borderColor: Theme.colors.outlineVariant
	},
	labelContainer: {
		...GlobalStyles.label,
	},
	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
	}
} );