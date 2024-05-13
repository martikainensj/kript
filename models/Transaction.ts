import Realm from "realm";

export type Transaction = {
  _id: Realm.BSON.ObjectId;
  amount: number;
  date: number;
  notes?: string;
  owner_id: string;
  price: number;
  total: number;
};

export const TransactionSchema = {
  name: 'Transaction',
  properties: {
    _id: 'objectId',
    amount: 'double',
    date: 'double',
    notes: 'string?',
    owner_id: 'string',
    price: 'double',
    total: 'double',
  },
  primaryKey: '_id',
};
