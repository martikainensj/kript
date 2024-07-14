import React, { createContext, useContext, useCallback, useEffect } from "react";
import Realm, { UpdateMode } from "realm";
import { useQuery, useRealm } from "@realm/react";

import { useI18n } from "./I18nContext";
import { useUser } from "../hooks/useUser";
import { confirmation } from "../helpers";
import { Account, AccountKey, AccountValue } from "../models/Account";
import { Transaction, TransactionKey, TransactionValue } from "../models/Transaction";
import { Holding, HoldingKey, HoldingValue } from "../models/Holding";
import { DataPoint } from "../models/DataPoint";
import { IntervalType } from "../hooks/useTypes";

export type DataIdentifier = 'Account' | 'Holding' | 'Transaction';
export type DataObject = {
	'Account': Account;
	'Holding': Holding;
	'Transaction': Transaction;
};

interface DataContext {
	addAccount: ( account: Account ) => Promise<Account>;
	addTransaction: ( transaction: Transaction ) => Promise<Transaction>;
	getAccounts: () => Realm.Results<Account & Realm.Object<Account, never>>;
	getHoldings: ( options: { accountId: Realm.BSON.UUID } ) => Realm.List<Holding>;
	getTransactions: ( options: { accountId?: Realm.BSON.UUID, holdingId?: Realm.BSON.UUID } ) => Realm.List<Transaction>;
	getAccountBy: <K extends AccountKey>( key: K, value: AccountValue<K> ) => Account;
	getHoldingBy: <K extends HoldingKey>( key: K, value: HoldingValue<K>, options: { accountId: Realm.BSON.UUID } ) => Holding;
	getTransactionBy: <K extends TransactionKey>( key: K, value: TransactionValue<K>, options: { accountId?: Realm.BSON.UUID, holdingId?: Realm.BSON.UUID }) => Transaction;
	saveAccount: ( account: Account ) => Promise<Account>;
	saveHolding: ( holding: Holding ) => Promise<Holding>;
	saveTransaction: ( transaction: Transaction ) => Promise<Transaction>;
	removeObjects: <T extends DataIdentifier>( type: T, objects: DataObject[T][] ) => Promise<boolean>;
	updateVariables: <T extends Account | Holding | Transaction>( object: T, variables: Partial<T> ) => void;
	filterDataByInterval: ( dataPoints: DataPoint[], interval?: IntervalType['id'], range?: number ) => DataPoint[];
}

const DataContext = createContext<DataContext>( {
	addAccount: (): Promise<Account> => { return },
	addTransaction: (): Promise<Transaction> => { return },
	getAccounts: (): Realm.Results<Account & Realm.Object<Account, never>> => { return },
	getHoldings: (): Realm.List<Holding> => { return },
	getTransactions: (): Realm.List<Transaction> => { return },
	getAccountBy: (): Account => { return },
	getHoldingBy: (): Holding => { return },
	getTransactionBy: (): Transaction => { return },
	saveAccount: (): Promise<Account> => { return },
	saveHolding: (): Promise<Holding> => { return },
	saveTransaction: (): Promise<Transaction> => { return },	
	removeObjects: (): Promise<boolean> => { return },
	updateVariables: () => {},
	filterDataByInterval: () => { return [] },
} );

export const useData = () => useContext( DataContext );

interface DataProviderProps {
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

	const addTransaction = useCallback(( transaction: Transaction ): Promise<Transaction> => {
		const title = __( 'Add Transaction' );
		const message = `${ __( 'Adding a new transaction' ) }\n`
			+ __( 'Are you sure?' );

		const addHolding = ( holding: Holding ) => {
			const account = getAccountBy( '_id', holding.account_id );
			account.holdings.push( holding );

			return account.holdings[ account.holdings.length - 1 ];
		};

		return new Promise(( resolve, _ ) => {
			confirmation({
				title: title,
				message: message,
				onAccept: async () => {
					const newTransaction = {
						...transaction,
						_id: new Realm.BSON.UUID
					};

					realm.write(() => {
						const holding = transaction.holding_name && (
							getHoldingBy(
								'name',
								transaction.holding_name,
								{ accountId: transaction.account_id }
							) ?? addHolding({
									_id: new Realm.BSON.UUID,
									account_id: transaction.account_id,
									name: transaction.holding_name,
									owner_id: user.id
								})
						);

						if ( holding && transaction.sub_type !== 'dividend' ) {
							newTransaction.holding_id = holding._id;
							holding.transactions.push( newTransaction );

							return holding.transactions[ holding.transactions.length - 1 ];
						}

						const account = getAccountBy( '_id', transaction.account_id );
						account.transactions.push( newTransaction );

						return account.transactions[ account.transactions.length - 1 ];
					});

					resolve( newTransaction );
				}
			});
		});
	}, []);

	const saveAccount = useCallback(( editedAccount: Account ): Promise<Account> => {
		const title = __( 'Update Account' );
		const message = __( 'Updating existing account' )
			+ `: ${ editedAccount.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title: title,
				message: message,
				onAccept() {
					const account = getAccountBy(
						'_id',
						editedAccount._id
					);
					
					resolve( updateVariables( account, editedAccount ) );
				}
			});
		})
	}, []);

	const saveHolding = useCallback(( editedHolding: Holding ): Promise<Holding> => {
		const title = __( 'Save Holding' );
		const message = `${ __( 'Saving existing holding' ) }: ${ editedHolding.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title,
				message,
				onAccept() {
					const account = getAccountBy( '_id', editedHolding.account_id );
					const holding = getHoldingBy(
						'_id',
						editedHolding._id,
						{ accountId: editedHolding.account_id }
					);
					
					resolve( updateVariables( holding, editedHolding ));
				}
			});
		});
	}, []);

	const saveTransaction = useCallback(( editedTransaction: Transaction ): Promise<Transaction> => {
		const title = __( 'Save Transaction' );
		const message = __( 'Saving existing transaction' )
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			confirmation({
				title,
				message,
				onAccept() {
					const account = getAccountBy( '_id', editedTransaction.account_id );
					const transaction = getTransactionBy(
						'_id',
						editedTransaction._id,
						{
							holdingId: editedTransaction.holding_id,
							accountId: editedTransaction.account_id
						}
					);

					resolve( updateVariables( transaction, editedTransaction ));
				}
			});
		});
	}, []);

	const removeAccounts = useCallback(( accounts: Account[] ): Promise<boolean> => {
		return new Promise( ( resolve, reject ) => {
			try {
				accounts.forEach( account => {
					if ( ! account?.isValid() ) return;

					realm.write(() => {
						realm.delete( account );
					});
				});

				resolve( true );
			} catch (error) {
				reject( false );
			}
		});
	}, []);

	const removeHoldings = useCallback(( holdings: Holding[] ): Promise<boolean> => {
		return new Promise( ( resolve, reject ) => {
			try {
				holdings.forEach( holding => {
					const { _id, account_id } = holding;
					const account = getAccountBy( '_id', account_id );
					const index = account.holdings.findIndex( holding => {
						return holding._id.equals( _id );
					});

					realm.write(() => {
						account.holdings.remove( index );
					});
				});

				resolve( true );
			} catch (error) {
				reject( false );
			}
		});
	}, []);

	const removeTransactions = useCallback(( transactions: Transaction[] ): Promise<boolean> => {
		return new Promise( ( resolve, reject ) => {
			try {

				realm.write(() => {	
					transactions.forEach( transaction => {
						const { _id, holding_id, account_id } = transaction;
						const holding = getHoldingBy( '_id', holding_id, { accountId: account_id });
						const account = getAccountBy( '_id', account_id );
						const index = ( !! holding_id
							? holding
							: account
						)?.transactions.findIndex( transaction => {
							return transaction._id.equals( _id );
						});
						
						(!! holding_id ? holding : account)
							.transactions.remove( index );
					});
				});

				resolve( true );
			} catch (error) {
				reject( false );
			}
		});
	}, []);

	const removeObjects = <T extends DataIdentifier>( type: T, objects: DataObject[T][] ): Promise<boolean> => {
		const title = __( `Remove selected ${ type }s` );
		const message = __( 'Are you sure?' );

		return new Promise(( resolve, reject ) => {
			confirmation({
				title,
				message,
				onAccept: async () => {
					try {
						type === 'Account' && await removeAccounts( objects as Account[] );
						type === 'Holding' && await removeHoldings( objects as Holding[] );
						type === 'Transaction' && await removeTransactions( objects as Transaction[] );
						
						resolve( true );
					} catch ( error ) {
						reject( error );
					}
				}
			});
		});
	};

	const updateVariables = <T extends Account | Holding | Transaction> (
		object: T,
		variables: Partial<T>,
	) => {
		if ( ! object?.isValid() ) return;
	
		const hasChanges = Object.keys( variables )
			.some( key => object[ key as keyof T ] !== variables[ key as keyof T ] );
	
		if ( ! hasChanges ) return object;
	
		return realm.write(() => {
			Object.entries( variables ).forEach(([ key, value ]) => {
				object[ key as keyof T ] = value as T[ keyof T ];
			});

			return object;
		});
	};

	const filterDataByInterval = (
		data: DataPoint[],
		interval: IntervalType['id'] = 'weekly',
		range?: number
	) => {
		const getWeekNumber = ( date: Date ) => {
			date = new Date( Date.UTC(
				date.getFullYear(),
				date.getMonth(),
				date.getDate()
			));

			date.setUTCDate( 7 );
			var yearStart = new Date( Date.UTC( date.getUTCFullYear(), 0, 1 ));
			var weekNo = Math.ceil(((( date - yearStart ) / 86400000 ) + 1 ) / 7 );
			
			return weekNo;
		}

		const generateIntervalKey = ( dataPoint: DataPoint, interval: IntervalType['id']) => {
			const date = new Date( dataPoint.date );

			switch ( interval ) {
				case 'daily':
					return `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }`;
				case 'weekly':
					const week = getWeekNumber(date);
					return `${ date.getFullYear() }-W${ week }`;
				case 'monthly':
					return `${ date.getFullYear() }-${ date.getMonth() + 1 }`;
				case 'yearly':
					return `${ date.getFullYear() }`;
				default:
					throw new Error( 'Unsupported interval' );
			}
		};

		const groupByInterval = ( data: DataPoint[], interval: IntervalType['id'] ) => {
			return data.reduce(( acc, dataPoint ) => {
					const intervalKey = generateIntervalKey( dataPoint, interval );
					
					if ( ! acc[ intervalKey ] ) {
							acc[ intervalKey ] = [];
					}
					
					acc[ intervalKey ].push( dataPoint );

					return acc;
			}, {} as {[ key: string ]: DataPoint[] });
		};

		const groupedData = groupByInterval( data, interval );
		const dataFilteredByInterval = Object.values( groupedData ).map( intervalData => {
			return intervalData.reduce(( lastDataPoint, currentDataPoint ) => {
				return ( !! currentDataPoint.value && currentDataPoint.date > lastDataPoint.date ) ? currentDataPoint : lastDataPoint;
			});
		});

		const firstDataPointWithValue = dataFilteredByInterval.findIndex( dataPoint => !! dataPoint.value );

		return !! range
			? dataFilteredByInterval.slice(firstDataPointWithValue).slice( -range )
			: dataFilteredByInterval;
	}

	useEffect( () => {
		//realm.deleteAll();
		realm.subscriptions.update( mutableSubs => {
			//mutableSubs.removeAll();
			mutableSubs.add( accounts );
		} );
	}, [ accounts ] );

	return (
		<DataContext.Provider value={ {
			getAccounts,
			getHoldings,
			getTransactions,
			getAccountBy,
			getHoldingBy,
			getTransactionBy,
			addAccount,
			addTransaction,
			removeObjects,
			saveAccount,
			saveHolding,
			saveTransaction,
			updateVariables,
			filterDataByInterval,
		} }>
			{ children }
		</DataContext.Provider>
	);
}