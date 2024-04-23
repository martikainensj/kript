import { Alert } from "react-native";

interface Confirmation {
	title: string,
	message?: string,
	onAccept: () => void,
	onCancel?: () => void
}

export const confirmation = ( { title, message, onAccept, onCancel }: Confirmation ) => {
	Alert.alert(
		title, 
		message, 
		[
			{
				text: 'Cancel',
				style: 'cancel',
				onPress: onCancel
			},
			{
				text: 'OK',
				onPress: onAccept
			}
		]
	);
}