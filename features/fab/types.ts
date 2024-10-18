import { Ionicons } from '@expo/vector-icons';

export interface Action {
	label?: string;
	onPress?: () => void;
	onLongPress?: () => void;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
}