import { useApp, useAuth, useUser as useRealmUser } from "@realm/react"
import { User } from "realm"

import { confirmation } from "../helpers";
import { useI18n } from "../components/contexts/I18nContext";

interface UserDataKeys {
  'name': { type: string };
}

type UserDataKey = keyof UserDataKeys;
type UserDataValue<K extends UserDataKey> = UserDataKeys[K]['type'];

export const useUser = () => {
	const app = useApp();
	const { logOut: authLogOut } = useAuth();
	const user: User = useRealmUser();
	const { __ } = useI18n();

	const userDataCollection = user
		.mongoClient('mongodb-atlas')
		.db('Users')
		.collection('UserData');
		
	const filter = {
		userId: user.id,
	};

	const options = { upsert: true };

	const setData = async <K extends UserDataKey>( key: K, value: UserDataValue<K> ) => {
    try {
			const updateDoc = {
				$set: {
					userId: user.id,
					[key]: value
				}
			}
	
			await userDataCollection.updateOne(
				filter,
				updateDoc,
				options
			);

			return await user.refreshCustomData();
    } catch ( error ) {
      console.log( error );
			return null;
    }
  };

  const getData = <K extends UserDataKey>( key: K ) => {
    try {
      return user.customData[key]
    } catch ( error ) {
      console.log( error );
      return null;
    }
  };

	const refreshData = async () => {
		await user.refreshCustomData();
	}
	
	const logOut = () => {
		confirmation( {
			title: __( 'Logout' ),
			message: __( 'Are you sure?' ),
			onAccept: authLogOut
		} );
	}

	const removeUser = async () => {
		//await app.deleteUser( user );
	}


	return {
		user, removeUser, logOut,
		data: user.customData, setData, getData, refreshData }
}