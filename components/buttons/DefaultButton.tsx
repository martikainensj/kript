import { StyleSheet } from 'react-native';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { BorderRadius, FontSize, FontWeight, Spacing, Theme } from '../../constants';

export const DefaultButton: React.FC<ButtonProps> = ( {
	mode = 'contained',
	children,
	style,
	labelStyle,
	contentStyle,
	...rest
}: ButtonProps ) => {
  return (
		<PaperButton
			mode={ mode }
			style={ [ styles.container, style ] }
			labelStyle={ [ styles.label, labelStyle ] }
			contentStyle={ [ styles.content, contentStyle ] }
			theme={ Theme }
			{ ...rest }>
			{ children }
		</PaperButton>
  );
}

const styles = StyleSheet.create( {
  container: {
    borderRadius: BorderRadius.xl
  },
	label: {
		fontSize: FontSize.md,
		fontWeight: FontWeight.regular
	},
	content: {
		gap: Spacing.sm
	}
} );