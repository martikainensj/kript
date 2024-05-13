import Realm from "realm";
import { Transaction } from "./Transaction";

export type Holding = {
  _id: Realm.BSON.ObjectId;
  name: string;
  notes?: string;
  owner_id: string;
  transactions: Realm.List<Transaction>;
};

export const HoldingSchema = {
  name: 'Holding',
  properties: {
    _id: 'objectId',
    name: 'string',
    notes: 'string?',
    owner_id: 'string',
    transactions: 'Transaction[]',
  },
  primaryKey: '_id',
};
