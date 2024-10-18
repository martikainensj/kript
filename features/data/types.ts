import { Ionicons } from '@expo/vector-icons';
import { Account, AccountKey, AccountValue } from '../realm/models/Account';
import { Transaction, TransactionKey, TransactionValue } from '../realm/models/Transaction';
import { Holding, HoldingKey, HoldingValue } from '../realm/models/Holding';

export type DataIdentifier = 'Account' | 'Holding' | 'Transaction';
export type DataObject = {
	'Account': Account;
	'Holding': Holding;
	'Transaction': Transaction;
};

export interface DataContextProps {
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
	isProcessing: boolean;
	setIsProcessing: React.Dispatch<React.SetStateAction<DataContextProps['isProcessing']>>;
}
interface TransactionCategoryProps {
	id: string;
	name: string;
	color?: string;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export type TransactionCategoryKey =
	| 'trading'
	| 'cash'
	| 'adjustment'
	| 'loan';

export interface TransactionCategory extends TransactionCategoryProps {
	id: TransactionCategoryKey;
}

export type TradingCategoryKey =
	| 'buy'
	| 'sell';

export interface TradingCategory extends TransactionCategoryProps {
	id: TradingCategoryKey;
}

export type CashCategoryKey =
	| 'deposit'
	| 'withdrawal'
	| 'dividend';

export interface CashCategory extends TransactionCategoryProps {
	id: CashCategoryKey;
}

export type AdjustmentCategoryKey =
	| 'stockSplit' 
	| 'merger'
	| 'priceUpdate'
	| 'amountUpdate'
	| 'update';

export interface AdjustmentCategory extends TransactionCategoryProps {
	id: AdjustmentCategoryKey;
}

export type LoanCategoryKey =
	| 'disbursement'
	| 'repayment';

export interface LoanCategory extends TransactionCategoryProps {
	id: LoanCategoryKey;
}

export interface SortingProps {
	id: string;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
	name: string;
	function: (a: any, b: any) => number;
}