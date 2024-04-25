import { Object, BSON } from 'realm';

export type AccountType = {
  _id?: BSON.ObjectId;
  name: string;
  notes?: string;
  owner_id: string;
};

export class Account extends Object<AccountType> {
  _id: BSON.ObjectId = new BSON.ObjectId();
  name!: string;
  notes?: string;
  owner_id!: string;

	static primaryKey = '_id';
}
