import Realm, { ObjectSchema } from 'realm';

export class Account extends Realm.Object<Account> {
	_id!: Realm.BSON.ObjectId;
  name!: string;
  notes?: string;

  static schema: ObjectSchema = {
    primaryKey: '_id',
    name: 'Account',
    properties: {
      _id: 'objectId',
      name: 'string',
      notes: 'string?',
    },
  };
}

