import { StyleSheet } from 'react-native';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { BorderRadius, GlobalStyles, Spacing } from '../../constants';

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
		...GlobalStyles.lead
	},
	content: {
		gap: Spacing.sm
	}
} );