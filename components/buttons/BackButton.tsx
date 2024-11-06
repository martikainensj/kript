import IconButton from './IconButton';
import { useRouter } from 'expo-router';

export const BackButton: React.FC = () => {
	const { canGoBack, back } = useRouter();

	if (!canGoBack()) return;

	return (
		<IconButton
			icon={'chevron-back'}
			onPress={back}
		/>
	)
}