import { Object, BSON } from 'realm';

export class Account extends Object<Account> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  name!: string;
  notes?: string = '';

	static primaryKey = '_id';
}

