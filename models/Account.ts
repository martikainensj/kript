import { Object, BSON, List, ObjectSchema } from 'realm';
import { Transaction } from './Transaction';
import { Holding } from './Holding';

export class Account extends Object<Account> {
  _id: BSON.ObjectId;
  owner_id!: string;
  name!: string;
  notes?: string;
	transactions: List<Transaction>;
	holdings: List<Holding>;

	static schema: ObjectSchema = {
		name: 'Account',
		properties: {
			_id: 'objectId',
			owner_id: 'string',
			name: 'string',
			notes: 'string?',
			transactions: 'Transaction[]',
			holdings: 'Holding[]'
		},
		primaryKey: '_id'
	}
}
