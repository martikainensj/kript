import React, {
	createContext,
	useContext,
} from "react";
import { AppProvider, UserProvider, RealmProvider as RProvider } from "@realm/react";
import { LoginScreen } from "./LoginScreen";
import { Schemas } from "./schemas";
import { ClientResetMode, OpenRealmBehaviorType, OpenRealmTimeOutBehavior } from "realm";
import { DataProvider } from "../data/DataContext";

interface RealmContext {}

const RealmContext = createContext<RealmContext>( {} );

export const useRealm = () => useContext( RealmContext );

interface RealmProviderProps {
	children: React.ReactNode;
}

export const RealmProvider: React.FC<RealmProviderProps> = ( { children } ) => {
  const appId = process.env.EXPO_PUBLIC_APP_ID;

	return (
		<RealmContext.Provider value={ {} }>
			<AppProvider id={ appId }>
				<UserProvider fallback={ <LoginScreen /> }>
					<RProvider
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
					</RProvider>
				</UserProvider>
			</AppProvider>
		</RealmContext.Provider>
	);
}