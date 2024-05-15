import Realm from 'realm';
import { Holding } from './Holding';

export type Account = {
  _id: Realm.BSON.ObjectId;
  name: string;
  notes?: string;
  owner_id: string;
  holdings?: Realm.List<Holding>;
};

export const AccountSchema = {
  name: 'Account',
  properties: {
    _id: 'objectId',
    name: 'string',
    notes: 'string?',
    owner_id: 'string',
    holdings: 'Holding[]',
  },
  primaryKey: '_id',
};