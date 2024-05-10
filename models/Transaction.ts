import { Object, BSON, ObjectSchema } from 'realm';
import { Account } from './Account';
import { Holding } from './Holding';

export class Transaction extends Object<Transaction> {
  _id: BSON.ObjectId;
  owner_id!: string;
	price!: number;
	amount!: number;
	total!: number;
	date!: number;
  notes?: string;
	account!: Account;
	holding!: Holding;

	static schema: ObjectSchema = {
		name: 'Transaction',
		properties: {
			_id: 'objectId',
			owner_id: 'string',
			price: 'double',
			amount: 'double',
			total: 'double',
			date: 'double',
			notes: 'string?',
			account: {
				type: 'linkingObjects',
				objectType: 'Account',
				property: 'transactions',
			},
			holding: {
				type: 'linkingObjects',
				objectType: 'Holding',
				property: 'transactions',
			}
		},
		primaryKey: '_id'
	}
}