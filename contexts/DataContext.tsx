import React, {
	useState,
	createContext,
	useContext,
	useCallback,
	useMemo,
	useEffect,
} from "react";
import { useUser } from "../hooks/useUser";
import { useI18n } from "./I18nContext";
import Realm, { UpdateMode } from "realm";
import { useQuery, useRealm } from "@realm/react";
import { Account, AccountKey, AccountValue } from "../models/Account";
import { Transaction, TransactionKey, TransactionValue } from "../models/Transaction";
import { Holding, HoldingKey, HoldingValue } from "../models/Holding";
import { confirmation } from "../helpers";
import { router } from "expo-router";

// TODO: saveHolding, saveTransaction, updateAccountVariables, updateHoldingVariables, updateTransactionVariables
// Kato saisko noi variabletUpdatet yhdistettyy jollai <K> hommelil
interface DataContext {
	addAccount: ( account: Account ) => Promise<Account>;
	addHolding: ( holding: Holding ) => Promise<Holding>;
	addTransaction: ( transaction: Transaction ) => Promise<Transaction>;
	getAccounts: () => Realm.Results<Account & Realm.Object<Account, never>>;
	getHoldings: ( options: { accountId: Realm.BSON.UUID } ) => Realm.List<Holding>;
	getTransactions: ( options: { accountId?: Realm.BSON.UUID, holdingId?: Realm.BSON.UUID } ) => Realm.List<Transaction>;
	getAccountBy: <K extends AccountKey>( key: K, value: AccountValue<K> ) => Account;
	getHoldingBy: <K extends HoldingKey>( key: K, value: HoldingValue<K>, options: { accountId: Realm.BSON.UUID } ) => Holding;
	getTransactionBy: <K extends TransactionKey>( key: K, value: TransactionValue<K>, options: { accountId?: Realm.BSON.UUID, holdingId?: Realm.BSON.UUID }) => Transaction;
	saveAccount: ( account: Account ) => Promise<Account>;
	removeAccount: ( account: Account ) => Promise<boolean>;
	removeHolding: ( holding: Holding ) => Promise<boolean>;
	removeTransaction: ( transaction: Transaction ) => Promise<boolean>;
}

const DataContext = createContext<DataContext>( {
	addAccount: (): Promise<Account> => { return },
	addHolding: (): Promise<Holding> => { return },
	addTransaction: (): Promise<Transaction> => { return },
	getAccounts: (): Realm.Results<Account & Realm.Object<Account, never>> => { return },
	getHoldings: (): Realm.List<Holding> => { return },
	getTransactions: (): Realm.List<Transaction> => { return },
	getAccountBy: (): Account => { return },
	getHoldingBy: (): Holding => { return },
	getTransactionBy: (): Transaction => { return },
	saveAccount: (): Promise<Account> => { return },
	removeAccount: (): Promise<boolean> => { return },
	removeHolding: (): Promise<boolean> => { return },
	removeTransaction: (): Promise<boolean> => { return },
} );

export const useData = () => useContext( DataContext );

interface DataProviderProps {
	_id: Realm.BSON.UUID;
	children: React.ReactNode
}
export const DataProvider: React.FC<DataProviderProps> = ( { children } ) => {
	const { user } = useUser();
	const { __ } = useI18n();
	const realm = useRealm();
	const accounts = useQuery<Account>( 'Account' );

	// Getters

	const getAccounts = useCallback(() => {
		return accounts;
	}, []);

	const getHoldings = useCallback((
		options: {
			accountId: Realm.BSON.UUID
		}
	) => {
		const account = getAccountBy( '_id', options.accountId );
		return account?.holdings;
	}, []);

	const getTransactions = useCallback((
		options: {
			holdingId?: Realm.BSON.UUID,
			accountId: Realm.BSON.UUID
		}
	) => {
		if ( options.holdingId ) {
			const holding = getHoldingBy(
				'_id',
				options.holdingId,
				{ accountId: options.accountId }
			);

			return holding?.transactions;
		}

		const account = getAccountBy( '_id', options.accountId );
		return account?.transactions;
	}, []);

	const getAccountBy = useCallback( <K extends AccountKey>( key: K, value: AccountValue<K> ) => {
		const account = accounts?.filtered( `${key} == $0`, value )[0];

		return account;
	}, [ accounts ] );

	const getHoldingBy = useCallback( <K extends HoldingKey>(
		key: K,
		value: HoldingValue<K>,
		options: {
			accountId: Realm.BSON.UUID
		}
	) => {
		const account = getAccountBy( '_id', options.accountId );
		const holding = account?.holdings
			.filtered( `${key} == $0`, value )[0];

		return holding;
	}, [] );

	const getTransactionBy = useCallback( <K extends TransactionKey>(
		key: K,
		value: TransactionValue<K>,
		options: {
			accountId: Realm.BSON.UUID,
			holdingId: Realm.BSON.UUID
		}
	) => {
		const holding = !! options.holdingId && getHoldingBy(
			'_id',
			options.holdingId,
			{ accountId: options.accountId }
		);

		const account = ! holding && getAccountBy(
			'_id',
			options.accountId
		);

		const transaction = !! holding
		? holding?.transactions
			.filtered( `${key} == $0`, value )[0]
		: account?.transactions
			.filtered( `${key} == $0`, value )[0];

		return transaction;
	}, [] );

	// Setters

	const addAccount = useCallback(( account: Account ): Promise<Account> => {
		const title = __( 'Add Account' );
		const message = `${ __( 'Adding a new account' ) }: ${ account.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title: title,
				message: message,
				onAccept() {
					resolve( realm.write(() => {
						 return realm.create( 'Account', account, UpdateMode.Never );
					}));
				}
			});
		});
	}, []);

	const addHolding = useCallback(( holding: Holding ) => {
		return realm.write( async () => {
			const account = getAccountBy( '_id', holding.account_id );
			account.holdings.push( holding );

			return account.holdings[ account.holdings.length - 1 ];
		});
	}, []);

	const addTransaction = useCallback(( transaction: Transaction ): Promise<Transaction> => {
		const title = __( 'Add Transaction' );
		const message = `${ __( 'Adding a new transaction' ) }\n`
			+ __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title: title,
				message: message,
				onAccept: async () => {
					const newTransaction = {
						...transaction,
						_id: new Realm.BSON.UUID
					};

					const holding = transaction.holding_name && (
						getHoldingBy(
							'name',
							transaction.holding_name,
							{ accountId: transaction.account_id }
						) ?? await addHolding({
								_id: new Realm.BSON.UUID,
								account_id: transaction.account_id,
								name: transaction.holding_name,
								owner_id: user.id
							})
					);

					resolve( realm.write( async () => {
						if ( newTransaction.holding_id ) {
							holding.transactions.push( newTransaction )
							return holding.transactions[ holding.transactions.length - 1 ];
						}

						const account = getAccountBy( '_id', transaction.account_id );
						account.transactions.push( newTransaction );

						return account.transactions[ account.transactions.length - 1 ];
					}));
				}
			});
		});
	}, []);

	const saveAccount = useCallback(( account: Account ): Promise<Account> => {
		const title = __( 'Update Account' );
		const message = __( 'Updating existing account' )
			+ `: ${ account.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title: title,
				message: message,
				onAccept() {
					resolve( realm.write(() => {
						return realm.create( 'Account', account, Realm.UpdateMode.Modified );
					}));
				}
			});
		})
	}, []);

	const removeAccount = useCallback(( account: Account ): Promise<boolean> => {
		const title = __( 'Remove Account' );
		const message = `${ __( 'Removing existing account' ) }: ${ account.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title,
				message,
				onAccept() {
					router.navigate( 'accounts/' );

					realm.write(() => {
						realm.delete( account );
					});

					resolve( true );
				}
			});
		});
	}, []);

	const removeHolding = useCallback(( holding: Holding ): Promise<boolean> => {
		const title = __( 'Remove Holding' );
		const message = `${ __( 'Removing existing holding' ) }: ${ holding.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title,
				message,
				onAccept() {
					const { _id, account_id } = holding;
					const account = getAccountBy( '_id', account_id );
					const index = account.holdings.findIndex( holding => {
						return holding._id.equals( _id );
					});

					realm.write(() => {
						account.holdings.remove( index );
					});

					resolve( true );
				}
			});
		});
	}, []);

	const removeTransaction = useCallback(( transaction: Transaction ): Promise<boolean> => {
		const title = __( 'Remove Transaction' );
		const message = __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title,
				message,
				onAccept() {
					const { _id, holding_id, account_id } = transaction;
					const holding = getHoldingBy( '_id', holding_id, { accountId: account_id });
					const account = getAccountBy( '_id', account_id );
					const index = ( !! holding_id
						? holding
						: account
					)?.transactions.findIndex( transaction => {
						return transaction._id.equals( _id );
					});

					realm.write(() => {
						( !! holding_id
							? holding
							: account
						).transactions.remove( index );
					});

					resolve( true );
				}
			});
		});
	}, []);

  return (
    <DataContext.Provider value={ {
			getAccounts,
			getHoldings,
			getTransactions,
			getAccountBy,
			getHoldingBy,
			getTransactionBy,
			addAccount,
			addHolding,
			addTransaction,
			removeAccount,
			removeHolding,
			removeTransaction,
			saveAccount,
		} }>
      { children }
    </DataContext.Provider>
  );
}