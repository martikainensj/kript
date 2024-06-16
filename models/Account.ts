import Realm from 'realm';
import { Holding } from './Holding';
import { Transaction } from './Transaction';

export type Account = {
  _id: Realm.BSON.UUID;
  name: string;
  notes?: string;
  owner_id: string;
  holdings?: Realm.List<Holding>;
  transactions?: Realm.List<Transaction>;
	isValid?: () => boolean;
};

export const AccountSchema = {
  name: 'Account',
  properties: {
    _id: 'uuid',
    name: 'string',
    notes: 'string?',
    owner_id: 'string',
    holdings: 'Holding[]',
		transactions: 'Transaction[]',
  },
  primaryKey: '_id',
};