import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles, Spacing } from "../../constants";
import { Row } from "./Row";
import { Title } from "./Title";
import { useTheme } from "../../features/theme/ThemeContext";

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

	return (
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
				{left &&
					<View style={styles.left} children={left} />
				}

				<View style={styles.title}>
					<Title>{title}</Title>
				</View>

				{right &&
					<View style={styles.right} children={right} />
				}
			</Row>
			{children &&
				<View style={styles.children}>
					{children}
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingVertical: Spacing.md,
		gap: Spacing.md,
	},
	row: {
		...GlobalStyles.slice,
		flexWrap: 'nowrap',
	},
	title: {
		flex: 1,
		flexShrink: 1,
		alignItems: 'flex-start'
	},
	left: {
		gap: Spacing.md
	},
	right: {
		gap: Spacing.md
	},
	children: {
		...GlobalStyles.slice
	}
});