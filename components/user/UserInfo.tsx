import { ScrollView, View } from "react-native"
import { Text } from "react-native-paper";
import { useUser } from "../../hooks/useUser";
import { DefaultButton } from "../buttons";
import { useI18n } from "../contexts/I18nContext";
import { router } from "expo-router";
import { confirmation } from "../../helpers";
interface UserProps {

}

export const UserInfo: React.FC<UserProps> = () => {
	const { __ } = useI18n();
	const { data, logOut } = useUser();


	return <View>
		<Text>{ JSON.stringify( data ) }</Text>
		<DefaultButton onPress={ logOut }>
			{ __( 'Logout' ) }
		</DefaultButton>
	</View>
}