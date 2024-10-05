import Realm from 'realm';
import { TransactionCategory, CashCategory, LoanCategory, TradingCategory, AdjustmentCategory } from '../../data/types';

export type Transaction = {
	_id: Realm.BSON.UUID;
	amount?: number;
	date: number;
	notes?: string;
	owner_id: string;
	price?: number;
	total?: number;
	account_id: Realm.BSON.UUID;
	holding_name?: string;
	holding_id?: Realm.BSON.UUID;
	type: TransactionCategory['id'];
	sub_type: TradingCategory['id'] | CashCategory['id'] | AdjustmentCategory['id'] | LoanCategory['id'];
	isValid?: () => boolean;
	checksum?: string;
};

export type TransactionKey = keyof Transaction;
export type TransactionValue<K extends TransactionKey> = Transaction[K];

export const TransactionSchema = {
	name: 'Transaction',
	embedded: true,
	properties: {
		_id: { type: 'uuid', indexed: true },
		amount: 'double?',
		date: 'double',
		notes: 'string?',
		owner_id: 'string',
		price: 'double?',
		total: 'double?',
		account_id: 'uuid',
		holding_name: 'string?',
		holding_id: 'uuid?',
		type: 'string',
		sub_type: 'string',
		checksum: 'string?',
	}
};
