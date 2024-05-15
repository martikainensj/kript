import Realm from 'realm';
import { Holding } from './Holding';
import { Transfer } from './Transfer';

export type Account = {
  _id: Realm.BSON.ObjectId;
  name: string;
  notes?: string;
  owner_id: string;
  holdings?: Realm.List<Holding>;
  transfers?: Realm.List<Transfer>;
};

export const AccountSchema = {
  name: 'Account',
  properties: {
    _id: 'objectId',
    name: 'string',
    notes: 'string?',
    owner_id: 'string',
    holdings: 'Holding[]',
		transfers: 'Transfer[]',
  },
  primaryKey: '_id',
};