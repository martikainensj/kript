import { useApp, useAuth, useUser as useRealmUser } from "@realm/react"
import { User as RealmUser } from "realm"

import { confirmation } from "../helpers";
import { useI18n } from "../components/contexts/I18nContext";
import { useMemo } from "react";

export interface UserDataKeys {
	'name': { type: string };
}

export type UserDataKey = keyof UserDataKeys;
export type UserDataValue<K extends UserDataKey> = UserDataKeys[K]['type'];

export type User = {
  [K in keyof UserDataKeys]: UserDataValue<K>
};

export const useUser = () => {
	const app = useApp();
	const { logOut: authLogOut } = useAuth();
	const user: RealmUser = useRealmUser();
	const { __ } = useI18n();

	const userDataCollection = user
		.mongoClient('mongodb-atlas')
		.db('Users')
		.collection('UserData');
		
	const filter = {
		userId: user.id,
	};

	const options = { upsert: true };

	const emptyData = <User>{
		'name': ''
	};

	const data = useMemo( () => {
    const test = Object.fromEntries(
			Object.entries( { ...emptyData, ...user.customData } ).filter( ( [ key ] ) => {
				return Object.keys( emptyData ).includes( key )
			} )
		) as User;
		
		return test;
	}, [ user ] );

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
		data,
		setData, getData, refreshData
	}
}