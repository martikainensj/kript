import React, {
	createContext,
	useContext,
} from "react";
import { AppProvider, UserProvider, RealmProvider } from "@realm/react";
import { LoginScreen } from "../components/authentication";
import { Schemas } from "../models";
import { ClientResetMode, OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from "realm";
import { DataProvider } from "./DataContext";

interface KriptRealmContext {}

const KriptRealmContext = createContext<KriptRealmContext>( {} );

export const useKriptRealm = () => useContext( KriptRealmContext );

interface KriptRealmProviderProps {
	children: React.ReactNode;
}

export const KriptRealmProvider: React.FC<KriptRealmProviderProps> = ( { children } ) => {
  const appId = process.env.EXPO_PUBLIC_APP_ID;

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
						<DataProvider>
							{ children }
						</DataProvider>
					</RealmProvider>
				</UserProvider>
			</AppProvider>
		</KriptRealmContext.Provider>
	);
}