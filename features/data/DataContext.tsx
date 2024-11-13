import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import Realm, { UpdateMode } from "realm";
import { useQuery, useRealm } from "@realm/react";

import { useAlert } from "../alerts/AlertContext";
import { useI18n } from "../i18n/I18nContext";
import { useUser } from "../realm/useUser";
import { Account, AccountKey, AccountValue } from "../realm/models/Account";
import { Holding, HoldingKey, HoldingValue } from "../realm/models/Holding";
import { Transaction, TransactionKey, TransactionValue } from "../realm/models/Transaction";
import { DataContextProps, DataIdentifier, DataObject } from "./types";

const DataContext = createContext<DataContextProps>( {
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
	isProcessing: false,
	setIsProcessing: () => {},
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
	const { show } = useAlert();
	const [ isProcessing, setIsProcessing ] = useState( false );
	
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
		const title = __( 'Add a new Account' );
		const message = `${ __( 'Adding a new account' ) }: ${ account.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			show({
				title,
				message,
				type: 'confirmation',
				params: {
					onConfirm() {
						setIsProcessing( true );

						resolve( realm.write(() => {
							const createdAccount = realm.create( 'Account', account, UpdateMode.Never );
							setIsProcessing( false );
	
							return createdAccount;
						}));
					},
					onCancel() {}
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
			show({
				title,
				message,
				type: 'confirmation',
				params: {
					onConfirm: async () => {
						setIsProcessing( true );
	
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
	
						setIsProcessing( false );
						resolve( newTransaction );
					},
					onCancel() {}
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
			show({
				title,
				message,
				type: 'confirmation',
				params: {
					onConfirm() {
						setIsProcessing( true );
	
						const account = getAccountBy(
							'_id',
							editedAccount._id
						);
						const udpatedAccount = updateVariables( account, editedAccount );
						setIsProcessing( false );
	
						resolve( udpatedAccount );
					},
					onCancel() {}
				}
			});
		})
	}, []);

	const saveHolding = useCallback(( editedHolding: Holding ): Promise<Holding> => {
		const title = __( 'Update Holding' );
		const message = `${ __( 'Updating existing holding' ) }: ${ editedHolding.name }`
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			show({
				title,
				message,
				type: 'confirmation',
				params: {
					onConfirm() {
						setIsProcessing( true );
						
						const holding = getHoldingBy(
							'_id',
							editedHolding._id,
							{ accountId: editedHolding.account_id }
						);
						const updatedHolding = updateVariables( holding, editedHolding );

						setIsProcessing( false );
						resolve( updatedHolding );
					},
					onCancel() {}
				}
			});
		});
	}, []);

	const saveTransaction = useCallback(( editedTransaction: Transaction ): Promise<Transaction> => {
		const title = __( 'Save Transaction' );
		const message = __( 'Saving existing transaction' )
			+ "\n" + __( 'Are you sure?' );

		return new Promise(( resolve, _ ) => {
			show({
				title,
				message,
				type: 'confirmation',
				params: {
					onConfirm() {
						setIsProcessing( true );

						const transaction = getTransactionBy(
							'_id',
							editedTransaction._id,
							{
								holdingId: editedTransaction.holding_id,
								accountId: editedTransaction.account_id
							}
						);

						if ( editedTransaction.type === 'adjustment' ) {
							const hasHigherPrice = editedTransaction.price > transaction.price;
							const hasLowerPrice = editedTransaction.price < transaction.price;
							const hasIncreasedAmount = editedTransaction.amount > transaction.amount;
							const hasDecreasedAmount = editedTransaction.amount < transaction.amount;
							
							if ( hasIncreasedAmount && hasLowerPrice ) {
								editedTransaction.sub_type = 'stockSplit';
							} else if ( hasDecreasedAmount && hasHigherPrice ) {
								editedTransaction.sub_type = 'merger';
							} else if ( hasHigherPrice || hasLowerPrice ) {
								editedTransaction.sub_type = 'priceUpdate';
							} else if ( hasIncreasedAmount || hasDecreasedAmount ) {
								editedTransaction.sub_type = 'amountUpdate';
							}
						}

						const updatedTransaction =  updateVariables( transaction, editedTransaction );
						setIsProcessing( false );

						resolve( updatedTransaction );
					},
					onCancel() {}
				}
			});
		});
	}, []);

	const removeAccounts = useCallback(( accounts: Account[] ): Promise<boolean> => {
		return new Promise( ( resolve, reject ) => {
			setIsProcessing( true );

			try {
				accounts.forEach( account => {
					if ( ! account?.isValid() ) return;

					realm.write(() => {
						realm.delete( account );
					});
				});

				setIsProcessing( false );
				resolve( true );
			} catch (error) {
				setIsProcessing( false );
				reject( false );
			}
		});
	}, []);

	const removeHoldings = useCallback(( holdings: Holding[] ): Promise<boolean> => {
		return new Promise( ( resolve, reject ) => {
			setIsProcessing( true );

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

				setIsProcessing( false );
				resolve( true );
			} catch (error) {
				setIsProcessing( false );
				reject( false );
			}
		});
	}, []);

	const removeTransactions = useCallback(( transactions: Transaction[] ): Promise<boolean> => {
		return new Promise( ( resolve, reject ) => {
			setIsProcessing( true );

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

				setIsProcessing( false );
				resolve( true );
			} catch (error) {
				setIsProcessing( false );
				reject( false );
			}
		});
	}, []);

	const removeObjects = <T extends DataIdentifier>( type: T, objects: DataObject[T][] ): Promise<boolean> => {
		const title = __( `Remove ${ type }${objects.length > 1 ? "s" : ""}` );
		const message = __( 'Are you sure?' );

		return new Promise(( resolve, reject ) => {
			show({
				title,
				message,
				type: 'confirmation',
				params: {
					onConfirm: async () => {
						setIsProcessing( true );

						try {
							type === 'Account' && await removeAccounts( objects as Account[] );
							type === 'Holding' && await removeHoldings( objects as Holding[] );
							type === 'Transaction' && await removeTransactions( objects as Transaction[] );
							
							setIsProcessing( false );
							resolve( true );
						} catch ( error ) {
							setIsProcessing( false );
							reject( error );
						}
					},
					onCancel() {}
				}
			});
		});
	};

	const updateVariables = <T extends Account | Holding | Transaction> (
		object: T,
		variables: Partial<T>,
	) => {
		if ( ! object?.isValid() || realm.isInTransaction ) return;
		
		if ( !! variables._id ) {
			delete variables._id;
		}

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
			isProcessing,
			setIsProcessing,
		} }>
			{ children }
		</DataContext.Provider>
	);
}