import { Object, BSON, List, ObjectSchema } from 'realm';
import { Account } from './Account';
import { Transaction } from './Transaction';

export class Holding extends Object<Holding> {
  _id: BSON.ObjectId;
  owner_id!: string;
  name!: string;
  notes?: string;
	account!: Account;
	transactions: List<Transaction>;

	static schema: ObjectSchema = {
		name: 'Holding',
		properties: {
			_id: 'objectId',
			owner_id: 'string',
			name: 'string',
			notes: 'string?',
			account: {
				type: 'linkingObjects',
				objectType: 'Account',
				property: 'holdings',
			},
			transactions: 'Transaction[]'
		},
		primaryKey: '_id'
	}
}