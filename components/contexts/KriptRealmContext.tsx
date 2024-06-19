import React, {
	createContext,
	useContext,
} from "react";
import { CONFIG } from "../../kript.config";
import { AppProvider, UserProvider, RealmProvider } from "@realm/react";
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