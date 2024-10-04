import { useApp, useAuth, useUser as useRealmUser } from "@realm/react";
import { User as RealmUser } from "realm";

import { useI18n } from "../i18n/I18nContext";
import { UserKey, UserValue } from "./types";
import { useAlert } from "../alerts/AlertContext";

export const useUser = () => {
	const app = useApp();
	const { logOut: authLogOut } = useAuth();
	const user: RealmUser = useRealmUser();
	const { show } = useAlert();
	const { __ } = useI18n();

	const userDataCollection = user
		.mongoClient('mongodb-atlas')
		.db('Users')
		.collection('UserData');

	const filter = {
		userId: user.id,
	};

	const options = { upsert: true };

	const set = async <K extends UserKey>(key: K, value: UserValue<K>) => {
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
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	const get = <K extends UserKey>(key: K) => {
		try {
			return user.customData[key]
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	const refresh = async () => {
		await user.refreshCustomData();
	}

	const logOut = () => {
		show({
			title: __('Logout'),
			message: __('Are you sure?'),
			type: 'confirmation',
			params: {
				onConfirm: authLogOut,
				onCancel() {}
			}
		});
	}

	const removeUser = async () => {
		// TODO: clear customData and data
		//await app.deleteUser( user );
	}

	return {
		user, removeUser, logOut,
		set, get, refresh
	}
}