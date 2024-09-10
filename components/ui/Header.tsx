import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles, Spacing } from "../../constants";
import { Row } from "./Row";
import { Title } from "./Title";
import { useTheme } from "../../contexts/ThemeContext";

interface HeaderProps {
	title: string
	left?: React.ReactNode
	right?: React.ReactNode
	isScreenHeader?: boolean
	showDivider?: boolean
	children?: React.ReactNode,
	style?: ViewStyle
}

export const Header: React.FC<HeaderProps> = ({
	title,
	left,
	right,
	isScreenHeader = true,
	showDivider = true,
	children,
	style
}) => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();

	return (<>
		<View style={[
			styles.container,
			isScreenHeader && { marginTop: insets.top },
			showDivider && {
				borderBottomWidth: StyleSheet.hairlineWidth,
				borderColor: theme.colors.outlineVariant
			},
			style
		]}>
			<Row style={styles.row}>
				<View style={styles.left} children={left} />

				<View style={styles.title}>
					<Title>{title}</Title>
				</View>

				<View style={styles.right} children={right} />
			</Row>
			{children &&
				<View style={styles.children}>
					{children}
				</View>
			}
		</View>
	</>);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: Spacing.md,
		gap: Spacing.md,
	},
	row: {
		...GlobalStyles.gutter,
		flexWrap: 'nowrap',
	},
	title: {
		position: 'absolute',
		left: '20%',
		right: '20%',
		alignItems: 'center'
	},
	left: {
		gap: Spacing.md
	},
	right: {
		gap: Spacing.md
	},
	children: {
		...GlobalStyles.gutter
	}
});