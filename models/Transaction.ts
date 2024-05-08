import { Object, BSON, List } from 'realm';
import { Account } from './Account';
import { Holding } from './Holding';

export type TransactionType = {
  _id?: BSON.ObjectId;
  owner_id: string;
	account: Account;
	holding: Holding;
	price: number;
	amount: number;
	total: number;
	date: number;
  notes?: string;
};

export class Transaction extends Object<TransactionType> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  owner_id!: string;
	account!: {
		type: 'linkingObjects',
		objectType: Account,
		property: 'transactions',
	};
	holding!: {
		type: 'linkingObjects',
		objectType: Holding,
		property: 'transactions',
	};
	price!: number;
	amount!: number;
	total!: number;
	date!: number;
  notes?: string;

	static primaryKey = '_id';
}
