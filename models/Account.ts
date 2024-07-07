import Realm from 'realm';
import { Holding } from './Holding';
import { Transaction } from './Transaction';
import { DataPoint } from './DataPoint';

export type Account = {
	_id: Realm.BSON.UUID;
	name: string;
	notes?: string;
	owner_id: string;
	holdings?: Realm.List<Holding>;
	transactions?: Realm.List<Transaction>;
	isValid?: () => boolean;
	total?: number;
	cashAmount?: number;
	balance?: number;
	value?: number;
	totalValue?: number;
	totalCost?: number;
	returnValue?: number;
	returnPercentage?: number;
	valueHistoryData?: DataPoint[];
	returnHistoryData?: DataPoint[];
	checksum?: string;
};

export type AccountKey = keyof Account;
export type AccountValue<K extends AccountKey> = Account[K];

export const AccountSchema = {
	name: 'Account',
	properties: {
		_id: { type: 'uuid', indexed: true },
		name: { type: 'string', indexed: true },
		notes: 'string?',
		owner_id: 'string',
		holdings: 'Holding[]',
		transactions: 'Transaction[]',
		total: 'double?',
		cashAmount: 'double?',
		balance: 'double?',
		value: 'double?',
		totalValue: 'double?',
		totalCost: 'double?',
		returnValue: 'double?',
		returnPercentage: 'double?',
		valueHistoryData: 'DataPoint[]',
		returnsHistoryData: 'DataPoint[]',
		checksum: 'string?',
	},
	primaryKey: '_id',
};