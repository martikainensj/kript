import Realm from 'realm';
import { Adjustment, Cash, Loan, Trading, Transaction as TransactionProps } from '../hooks/useTypes';

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
	type: TransactionProps['id'];
	sub_type: Trading['id'] | Cash['id'] | Adjustment['id'] | Loan['id'];
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
