import React, {
	useState,
	createContext,
	useContext,
	useCallback,
	useLayoutEffect
} from "react";
import { useStorage } from "../../hooks/useStorage";
import Translations from "../../localization/translations";
import { CONFIG } from "../../kript.config";
import { AppProvider, UserProvider, RealmProvider, useApp, useRealm } from "@realm/react";
import { LoginScreen } from "../authentication";
import { Schemas } from "../../models";
import Realm, { ClientResetMode, OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from "realm";

interface KriptRealmContext {}

const KriptRealmContext = createContext<KriptRealmContext>( {} );

export const useKriptRealm = () => useContext( KriptRealmContext );

interface KriptRealmProviderProps {
	children: React.ReactNode;
}

export const KriptRealmProvider: React.FC<KriptRealmProviderProps> = ( { children } ) => {
	const { appId } = CONFIG;

	return (
		<KriptRealmContext.Provider value={ {} }>
			<AppProvider id={ appId }>
				<UserProvider fallback={ <LoginScreen /> }>
					<RealmProvider
						schema={ Schemas }
						sync={ {
							flexible: true,
							existingRealmFileBehavior: {
								type: OpenRealmBehaviorType.DownloadBeforeOpen,
								timeOut: 1000,
								timeOutBehavior: OpenRealmTimeOutBehavior?.OpenLocalRealm,
							},
							clientReset: {
								mode: ClientResetMode.DiscardUnsyncedChanges,
							}
						} }>
						{ children }
					</RealmProvider>
				</UserProvider>
			</AppProvider>
		</KriptRealmContext.Provider>
	);
}