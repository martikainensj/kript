import { Object, BSON, List } from 'realm';
import { Account } from './Account';
import { Transaction } from './Transaction';

export type HoldingType = {
  _id?: BSON.ObjectId;
  owner_id: string;
	account: Account;
  name: string;
  notes?: string;
	transactions?: Transaction[];
};

export class Holding extends Object<HoldingType> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  owner_id!: string;
	account!: {
		type: 'linkingObjects',
		objectType: Account,
		property: 'holdings',
	};
  name!: string;
  notes?: string;
	transactions?: Transaction[];

	static primaryKey = '_id';
}