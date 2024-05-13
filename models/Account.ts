import Realm from 'realm';
import { Transaction } from './Transaction';
import { Holding } from './Holding';

export type Account = {
  _id: Realm.BSON.ObjectId;
  holdings: Realm.List<Holding>;
  name: string;
  notes?: string;
  owner_id: string;
  transactions: Realm.List<Transaction>;
};

export const AccountSchema = {
  name: 'Account',
  properties: {
    _id: 'objectId',
    holdings: 'Holding[]',
    name: 'string',
    notes: 'string?',
    owner_id: 'string',
    transactions: 'Transaction[]',
  },
  primaryKey: '_id',
};